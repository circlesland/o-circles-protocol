import type Web3 from "web3";
import {Account, Address, GnosisSafeOps} from "../safe/gnosisSafeTransaction";
import type {AbiItem} from "web3-utils";
import type {Contract, PastEventOptions} from "web3-eth-contract";
import {CIRCLES_HUB_ABI, ZERO_ADDRESS} from "../consts";
import type {GnosisSafeProxy} from "../safe/gnosisSafeProxy";
import {BN} from "ethereumjs-util";
import {Observable, Subject} from "rxjs";

export class CirclesHub
{
    readonly web3: Web3;
    readonly hubAddress: Address;
    readonly hubContract: Contract;

    constructor(web3: Web3, hubAddress: Address)
    {
        this.web3 = web3;
        this.hubAddress = hubAddress;
        this.hubContract = new this.web3.eth.Contract(<AbiItem[]>CIRCLES_HUB_ABI, this.hubAddress);
    }

    getSignupTxData()
    {
        return this.hubContract.methods.signup().encodeABI();
    }

    async feedPastEvents(event:string, options:PastEventOptions) {
        const result = await this.hubContract.getPastEvents(event, options);
        result.forEach(event => this._pastEvents.next(event));
    }
    private readonly _pastEvents:Subject<any> = new Subject<any>();

    getEvents() : Observable<any> {
        return new Observable<any>((subscriber => {
            this._pastEvents.subscribe(next => subscriber.next(next));

            this.hubContract.events.Signup()
                .on('data', (event:any) =>  subscriber.next(event));

            this.hubContract.events.HubTransfer()
                .on('data', (event:any) =>  subscriber.next(event));

            this.hubContract.events.OrganizationSignup()
                .on('data', (event:any) =>  subscriber.next(event));

            this.hubContract.events.Signup()
                .on('data', (event:any) =>  subscriber.next(event));

            this.hubContract.events.Trust()
                .on('data', (event:any) =>  subscriber.next(event));
        }));
    }

    async signup(account: Account, safeProxy: GnosisSafeProxy)
    {
        const circlesHubSignupTxData = this.getSignupTxData();

        return await safeProxy.execTransaction(
            account,
            {
                to: this.hubAddress,
                data: circlesHubSignupTxData,
                value: new BN("0"),
                refundReceiver: ZERO_ADDRESS,
                gasToken: ZERO_ADDRESS,
                operation: GnosisSafeOps.CALL
            });
    }

    getTrustTxData(recipient: Address, limit: BN)
    {
        return this.hubContract.methods.trust(recipient, limit).encodeABI();
    }

    async setTrust(account: Account, safeProxy: GnosisSafeProxy, to: Address, trustPercentage: BN)
    {
        const trustTxData = this.getTrustTxData(to, trustPercentage);
        return await safeProxy.execTransaction(
            account,
            {
                to: this.hubAddress,
                data: trustTxData,
                value: new BN("0"),
                refundReceiver: ZERO_ADDRESS,
                gasToken: ZERO_ADDRESS,
                operation: GnosisSafeOps.CALL
            });
    }

    async directTransfer(account: Account, safeProxy: GnosisSafeProxy, to: Address, amount: BN)
    {
        const transfer: { tokenOwners: Address[], sources: Address[], destinations: Address[], values: string[] } = {
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

        return await safeProxy.execTransaction(
            account,
            {
                to: this.hubAddress,
                data: txData,
                value: new BN("0"),
                refundReceiver: ZERO_ADDRESS,
                gasToken: ZERO_ADDRESS,
                operation: GnosisSafeOps.CALL
            });
    }
}
