import {Address} from "./address";
import {Event} from "./event";

export interface TrustRelation extends Event {
  from: Address
  to:Address
  limit:number
}