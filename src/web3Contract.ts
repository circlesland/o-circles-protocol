import type {Contract, PastEventOptions} from "web3-eth-contract";
import {Observable, Subject} from "rxjs";
import type Web3 from "web3";
import BN from "bn.js";
import type Common from "ethereumjs-common";
import {config} from "./config";
import {Transaction, TxData} from "ethereumjs-tx";
import type {Address} from "./interfaces/address";
import type {ByteString} from "./interfaces/byteString";
import type {Addressable} from "./interfaces/addressable";

export abstract class Web3Contract implements Addressable
{
  readonly web3: Web3;
  readonly address: Address;
  readonly contract: Contract;

  protected readonly _pastEvents: Subject<any> = new Subject<any>();

  constructor(web3: Web3, contractAddress: Address, contractInstance: Contract)
  {
    this.web3 = web3;
    this.address = contractAddress;
    this.contract = contractInstance;
  }

  /**
   * Gets all last events that conform to the query specification and feeds the to all subscribers.
   * @param options
   */
  async feedPastEvents(options: PastEventOptions & { event: string })
  {
    const result = await this.contract.getPastEvents(options.event, options);
    result.forEach(event => this._pastEvents.next(event));
    return result.length;
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
        const e = this.contract.events[event];
        if (!e)
          throw new Error(`There is no event with the name '${event}' on the ABI description.`);

        this.contract.events[event]()
          .on('data', (event: any) => subscriber.next(event));
      }
    });
  }

  async signRawTransaction(to: Address, data: ByteString, gasLimit: BN, value: BN)
    : Promise<ByteString>
  {
    const ethJsCommon: Common = await config.getCurrent().ethjs.getCommon(this.web3);
    const nonce = "0x" + new BN(await this.web3.eth.getTransactionCount(config.xDai.ACCOUNT.address)).toString("hex");

    const rawTx: TxData = {
      gasPrice: "0x" + config.getCurrent().getGasPrice(this.web3).toString("hex"),
      gasLimit: "0x" + gasLimit.toString("hex"),
      to: to,
      value: "0x" + value.toString("hex"),
      data: data,
      nonce: nonce
    };

    const txOptions = ethJsCommon
      ? {common: ethJsCommon}
      : {};

    const tx = new Transaction(rawTx, txOptions);
    tx.sign(Buffer.from(config.xDai.ACCOUNT.privateKey.slice(2), "hex"));

    return '0x' + tx.serialize().toString('hex');
  }

  async sendSignedRawTransaction(serializedTx: ByteString)
  {
    return this.web3.eth.sendSignedTransaction(serializedTx)
      .once('transactionHash', (hash) =>
      {
        console.log("web3.eth.sendSignedTransaction | Got transaction hash: " + hash);
      })
      .once('receipt', (receipt) =>
      {
        console.log("web3.eth.sendSignedTransaction | Got receipt:", receipt);
      })
      .once('confirmation', (confNumber) =>
      {
        console.log("web3.eth.sendSignedTransaction | Got confirmation. Conf No.: " + confNumber);
      })
      .once('error', (error) =>
      {
        console.log("web3.eth.sendSignedTransaction | Got error");
        console.error(error);
      })
      .then(function (receipt)
      {
        console.log("web3.eth.sendSignedTransaction | Transaction was mined.");
        return receipt;
      });
  }
}