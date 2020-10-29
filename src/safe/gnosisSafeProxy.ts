import type {AbiItem} from "web3-utils";
import type {Contract} from "web3-eth-contract";
import type Web3 from "web3";
import {
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
import {signTransactionHash} from "../signTransactionHash";

export class GnosisSafeProxy {

    readonly creatorAddress:Address;
    readonly safeProxyAddress:Address;
    readonly web3:Web3;
    readonly proxyContract:Contract;

    constructor(web3:Web3, creatorAddress:Address, safeProxyAddress:Address)
    {
        this.web3 = web3;
        this.creatorAddress = creatorAddress;
        this.safeProxyAddress = safeProxyAddress;
        this.proxyContract = new this.web3.eth.Contract(<AbiItem[]>GNOSIS_SAFE_ABI, this.safeProxyAddress);
    }

    async getOwners() : Promise<string[]> {
        return await this.proxyContract.methods.getOwners().call();
    }

    async getNonce() : Promise<number> {
        return parseInt(await this.proxyContract.methods.nonce().call());
    }

    async sendEth(value:BN, to:Address, signingAccount:Address, privateKey:ByteString) {
        const safeTransaction = <GnosisSafeTransaction> {
            value: value,
            to: to,
            operation: GnosisSafeOps.CALL,
            data: "0x",
            gasToken: ZERO_ADDRESS,
            refundReceiver: ZERO_ADDRESS,
            gasPrice: new BN(this.web3.utils.toWei("1", "gwei"))
        };
        return await this.execTransaction(safeTransaction, signingAccount, privateKey);
    }

    async execTransaction(safeTransaction:GnosisSafeTransaction, signingAccount:Address, privateKey:ByteString)
    {
        validateSafeTransaction(this.web3, safeTransaction);

        const estimatedBaseGas = this.estimateBaseGasCosts(safeTransaction, 1)
            .add(new BN(this.web3.utils.toWei("50000", "wei")));
        const estimatedSafeTxGas = await this.estimateSafeTxGasCosts(safeTransaction);
        const nonce = await this.getNonce();

        const executableTransaction = <GnosisSafeTransaction>{
            to: safeTransaction.to,
            value: safeTransaction.value,
            data: safeTransaction.data,
            operation: safeTransaction.operation,
            safeTxGas: estimatedSafeTxGas,
            baseGas: estimatedBaseGas,
            gasPrice: safeTransaction.gasPrice,
            gasToken: safeTransaction.gasToken,
            refundReceiver: safeTransaction.refundReceiver,
            nonce: nonce
        };

        const transactionHash = await this.getTransactionHash(executableTransaction);
        const signatures = signTransactionHash(this.web3, privateKey, transactionHash);

        const gasEstimationResult = await this.proxyContract.methods.execTransaction(
            executableTransaction.to,
            executableTransaction.value,
            executableTransaction.data,
            executableTransaction.operation,
            executableTransaction.safeTxGas,
            executableTransaction.baseGas,
            executableTransaction.gasPrice,
            executableTransaction.gasToken,
            executableTransaction.refundReceiver,
            signatures.signature).estimateGas();

        const gasEstimate = new BN(gasEstimationResult).add(estimatedBaseGas).add(estimatedSafeTxGas);

        const execTransactionData = this.toAbiMessage(executableTransaction, signatures.signature);
        const signedTransactionData = await signRawTransaction(
            this.web3,
            <any>this.safeProxyAddress,
            execTransactionData,
            executableTransaction.gasPrice,
            gasEstimate,
            new BN("0"));

        const minedReceipt = await sendSignedRawTransaction(this.web3, signedTransactionData);
        return minedReceipt;
    }


    /**
     * Asks the safe to create a message hash for the supplied safeTransaction that can be signed
     * by the owners of the safe to authorize it.
     * @param safeTransaction
     */
    async getTransactionHash(safeTransaction:GnosisSafeTransaction)
    {
        validateSafeTransaction(this.web3, safeTransaction);

        const transactionHash = await this.proxyContract.methods.getTransactionHash(
            safeTransaction.to,
            safeTransaction.value,
            safeTransaction.data,
            safeTransaction.operation,
            safeTransaction.safeTxGas,
            safeTransaction.baseGas,
            safeTransaction.gasPrice,
            safeTransaction.gasToken,
            safeTransaction.refundReceiver,
            safeTransaction.nonce
        ).call();

        return transactionHash;
    }

    toAbiMessage(safeTransaction:GnosisSafeTransaction, signatures?:string)
    {
        validateSafeTransaction(this.web3, safeTransaction);

        return this.proxyContract.methods.execTransaction(
            safeTransaction.to,
            safeTransaction.value,
            safeTransaction.data,
            safeTransaction.operation,
            safeTransaction.safeTxGas ?? new BN("0"),
            safeTransaction.baseGas ?? new BN("0"),
            safeTransaction.gasPrice,
            safeTransaction.gasToken,
            safeTransaction.refundReceiver,
            signatures ?? "0x")
            .encodeABI();
    }

    async estimateSafeTxGasCosts(safeTransaction:GnosisSafeTransaction) : Promise<BN> {
        // from https://github.com/gnosis/safe-react -> /src/logic/safe/transactions/gasNew.ts
        validateSafeTransaction(this.web3, safeTransaction);

        const txGasEstimation = new BN("1500000");
        const dataGasEstimation = this.estimateDataGasCosts(safeTransaction.data).add(new BN("21000"));

        return txGasEstimation.add(dataGasEstimation);
    }

    estimateBaseGasCosts(safeTransaction:GnosisSafeTransaction, signatureCount:number) : BN
    {
        const abiMessage = this.toAbiMessage(safeTransaction);

        const dataGasCosts = this.estimateDataGasCosts(abiMessage);
        const signatureCosts = signatureCount == 0
            ? new BN(0)
            : GnosisSafeProxy.estimateSignatureCosts(signatureCount);

        return dataGasCosts.add(signatureCosts);
    }

    private static estimateSignatureCosts(signatureCount:number) : BN
    {
        // (array count (3 -> r, s, v) + ecrecover costs) * signature count;
        return new BN(signatureCount * (68 + 2176 + 2176 + 6000));
    }

    private estimateDataGasCosts(data: ByteString): BN {
        const reducer = (accumulator:any, currentValue:string) => {
            if (currentValue === EMPTY_DATA) {
                return accumulator + 0
            }

            if (currentValue === '00') {
                return accumulator + 4
            }

            return accumulator + 16
        }

        return new BN(data.match(/.{2}/g)?.reduce(reducer, 0));
    }
}
