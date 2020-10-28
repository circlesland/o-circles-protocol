import type {BN} from "ethereumjs-util";

export type EthAddress = string;
export type ByteString = string;

export enum GnosisSafeOps {
  CALL= 0,
  DELETECALL = 1,
  CREATE = 2
}

export type GnosisSafeTransaction = {
  to:EthAddress;
  value: BN;
  data: ByteString;
  operation:GnosisSafeOps;
  safeTxGas?:BN;
  baseGas?:BN;
  gasPrice:BN;
  gasToken:EthAddress;
  refundReceiver:EthAddress;
  nonce?:number;
}