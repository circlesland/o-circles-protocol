import type Web3 from "web3";
import type {AbiItem} from "web3-utils";
import {BN} from "ethereumjs-util";
import type {Contract} from "web3-eth-contract";
import type {ByteString, EthAddress, GnosisSafeTransaction} from "./gnosisSafeTransaction";
import type {AbstractProvider} from "web3-core";
import {getEIP712Signer, signTypedData} from "./signer/eip712Signer";

export const EMPTY_DATA = '0x'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const GNOSIS_SAFE_ABI = [
  {"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"AddedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"approvedHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"ApproveHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"masterCopy","type":"address"}],"name":"ChangedMasterCopy","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"threshold","type":"uint256"}],"name":"ChangedThreshold","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract Module","name":"module","type":"address"}],"name":"DisabledModule","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract Module","name":"module","type":"address"}],"name":"EnabledModule","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"payment","type":"uint256"}],"name":"ExecutionFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"ExecutionFromModuleFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"ExecutionFromModuleSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"payment","type":"uint256"}],"name":"ExecutionSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"RemovedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"msgHash","type":"bytes32"}],"name":"SignMsg","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"NAME","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"addOwnerWithThreshold","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"approvedHashes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_masterCopy","type":"address"}],"name":"changeMasterCopy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"changeThreshold","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract Module","name":"prevModule","type":"address"},{"internalType":"contract Module","name":"module","type":"address"}],"name":"disableModule","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"domainSeparator","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"contract Module","name":"module","type":"address"}],"name":"enableModule","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"execTransactionFromModule","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"execTransactionFromModuleReturnData","outputs":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getModules","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"start","type":"address"},{"internalType":"uint256","name":"pageSize","type":"uint256"}],"name":"getModulesPaginated","outputs":[{"internalType":"address[]","name":"array","type":"address[]"},{"internalType":"address","name":"next","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwners","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"prevOwner","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"removeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"handler","type":"address"}],"name":"setFallbackHandler","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"signedMessages","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"prevOwner","type":"address"},{"internalType":"address","name":"oldOwner","type":"address"},{"internalType":"address","name":"newOwner","type":"address"}],"name":"swapOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address[]","name":"_owners","type":"address[]"},{"internalType":"uint256","name":"_threshold","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"address","name":"fallbackHandler","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"uint256","name":"payment","type":"uint256"},{"internalType":"address payable","name":"paymentReceiver","type":"address"}],"name":"setup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address payable","name":"refundReceiver","type":"address"},{"internalType":"bytes","name":"signatures","type":"bytes"}],"name":"execTransaction","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"requiredTxGas","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"hashToApprove","type":"bytes32"}],"name":"approveHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"signMessage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes","name":"_data","type":"bytes"},{"internalType":"bytes","name":"_signature","type":"bytes"}],"name":"isValidSignature","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes","name":"message","type":"bytes"}],"name":"getMessageHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address","name":"refundReceiver","type":"address"},{"internalType":"uint256","name":"_nonce","type":"uint256"}],"name":"encodeTransactionData","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address","name":"refundReceiver","type":"address"},{"internalType":"uint256","name":"_nonce","type":"uint256"}],"name":"getTransactionHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"}
];

export class GnosisSafeProxyInstance
{
  readonly creator:EthAddress;
  readonly address:EthAddress;
  readonly owners:EthAddress[];
  readonly web3:Web3;
  readonly proxyContract:Contract;

  constructor(web3:Web3, address:EthAddress, creator:EthAddress, owners:EthAddress[])
  {
    this.address = address;
    this.creator = creator;
    this.owners = owners;
    this.web3 = web3;
    this.proxyContract = new this.web3.eth.Contract(<AbiItem[]>GNOSIS_SAFE_ABI, this.address);
  }

  async getOwners() : Promise<EthAddress[]> {
    return await this.proxyContract.methods.getOwners().call();
  }

  async getNonce() {
    return await this.proxyContract.methods.nonce().call();
  }

