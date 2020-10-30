import type Web3 from "web3";
import type {AbiItem} from "web3-utils";
import {GNOSIS_SAFE_ABI, PROXY_FACTORY_ABI, ZERO_ADDRESS} from "../consts";
import {BN} from "ethereumjs-util";
import {GnosisSafeProxy} from "./gnosisSafeProxy";
import {signRawTransaction} from "../signRawTransaction";
import {sendSignedRawTransaction} from "../sendSignedRawTransaction";
import type {Address} from "./gnosisSafeTransaction";

export class GnosisSafeProxyFactory
{
  /**
   * Uses the ProxyFactory at 'proxyFactoryAddress' to deploy a new safe proxy that links to
   * the 'masterSafeAddress' implementation.
   * @param web3
   * @param masterSafeAddress
   * @param proxyFactoryAddress
   * @param creator The account that creates the instance (The creator must also be an owner!)
   * @param gasPrice The gas price in wei
   */
  static async deployNewSafeProxy(
    web3: Web3,
    masterSafeAddress: Address,
    proxyFactoryAddress: Address,
    creator: string)
    : Promise<GnosisSafeProxy>
  {
    const proxyFactory = new web3.eth.Contract(<AbiItem[]>PROXY_FACTORY_ABI, proxyFactoryAddress);
    const gnosisSafe = new web3.eth.Contract(<AbiItem[]>GNOSIS_SAFE_ABI, masterSafeAddress);

    const proxySetupData = gnosisSafe.methods.setup(
      [creator],
      1,               // threshold (how many owners are required to sign a transaction -> 1)
      ZERO_ADDRESS,    // delegatecall for modules (none)
      "0x",            // init data for modules (none)
      ZERO_ADDRESS,    // fallbackHandler
      ZERO_ADDRESS,    // paymentToken (none defaults to ETH)
      0,               // payment
      ZERO_ADDRESS     // paymentReceiver
    ).encodeABI();

    const estimatedGas = new BN(await proxyFactory.methods.createProxy(
      masterSafeAddress,
      proxySetupData)
      .estimateGas());

    const createProxyData = await proxyFactory.methods.createProxy(
      masterSafeAddress,
      proxySetupData)
      .encodeABI();

    const signedRawTransaction = await signRawTransaction(
      web3,
      <any>proxyFactoryAddress,
      createProxyData,
      estimatedGas,
      new BN("0"));

    const minedReceipt = await sendSignedRawTransaction(web3, signedRawTransaction);

    let proxyAddress = undefined;
    for (let logEntry of minedReceipt.logs)
    {
      if (logEntry.address != proxyFactoryAddress)
      {
        continue;
      }

      const proxyCreatedEvent = web3.eth.abi.decodeLog([{
        name: "proxy",
        type: "address"
      }], logEntry.data, logEntry.topics);
      console.log("Deployed safe address is:", proxyCreatedEvent["proxy"]);
      proxyAddress = proxyCreatedEvent["proxy"];
      break;
    }

    if (!proxyAddress)
      throw new Error("The deployment of the safe failed. Couldn't determine the proxy address from the receipt's log.")

    return new GnosisSafeProxy(web3, creator, proxyAddress);
  }
}
