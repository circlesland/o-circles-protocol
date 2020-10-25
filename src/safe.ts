import type Web3 from "web3";
import type {AbiItem} from "web3-utils";
import type {TxData} from "ethereumjs-tx";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const GNOSIS_SAFE_ABI = [
  {"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"AddedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"approvedHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"ApproveHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"masterCopy","type":"address"}],"name":"ChangedMasterCopy","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"threshold","type":"uint256"}],"name":"ChangedThreshold","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract Module","name":"module","type":"address"}],"name":"DisabledModule","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract Module","name":"module","type":"address"}],"name":"EnabledModule","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"payment","type":"uint256"}],"name":"ExecutionFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"ExecutionFromModuleFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"ExecutionFromModuleSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"payment","type":"uint256"}],"name":"ExecutionSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"RemovedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"msgHash","type":"bytes32"}],"name":"SignMsg","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"NAME","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"addOwnerWithThreshold","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"approvedHashes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_masterCopy","type":"address"}],"name":"changeMasterCopy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"changeThreshold","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract Module","name":"prevModule","type":"address"},{"internalType":"contract Module","name":"module","type":"address"}],"name":"disableModule","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"domainSeparator","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"contract Module","name":"module","type":"address"}],"name":"enableModule","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"execTransactionFromModule","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"execTransactionFromModuleReturnData","outputs":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getModules","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"start","type":"address"},{"internalType":"uint256","name":"pageSize","type":"uint256"}],"name":"getModulesPaginated","outputs":[{"internalType":"address[]","name":"array","type":"address[]"},{"internalType":"address","name":"next","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwners","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"prevOwner","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"removeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"handler","type":"address"}],"name":"setFallbackHandler","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"signedMessages","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"prevOwner","type":"address"},{"internalType":"address","name":"oldOwner","type":"address"},{"internalType":"address","name":"newOwner","type":"address"}],"name":"swapOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address[]","name":"_owners","type":"address[]"},{"internalType":"uint256","name":"_threshold","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"address","name":"fallbackHandler","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"uint256","name":"payment","type":"uint256"},{"internalType":"address payable","name":"paymentReceiver","type":"address"}],"name":"setup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address payable","name":"refundReceiver","type":"address"},{"internalType":"bytes","name":"signatures","type":"bytes"}],"name":"execTransaction","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"requiredTxGas","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"hashToApprove","type":"bytes32"}],"name":"approveHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"signMessage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes","name":"_data","type":"bytes"},{"internalType":"bytes","name":"_signature","type":"bytes"}],"name":"isValidSignature","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes","name":"message","type":"bytes"}],"name":"getMessageHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address","name":"refundReceiver","type":"address"},{"internalType":"uint256","name":"_nonce","type":"uint256"}],"name":"encodeTransactionData","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address","name":"refundReceiver","type":"address"},{"internalType":"uint256","name":"_nonce","type":"uint256"}],"name":"getTransactionHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"}
];

export async function getSafeOwners(web3:Web3, safeProxyAddress:string) : Promise<string[]> {
  const gnosisSafeProxy = new web3.eth.Contract(<AbiItem[]>GNOSIS_SAFE_ABI, safeProxyAddress);
  return await gnosisSafeProxy.methods.getOwners().call();
}

enum GnosisSafeOp {
  CALL= 0,
  DELETECALL = 1,
  CREATE = 2
}

/// @dev Allows to execute a Safe transaction confirmed by required number of owners and then pays the account that submitted the transaction.
///      Note: The fees are always transfered, even if the user transaction fails.
/// @param to Destination address of Safe transaction.
/// @param value Ether value of Safe transaction.
/// @param data Data payload of Safe transaction.
/// @param operation Operation type of Safe transaction.
/// @param safeTxGas Gas that should be used for the Safe transaction.
/// @param baseGas Gas costs for that are indipendent of the transaction execution(e.g. base transaction fee, signature check, payment of the refund)
/// @param gasPrice Gas price that should be used for the payment calculation.
/// @param gasToken Token address (or 0 if ETH) that is used for the payment.
/// @param refundReceiver Address of receiver of gas payment (or 0 if tx.origin).
/// @param signatures Packed signature data ({bytes32 r}{bytes32 s}{uint8 v})
/// function execTransaction(
///     address to,
///     uint256 value,
///     bytes calldata data,
///     Enum.Operation operation,
///     uint256 safeTxGas,
///     uint256 baseGas,
///     uint256 gasPrice,
///     address gasToken,
///     address payable refundReceiver,
///     bytes calldata signatures
/// )
export async function execTransaction(web3:Web3, safeProxyAddress:string, safeOwner:string, data:TxData, signature:string) {
  const gnosisSafeProxy = new web3.eth.Contract(<AbiItem[]>GNOSIS_SAFE_ABI, safeProxyAddress);
  const op:GnosisSafeOp = GnosisSafeOp.CALL;
  const result = await gnosisSafeProxy.methods.execTransaction(
    data.to,
    "0x0",
    data.data,
    op,
    data.gasLimit, // safeGas == gas + safety margin OR gas for the processing within the safe before the actual transaction??
    data.gasLimit,
    data.gasPrice,
    ZERO_ADDRESS, // ETH
    ZERO_ADDRESS,
    signature
  ).send({
    from: safeOwner
  });

  return result;
}