  /**
   * Asks the safe to create a message hash for the supplied safeTransaction that can be signed
   * by the owners of the safe to authorize it.
   * @param safeTransaction
   */
  async getTransactionHash(safeTransaction:GnosisSafeTransaction)
  {
    const eip712Message = this.toEIP712Message(safeTransaction);
    return await this.proxyContract.methods.getTransactionHash(eip712Message.message).call();
  }

  async execTransaction(safeTransaction:GnosisSafeTransaction, signingAccounts:EthAddress[], privateKeys?:string[])
  {
    const estimatedBaseGas = this.estimateBaseGasCosts(safeTransaction, signingAccounts.length);
    const estimatedSafeTxGas = await this.estimateSafeTxGasCosts(safeTransaction);
    const nonce = await this.getNonce();

    const executableTransaction = <GnosisSafeTransaction>{
      to: safeTransaction.to,
      value: safeTransaction.value,
      data: safeTransaction.data,
      operation: safeTransaction.operation,
      safeTxGas: estimatedSafeTxGas,
      baseGas: estimatedBaseGas,
      gasPrice: safeTransaction.gasPrice,
      gasToken: safeTransaction.gasToken,
      refundReceiver: safeTransaction.refundReceiver,
      nonce: nonce
    };

    const eip712Message = this.toEIP712Message(executableTransaction);
    const signatures = await this.signTransaction(executableTransaction, signingAccounts, privateKeys);

    const estimatedGas = new BN(this.proxyContract.methods.execTransaction(
      eip712Message.message.to,
      eip712Message.message.value,
      eip712Message.message.data,
      eip712Message.message.operation,
      eip712Message.message.safeTxGas,
      eip712Message.message.baseGas,
      eip712Message.message.gasPrice,
      eip712Message.message.gasToken,
      eip712Message.message.refundReceiver,
      signatures).estimateGas());

    const execResponse = await this.proxyContract.methods.execTransaction(
      eip712Message.message.to,
      eip712Message.message.value,
      eip712Message.message.data,
      eip712Message.message.operation,
      eip712Message.message.safeTxGas,
      eip712Message.message.baseGas,
      eip712Message.message.gasPrice,
      eip712Message.message.gasToken,
      eip712Message.message.refundReceiver,
      signatures
    ).call({
      from: this.creator,
      gas: estimatedBaseGas.add(eip712Message.message.safeTxGas).add(new BN(10000)),
      gasPrice: eip712Message.message.gasPrice
    });
  }

  async signTransaction(safeTransaction:GnosisSafeTransaction, signingAccounts:EthAddress[], privateKeys?:string[])
    : Promise<string>
  {
    const eip712Message = this.toEIP712Message(safeTransaction);
    const signers = signingAccounts.slice();
    signers.sort();

    let signatureBytes = "0x"
    for (let i=0; i < signers.length; i++)
    {
      const signer = signers[i];
      const privateKey = privateKeys ? (privateKeys[i]) : undefined;
      const signature = await this.signEIP712Message(signer, eip712Message, privateKey);
      signatureBytes += signature.replace('0x', '')
    }

    return signatureBytes;
  }

  private async signEIP712Message(signer:EthAddress, eip712Message:object, privateKey?:string)
    : Promise<string>
  {
    const self = this;

    // Method from the react-safe
    const signerMethod = getEIP712Signer(this.web3);
    const reactSafeSig = await signerMethod(eip712Message);

    // Method from the circles-core lib
    const circleSig =  signTypedData(this.web3, privateKey, eip712Message);

    return new Promise(function (resolve, reject)
    {
      const provider = <AbstractProvider>self.web3.currentProvider;
      provider.send({
          jsonrpc: "2.0",
          method: "eth_signTypedData",
          params: [signer, eip712Message],
          id: new Date().getTime()
        },
        (err: any, response: any) =>
        {
          if (err) {
            reject(err)
          } else {
            resolve(response);
          }
        });
    });
  }

