import type {AbiItem} from "web3-utils";
import type {Contract} from "web3-eth-contract";
import type Web3 from "web3";
import {
    Account,
    Address,
    ByteString,
    GnosisSafeOps,
    GnosisSafeTransaction,
    validateSafeTransaction
} from "./gnosisSafeTransaction";
import {EMPTY_DATA, GNOSIS_SAFE_ABI, ZERO_ADDRESS} from "../consts";
import {BN} from "ethereumjs-util";
import {signRawTransaction} from "../signRawTransaction";
import {sendSignedRawTransaction} from "../sendSignedRawTransaction";
import {config} from "../config";
import EthLibAccount from "eth-lib/lib/account";

export class GnosisSafeProxy
{
    readonly creatorAddress: Address;
    readonly safeProxyAddress: Address;
    readonly web3: Web3;
    readonly proxyContract: Contract;

    constructor(web3: Web3, creatorAddress: Address, safeProxyAddress: Address)
    {
        this.web3 = web3;
        this.creatorAddress = creatorAddress;
        this.safeProxyAddress = safeProxyAddress;
        this.proxyContract = new this.web3.eth.Contract(<AbiItem[]>GNOSIS_SAFE_ABI, this.safeProxyAddress);
    }

    async getOwners(): Promise<string[]>
    {
        return await this.proxyContract.methods.getOwners().call();
    }

    async getNonce(): Promise<number>
    {
        return parseInt(await this.proxyContract.methods.nonce().call());
    }

    async sendEth(account: Account, value: BN, to: Address)
    {
        const safeTransaction = <GnosisSafeTransaction>{
            value: value,
            to: to,
            operation: GnosisSafeOps.CALL,
            data: "0x",
            gasToken: ZERO_ADDRESS,
            refundReceiver: ZERO_ADDRESS,
            gasPrice: new BN(this.web3.utils.toWei("1", "gwei"))
        };
        return await this.execTransaction(account, safeTransaction);
    }

    async execTransaction(account: Account, safeTransaction: GnosisSafeTransaction)
    {
        validateSafeTransaction(this.web3, safeTransaction);

        const estimatedBaseGas = this.estimateBaseGasCosts(safeTransaction, 1)
            .add(new BN(this.web3.utils.toWei("10000", "wei")));

        const estimatedSafeTxGas = (await this.estimateSafeTxGasCosts(safeTransaction))
            .add(new BN(this.web3.utils.toWei("10000", "wei")));

        const nonce = await this.getNonce();

        const executableTransaction = <GnosisSafeTransaction>{
            to: safeTransaction.to,
            value: safeTransaction.value,
            data: safeTransaction.data,
            operation: safeTransaction.operation,
            safeTxGas: estimatedSafeTxGas,
            baseGas: estimatedBaseGas,
            gasToken: safeTransaction.gasToken,
            refundReceiver: safeTransaction.refundReceiver,
            nonce: nonce
        };

        const transactionHash = await this.getTransactionHash(executableTransaction);
        const signatures = GnosisSafeProxy.signTransactionHash(this.web3, account.privateKey, transactionHash);

        const gasEstimationResult = await this.proxyContract.methods.execTransaction(
            executableTransaction.to,
            executableTransaction.value,
            executableTransaction.data,
            executableTransaction.operation,
            executableTransaction.safeTxGas,
            executableTransaction.baseGas,
            config.getCurrent().getGasPrice(this.web3),
            executableTransaction.gasToken,
            executableTransaction.refundReceiver,
            signatures.signature).estimateGas();

        const gasEstimate = new BN(gasEstimationResult).add(estimatedBaseGas).add(estimatedSafeTxGas);

        const execTransactionData = this.toAbiMessage(executableTransaction, signatures.signature);
        const signedTransactionData = await signRawTransaction(
            this.web3,
            <any>this.safeProxyAddress,
            execTransactionData,
            gasEstimate,
            new BN("0"));

        return await sendSignedRawTransaction(this.web3, signedTransactionData);
    }

