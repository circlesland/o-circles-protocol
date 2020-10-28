import type Web3 from "web3";
import type {EthAddress} from "./gnosisSafeTransaction";
import {GNOSIS_SAFE_ABI, GnosisSafeProxyInstance, ZERO_ADDRESS} from "./gnosisSafeProxyInstance";
import type {AbiItem} from "web3-utils";

export class GnosisSafeApi {
  /**
   * Returns a GnosisSafeProxyInstance for already deployed contracts.
   * @param web3
   * @param creator
   * @param safeProxyAddress
   */
  static async getSafeProxy(
    web3:Web3,
    creator:EthAddress,
    safeProxyAddress:EthAddress)
    : Promise<GnosisSafeProxyInstance>
  {
    const gnosisSafeProxy = new web3.eth.Contract(<AbiItem[]>GNOSIS_SAFE_ABI, safeProxyAddress);
    const owners = await gnosisSafeProxy.methods.getOwners().call();

    return new GnosisSafeProxyInstance(
      web3,
      safeProxyAddress,
      creator,
      owners);
  }

  /**
   * Uses the ProxyFactory at 'proxyFactoryAddress' to deploy a new safe proxy that links to
   * the 'masterSafeAddress' implementation.
   * @param web3
   * @param masterSafeAddress
   * @param proxyFactoryAddress
   * @param creator The account that creates the instance (The creator must also be an owner!)
   * @param owners The array of owners
   */
  static async deploySafeProxy(
    web3:Web3,
    masterSafeAddress:string,
    proxyFactoryAddress:string,
    creator:EthAddress,
    owners:EthAddress[])
    : Promise<GnosisSafeProxyInstance>
  {
    if (!owners.find(o => o === creator)) {
      throw new Error("The creator must be included in the list of owners.");
    }

    const PROXY_FACTORY_ABI = [
      {"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract Proxy","name":"proxy","type":"address"}],"name":"ProxyCreation","type":"event"},{"constant":false,"inputs":[{"internalType":"address","name":"_mastercopy","type":"address"},{"internalType":"bytes","name":"initializer","type":"bytes"},{"internalType":"uint256","name":"saltNonce","type":"uint256"}],"name":"calculateCreateProxyWithNonceAddress","outputs":[{"internalType":"contract Proxy","name":"proxy","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"masterCopy","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"createProxy","outputs":[{"internalType":"contract Proxy","name":"proxy","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_mastercopy","type":"address"},{"internalType":"bytes","name":"initializer","type":"bytes"},{"internalType":"uint256","name":"saltNonce","type":"uint256"},{"internalType":"contract IProxyCreationCallback","name":"callback","type":"address"}],"name":"createProxyWithCallback","outputs":[{"internalType":"contract Proxy","name":"proxy","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_mastercopy","type":"address"},{"internalType":"bytes","name":"initializer","type":"bytes"},{"internalType":"uint256","name":"saltNonce","type":"uint256"}],"name":"createProxyWithNonce","outputs":[{"internalType":"contract Proxy","name":"proxy","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"proxyCreationCode","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"proxyRuntimeCode","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"payable":false,"stateMutability":"pure","type":"function"}
    ];
    const proxyFactory = new web3.eth.Contract(<AbiItem[]>PROXY_FACTORY_ABI, proxyFactoryAddress);
    const gnosisSafe = new web3.eth.Contract(<AbiItem[]>GNOSIS_SAFE_ABI, masterSafeAddress);

    const proxySetupData = gnosisSafe.methods.setup(
      owners,
      1,               // threshold (how many owners are required to sign a transaction -> 1)
      ZERO_ADDRESS,    // delegatecall for modules (none)
      "0x",            // init data for modules (none)
      ZERO_ADDRESS,    // fallbackHandler
      ZERO_ADDRESS,    // paymentToken (none defaults to ETH)
      0,               // payment
      ZERO_ADDRESS     // paymentReceiver
    ).encodeABI();

    const estimatedGas = await proxyFactory.methods.createProxy(
      masterSafeAddress,
      proxySetupData)
      .estimateGas();

    const { events } = await proxyFactory.methods.createProxy(
      masterSafeAddress,
      proxySetupData
    ).send({
      from: creator,
      gas: estimatedGas + 500 // this is the gas limit. Use the estimation + some extra buffer
    });

    return new GnosisSafeProxyInstance(
      web3,
      events.ProxyCreation.returnValues.proxy,
      creator,
      owners)
  }
}