  toAbiMessage(safeTransaction:GnosisSafeTransaction, signatures?:string)
  {
    const eip712Message = this.toEIP712Message(safeTransaction);
    if (signatures) {
      return this.proxyContract.methods.execTransaction(
        eip712Message.message.to,
        eip712Message.message.value,
        eip712Message.message.data,
        eip712Message.message.operation,
        eip712Message.message.safeTxGas,
        eip712Message.message.baseGas,
        eip712Message.message.gasPrice,
        eip712Message.message.gasToken,
        eip712Message.message.refundReceiver,
        signatures).encodeABI();
    } else {
      return this.proxyContract.methods.execTransaction(
        eip712Message.message.to,
        eip712Message.message.value,
        eip712Message.message.data,
        eip712Message.message.operation,
        eip712Message.message.safeTxGas,
        eip712Message.message.baseGas,
        eip712Message.message.gasPrice,
        eip712Message.message.gasToken,
        eip712Message.message.refundReceiver).encodeABI();
    }
  }

  /**
   * Validates the properties of a 'SafeTransaction' and formats it in the EIP712 format.
   * @param safeTransaction
   */
  toEIP712Message(safeTransaction:GnosisSafeTransaction)
  {
    if (!BN.isBN(safeTransaction.safeTxGas))
      throw new Error("The 'safeTxGas' property of the transaction is not a valid bn.js BigNum.");
    if (!BN.isBN(safeTransaction.baseGas))
      throw new Error("The 'baseGas' property of the transaction is not a valid bn.js BigNum.");
    if (!BN.isBN(safeTransaction.gasPrice))
      throw new Error("The 'gasPrice' property of the transaction is not a valid bn.js BigNum.");
    if (!BN.isBN(safeTransaction.value))
      throw new Error("The 'value' property of the transaction is not a valid bn.js BigNum.");
    if (!safeTransaction.data.startsWith("0x"))
      throw new Error("The 'data' property doesn't have a '0x' prefix and therefore is not a valid byteString.");
    if (!this.web3.utils.isAddress(safeTransaction.gasToken))
      throw new Error("The 'gasToken' property doesn't contain a valid Ethereum address.");
    if (!this.web3.utils.isAddress(safeTransaction.to))
      throw new Error("The 'to' property doesn't contain a valid Ethereum address.");
    if (!this.web3.utils.isAddress(safeTransaction.refundReceiver))
      throw new Error("The 'refundReceiver' property doesn't contain a valid Ethereum address.");
    if (!Number.isInteger(safeTransaction.nonce))
      throw new Error("The 'nonce' property doesn't contain a javascript integer value.");

    const message = {
      to: safeTransaction.to,
      value: safeTransaction.value,
      data: safeTransaction.data,
      operation: safeTransaction.operation,
      safeTxGas: safeTransaction.safeTxGas,
      baseGas: safeTransaction.baseGas,
      gasPrice: safeTransaction.gasPrice,
      gasToken: safeTransaction.gasToken,
      refundReceiver: safeTransaction.refundReceiver,
      nonce: safeTransaction.nonce
    };

    return {
      types: {
        EIP712Domain: [
          { type: "address", name: "verifyingContract" }
        ],
        // "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)"
        SafeTx: [
          { type: "address", name: "to" },
          { type: "uint256", name: "value" },
          { type: "bytes", name: "data" },
          { type: "uint8", name: "operation" },
          { type: "uint256", name: "safeTxGas" },
          { type: "uint256", name: "baseGas" },
          { type: "uint256", name: "gasPrice" },
          { type: "address", name: "gasToken" },
          { type: "address", name: "refundReceiver" },
          { type: "uint256", name: "nonce" }
        ]
      },
      domain: {
        verifyingContract: this.address
      },
      primaryType: "SafeTx",
      message
    };
  }