    /**
     * Asks the safe to create a message hash for the supplied safeTransaction that can be signed
     * by the owners of the safe to authorize it.
     * @param safeTransaction
     */
    private async getTransactionHash(safeTransaction: GnosisSafeTransaction)
    {
        validateSafeTransaction(this.web3, safeTransaction);

        return await this.proxyContract.methods.getTransactionHash(
            safeTransaction.to,
            safeTransaction.value,
            safeTransaction.data,
            safeTransaction.operation,
            safeTransaction.safeTxGas,
            safeTransaction.baseGas,
            config.getCurrent().getGasPrice(this.web3),
            safeTransaction.gasToken,
            safeTransaction.refundReceiver,
            safeTransaction.nonce
        ).call();
    }

    private async estimateSafeTxGasCosts(safeTransaction: GnosisSafeTransaction): Promise<BN>
    {
        // from https://github.com/gnosis/safe-react -> /src/logic/safe/transactions/gasNew.ts
        validateSafeTransaction(this.web3, safeTransaction);

        const estimateDataCallData = this.proxyContract.methods.requiredTxGas(
            safeTransaction.to,
            safeTransaction.value,
            safeTransaction.data,
            safeTransaction.operation).encodeABI();

        let txGasEstimation = new BN("0");

        await this.web3.eth.call({
            from: this.safeProxyAddress,
            to: this.safeProxyAddress,
            data: estimateDataCallData
        })
        .catch(e =>
        {
            if (!e.data)
                throw new Error(JSON.stringify(e));

            let estimateInError = e.data;
            if (estimateInError.startsWith("Reverted 0x"))
            {
                estimateInError = estimateInError.substr(11);
            }
            txGasEstimation = new BN(estimateInError.substring(138), 16)
        });

        if (txGasEstimation.eq(new BN("0")))
            throw new Error("The safe's txGas cost estimation function should always fail with a 'revert' error.");

        const dataGasEstimation = this.estimateDataGasCosts(safeTransaction.data)
            .add(new BN("21000"));

        return txGasEstimation.add(dataGasEstimation);
    }

    private estimateBaseGasCosts(safeTransaction: GnosisSafeTransaction, signatureCount: number): BN
    {
        const abiMessage = this.toAbiMessage(safeTransaction);
        const dataGasCosts = this.estimateDataGasCosts(abiMessage);
        const signatureCosts = signatureCount == 0
            ? new BN(0)
            : GnosisSafeProxy.estimateSignatureCosts(signatureCount);

        return dataGasCosts.add(signatureCosts);
    }

    private static estimateSignatureCosts(signatureCount: number): BN
    {
        // (array count (3 -> r, s, v) + ecrecover costs) * signature count;
        return new BN(signatureCount * (68 + 2176 + 2176 + 6000));
    }

    private toAbiMessage(safeTransaction: GnosisSafeTransaction, signatures?: string)
    {
        validateSafeTransaction(this.web3, safeTransaction);

        return this.proxyContract.methods.execTransaction(
            safeTransaction.to,
            safeTransaction.value,
            safeTransaction.data,
            safeTransaction.operation,
            safeTransaction.safeTxGas ?? new BN("0"),
            safeTransaction.baseGas ?? new BN("0"),
            config.getCurrent().getGasPrice(this.web3),
            safeTransaction.gasToken,
            safeTransaction.refundReceiver,
            signatures ?? "0x")
            .encodeABI();
    }

    private estimateDataGasCosts(data: ByteString): BN
    {
        const reducer = (accumulator: any, currentValue: string) =>
        {
            if (currentValue === EMPTY_DATA)
            {
                return accumulator + 0
            }

            if (currentValue === '00')
            {
                return accumulator + 4
            }

            return accumulator + 16
        }

        return new BN(data.match(/.{2}/g)?.reduce(reducer, 0));
    }

    private static signTransactionHash(
        web3: Web3,
        safeOwnerPrivateKey: string,
        transactionHash: string
    )
    {
        const signature = EthLibAccount.sign(transactionHash, safeOwnerPrivateKey);
        const vrs = EthLibAccount.decodeSignature(signature);

        return {
            signature,
            r: web3.utils.toBN(vrs[1]).toString("hex"),
            s: web3.utils.toBN(vrs[2]).toString("hex"),
            v: web3.utils.toDecimal(vrs[0]), // Leave the 'v' value at 27 or 28 to get into the EOA verification in GnosisSafe.sol:255
        };
    }
}
