import {BN} from "ethereumjs-util";
import {ByteString} from "./byteString";
import {Address} from "./address";

export interface Event {
  blockNumber: BN
  blockHash: ByteString
  address: Address
}