import type Web3 from "web3";
import {Account, Address, GnosisSafeOps} from "../safe/gnosisSafeTransaction";
import type {Contract, PastEventOptions} from "web3-eth-contract";
import type {AbiItem} from "web3-utils";
import {ERC20_ABI, ZERO_ADDRESS} from "../consts";
import type {GnosisSafeProxy} from "../safe/gnosisSafeProxy";
import {BN} from "ethereumjs-util";
import {Observable, Subject} from "rxjs";

export class Erc20Token
{
  readonly web3: Web3;
  readonly tokenAddress: Address;
  readonly tokenContract: Contract;

  constructor(web3: Web3, tokenAddress: Address)
  {
    this.web3 = web3;
    this.tokenAddress = tokenAddress;
    this.tokenContract = new this.web3.eth.Contract(<AbiItem[]>ERC20_ABI, this.tokenAddress);
  }

  static queryPastTransfers(from?: Address, to?: Address)
  {
    if (!from && !to)
      throw new Error("At least one of the two parameters has to be set to a value.");

    let f: any = {};
    if (from)
      f.from = from;
    if (to)
      f.to = to;

    return {
      event: "Transfer",
      filter: f,
      fromBlock: "earliest",
      toBlock: "latest"
    };
  }

  async feedPastEvents(options: PastEventOptions & { event: string })
  {
    const result = await this.tokenContract.getPastEvents(options.event, options);
    result.forEach(event => this._pastEvents.next(event));
  }

  private readonly _pastEvents: Subject<any> = new Subject<any>();

  getEvents(): Observable<any>
  {
    return new Observable<any>(subscriber =>
    {
      this._pastEvents.subscribe(next => subscriber.next(next));

      this.tokenContract.events.Transfer()
        .on('data', (event: any) => subscriber.next(event));

      this.tokenContract.events.Approval()
        .on('data', (event: any) => subscriber.next(event));
    });
  }

  async transfer(account: Account, safeProxy: GnosisSafeProxy, to: Address, amount: BN)
  {
    const txData = this.tokenContract.methods.transfer(to, amount).encodeABI();

    return await safeProxy.execTransaction(
      account,
      {
        to: this.tokenAddress,
        data: txData,
        value: new BN("0"),
        refundReceiver: ZERO_ADDRESS,
        gasToken: ZERO_ADDRESS,
        operation: GnosisSafeOps.CALL
      });
  }
}