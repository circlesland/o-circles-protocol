import type {BN} from "ethereumjs-util";
import type {ByteString} from "./byteString";
import type {Address} from "./address";

export interface Event {
  blockNumber: BN
  blockHash: ByteString
  address: Address
}