/**
 * Asks the safe to calculate a hash value for the supplied TxData.
 * The resulting hash should then be signed by all involved safe owners (at least the necessary quorum)
 * to approve it.
 * @param web3
 * @param safeProxyAddress
 * @param data
 */
export async function getTransactionHash(web3:Web3, safeProxyAddress:string, data:TxData) {
  const gnosisSafeProxy = new web3.eth.Contract(<AbiItem[]>GNOSIS_SAFE_ABI, safeProxyAddress);
  const op:GnosisSafeOp = GnosisSafeOp.CALL;
  // TODO: use web3 functions instead of TxData if possible to avoid this string concat clutter
  const hashToSign = await gnosisSafeProxy.methods.getTransactionHash(
    "0x"+(<Buffer>data.to).toString("hex"),
    "0x0",
    "0x"+(<Buffer>data.data).toString("hex"),
    op,
    "0x"+(<Buffer>data.gasLimit).toString("hex"), // safeGas == gas + safety margin OR gas for the processing within the safe before the actual transaction??
    "0x"+(<Buffer>data.gasLimit).toString("hex"),
    "0x"+(<Buffer>data.gasPrice).toString("hex"),
    ZERO_ADDRESS, // ETH
    ZERO_ADDRESS,
    "0x"+(<Buffer>data.nonce).toString("hex")
  ).call();

  return hashToSign;
}

export async function deploySafe(
  web3:Web3,
  masterSafeAddress:string,
  proxyFactoryAddress:string,
  ownerAddress:string)
{
  const PROXY_FACTORY_ABI = [
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract Proxy","name":"proxy","type":"address"}],"name":"ProxyCreation","type":"event"},{"constant":false,"inputs":[{"internalType":"address","name":"_mastercopy","type":"address"},{"internalType":"bytes","name":"initializer","type":"bytes"},{"internalType":"uint256","name":"saltNonce","type":"uint256"}],"name":"calculateCreateProxyWithNonceAddress","outputs":[{"internalType":"contract Proxy","name":"proxy","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"masterCopy","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"createProxy","outputs":[{"internalType":"contract Proxy","name":"proxy","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_mastercopy","type":"address"},{"internalType":"bytes","name":"initializer","type":"bytes"},{"internalType":"uint256","name":"saltNonce","type":"uint256"},{"internalType":"contract IProxyCreationCallback","name":"callback","type":"address"}],"name":"createProxyWithCallback","outputs":[{"internalType":"contract Proxy","name":"proxy","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_mastercopy","type":"address"},{"internalType":"bytes","name":"initializer","type":"bytes"},{"internalType":"uint256","name":"saltNonce","type":"uint256"}],"name":"createProxyWithNonce","outputs":[{"internalType":"contract Proxy","name":"proxy","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"proxyCreationCode","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"proxyRuntimeCode","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"payable":false,"stateMutability":"pure","type":"function"}
  ];
  const proxyFactory = new web3.eth.Contract(<AbiItem[]>PROXY_FACTORY_ABI, proxyFactoryAddress);
  const gnosisSafe = new web3.eth.Contract(<AbiItem[]>GNOSIS_SAFE_ABI, masterSafeAddress);

  const proxySetupData = gnosisSafe.methods.setup(
    [ownerAddress],  // owners
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
    from: ownerAddress,
    gas: estimatedGas + 500 // this is the gas limit. Use the estimation + some extra buffer
  });

  const safeProxyAddress = events.ProxyCreation.returnValues.proxy;
  const gnosisSafeProxy = new web3.eth.Contract(<AbiItem[]>GNOSIS_SAFE_ABI, safeProxyAddress);
  const masterCopyAddress = await web3.eth.getStorageAt(gnosisSafeProxy.options.address, 0);

  if (masterCopyAddress !== masterSafeAddress.toLowerCase()) {
    throw new Error(`The deployed proxy doesn't point to the correct gnosis-safe master copy. Master: ${masterSafeAddress.toLowerCase()}, Proxy points to: ${masterCopyAddress}`);
  }

  const owners = await gnosisSafeProxy.methods.getOwners().call({ from: ownerAddress });

  if (owners.length != 1) {
    throw new Error(`The deployed proxy has more than one owner! Should be: ${ownerAddress}, Is: ${owners.join(",")}`);
  }

  return {
    owner: owners[0],
    address: gnosisSafeProxy.options.address
  };
}
