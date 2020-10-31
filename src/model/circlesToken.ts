import type Web3 from "web3";
import type {Address} from "../interfaces/address";
import {Erc20Token} from "../token/erc20Token";

export class CirclesToken extends Erc20Token {
  constructor(web3:Web3, address: Address)
  {
    super(web3, address);
  }
}