import type {Contract, PastEventOptions} from "web3-eth-contract";
import {Observable, Subject} from "rxjs";
import type {Address} from "./safe/gnosisSafeTransaction";
import type Web3 from "web3";

export abstract class Web3Contract
{
  readonly web3: Web3;
  readonly contractAddress: Address;
  readonly contractInstance: Contract;

  protected readonly _pastEvents: Subject<any> = new Subject<any>();

  constructor(web3:Web3, contractAddress: Address, contractInstance: Contract)
  {
    this.web3 = web3;
    this.contractAddress = contractAddress;
    this.contractInstance = contractInstance;
  }

  /**
   * Gets all last events that conform to the query specification and feeds the to all subscribers.
   * @param options
   */
  async feedPastEvents(options: PastEventOptions & { event: string })
  {
    const result = await this.contractInstance.getPastEvents(options.event, options);
    result.forEach(event => this._pastEvents.next(event));
  }

  /**
   * Subscribes to all of the passed events and returns an Observable instance.
   * @param events
   */
  subscribeTo(events: string[])
  {
    return new Observable<any>(subscriber =>
    {
      this._pastEvents.subscribe(next => subscriber.next(next));

      for (let event of events)
      {
        const e = this.contractInstance.events[event];
        if (!e)
          throw new Error(`There is no event with the name '${event}' on the ABI description.`);

        this.contractInstance.events[event]()
          .on('data', (event: any) => subscriber.next(event));
      }
    });
  }
}