import Web3 from "web3";
import {Address, ByteString, GnosisSafeOps} from "../safe/gnosisSafeTransaction";
import {AbiItem} from "web3-utils";
import type {Contract} from "web3-eth-contract";
import {CIRCLES_HUB_ABI, ZERO_ADDRESS} from "../consts";
import {GnosisSafeProxy} from "../safe/gnosisSafeProxy";
import {BN} from "ethereumjs-util";

export class CirclesHub {
    readonly web3:Web3;
    readonly hubAddress:Address;
    readonly hubContract:Contract;

    constructor(web3:Web3, hubAddress:Address)
    {
        this.web3 = web3;
        this.hubAddress = hubAddress;
        this.hubContract = new this.web3.eth.Contract(<AbiItem[]>CIRCLES_HUB_ABI, this.hubAddress);
    }

    getSignupTxData()
    {
        return this.hubContract.methods.signup().encodeABI();
    }

    async signup(safeProxy:GnosisSafeProxy, gasPrice:BN, safeOwner:Address, safeOwnerPrivateKey:ByteString)
    {
        const circlesHubSignupTxData = this.getSignupTxData();
        const signupReceipt = await safeProxy.execTransaction({
                to: this.hubAddress,
                data: circlesHubSignupTxData,
                value: new BN("0"),
                refundReceiver: ZERO_ADDRESS,
                gasToken: ZERO_ADDRESS,
                operation: GnosisSafeOps.CALL,
                gasPrice: gasPrice,
            },
            safeOwner,
            safeOwnerPrivateKey);

        return signupReceipt;
    }

    getTrustTxData(recipient:Address, limit:BN)
    {
        return this.hubContract.methods.trust(recipient, limit).encodeABI();
    }

    async setTrust(safeProxy:GnosisSafeProxy, gasPrice:BN, to:Address, trustPercentage:BN, safeOwner:Address, safeOwnerPrivateKey:ByteString)
    {
        const trustTxData = this.getTrustTxData(to, trustPercentage);
        const trustReceipt = await safeProxy.execTransaction({
                to: this.hubAddress,
                data: trustTxData,
                value: new BN("0"),
                refundReceiver: ZERO_ADDRESS,
                gasToken: ZERO_ADDRESS,
                operation: GnosisSafeOps.CALL,
                gasPrice: gasPrice,
            },
            safeOwner,
            safeOwnerPrivateKey);

        return trustReceipt;
    }

    async directTransfer(safeProxy:GnosisSafeProxy, gasPrice:BN, to:Address, amount:BN, safeOwner:Address, safeOwnerPrivateKey:ByteString)
    {
        const transfer:{tokenOwners:Address[], sources:Address[], destinations:Address[], values:string[]} = {
            tokenOwners: [safeProxy.safeProxyAddress],
            sources: [safeProxy.safeProxyAddress],
            destinations: [to],
            values: [amount.toString()],
        };

        const sendLimit = await this.hubContract.methods
            .checkSendLimit(safeProxy.safeProxyAddress, safeProxy.safeProxyAddress, to)
            .call();

        if (new BN(sendLimit).lt(amount))
            throw new Error("You cannot transfer " + amount.toString() + "units to " + to + " because the recipient doesn't trust your tokens.");

        const txData = await this.hubContract.methods.transferThrough(
                transfer.tokenOwners,
                transfer.sources,
                transfer.destinations,
                transfer.values,
            )
            .encodeABI();

        const transferTroughReceipt = await safeProxy.execTransaction({
                to: this.hubAddress,
                data: txData,
                value: new BN("0"),
                refundReceiver: ZERO_ADDRESS,
                gasToken: ZERO_ADDRESS,
                operation: GnosisSafeOps.CALL,
                gasPrice: gasPrice,
            },
            safeOwner,
            safeOwnerPrivateKey);

        return transferTroughReceipt;
    }
}
