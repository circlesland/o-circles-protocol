import type Web3 from "web3";
import {Account, Address, GnosisSafeOps} from "../safe/gnosisSafeTransaction";
import type {AbiItem} from "web3-utils";
import {ERC20_ABI, ZERO_ADDRESS} from "../consts";
import type {GnosisSafeProxy} from "../safe/gnosisSafeProxy";
import {BN} from "ethereumjs-util";
import {Web3Contract} from "../web3Contract";

export class Erc20Token extends Web3Contract
{
  constructor(web3: Web3, tokenAddress: Address)
  {
    super(web3, tokenAddress, new web3.eth.Contract(<AbiItem[]>ERC20_ABI, tokenAddress));
  }

  static readonly TransferEvent = "Transfer";
  static readonly ApprovalEvent = "Approval";

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

  async transfer(account: Account, safeProxy: GnosisSafeProxy, to: Address, amount: BN)
  {
    const txData = this.contractInstance.methods.transfer(to, amount).encodeABI();

    return await safeProxy.execTransaction(
      account,
      {
        to: this.contractAddress,
        data: txData,
        value: new BN("0"),
        refundReceiver: ZERO_ADDRESS,
        gasToken: ZERO_ADDRESS,
        operation: GnosisSafeOps.CALL
      });
  }
}