  private estimateDataGasCosts(data: ByteString): number {
    const reducer = (accumulator, currentValue) => {
      if (currentValue === EMPTY_DATA) {
        return accumulator + 0
      }

      if (currentValue === '00') {
        return accumulator + 4
      }

      return accumulator + 16
    }

    return data.match(/.{2}/g)?.reduce(reducer, 0)
  }

  async estimateSafeTxGasCosts(safeTransaction:GnosisSafeTransaction) : Promise<BN> {
    // from https://github.com/gnosis/safe-react -> /src/logic/safe/transactions/gasNew.ts
    const eip712Message = this.toEIP712Message(safeTransaction);

    const requiredTxGasAbiMessage = await this.proxyContract.methods.requiredTxGas(
      eip712Message.message.to,
      eip712Message.message.value,
      eip712Message.message.data,
      eip712Message.message.operation)
      .encodeABI();

    const estimationResult = await this.web3.eth.call({
      to: this.address,
      from: this.address,
      data: requiredTxGasAbiMessage,
    });

    const txGasEstimation = new BN(estimationResult.substring(138), 16).toNumber() + 10000;
    const dataGasEstimation = this.estimateDataGasCosts(eip712Message.message.data) + 21000
    const additionalGasBatches = [10000, 20000, 40000, 80000, 160000, 320000, 640000, 1280000, 2560000, 5120000]

    const batch = new this.web3.BatchRequest();

    const estimationRequests = additionalGasBatches.map((additionalGas:number) => {
      return new Promise((resolve) => {
      // there are no type definitions for .request, so for now ts-ignore is there
      // Issue link: https://github.com/ethereum/web3.js/issues/3144
      // eslint-disable-next-line
      // @ts-ignore
      const request = this.web3.eth.call.request(
        {
          to: this.address,
          from: this.address,
          data: requiredTxGasAbiMessage,
          gasPrice: 0,
          gasLimit: txGasEstimation + dataGasEstimation + additionalGas,
        },
        (error, res) => {
          // res.data check is for OpenEthereum/Parity revert messages format
          const isOpenEthereumRevertMsg = res && typeof res.data === 'string'
          const isEstimationSuccessful =
            !error &&
            ((typeof res === 'string' && res !== '0x') || (isOpenEthereumRevertMsg && res.data.slice(9) !== '0x'))

          resolve({
            success: isEstimationSuccessful,
            estimation: txGasEstimation + additionalGas,
          })
        });

        batch.add(request);
      });
    });

    batch.execute();

    const estimationResponses = await Promise.all(estimationRequests)
    const firstSuccessfulRequest: any = estimationResponses.find((res: any) => res.success)

    if (firstSuccessfulRequest) {
      return firstSuccessfulRequest.estimation
    }

    return new BN(0);
  }

  estimateBaseGasCosts(safeTransaction:GnosisSafeTransaction, signatureCount:number) : BN
  {
    const abiMessage = this.toAbiMessage(safeTransaction);
    const baseGasCosts = GnosisSafeProxyInstance.estimateBaseGasCosts(abiMessage);
    const signatureCosts = signatureCount == 0 ? new BN(0) : GnosisSafeProxyInstance.estimateSignatureCosts(signatureCount);
    return baseGasCosts.add(signatureCosts);
  }

  private static estimateSignatureCosts(signatureCount:number) : BN
  {
    // (array count (3 -> r, s, v) + ecrecover costs) * signature count;
    return new BN(signatureCount * (68 + 2176 + 2176 + 6000));
  }

  private static estimateBaseGasCosts(abiMessage:ByteString) : BN
  {
    const baseGasValue = (hexValue:string) => {
      switch(hexValue) {
        case "0x": return 0
        case "00": return 4
        default: return 68
      }
    };

    const reducer = (accumulator:any, currentValue:any) => accumulator += baseGasValue(currentValue)

    const m = abiMessage.match(/.{2}/g);
    if (!m) {
      throw new Error("match(/.{2}/g) failed.")
    }
    return new BN(m.reduce(reducer, 0));
  }
}