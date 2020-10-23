import type {AbiItem} from "web3-utils";
import type Web3 from "web3";
import {Transaction} from "ethereumjs-tx";

export async function transferERC20(web3:Web3)
{
  const fromAddress = "0xDE374ece6fA50e781E81Aac78e811b33D16912c7";
  const fromPrivateKey = Buffer.from("-- private key goes here --", 'hex');
  const toAddress = "0x4a9aFfA9249F36fd0629f342c182A4e94A13C2e0";

  const transferAmount = 1; // TODO: Get decimal places for Circle-Token (if 8 decimal places, this is 0.00000001)
  const count = await web3.eth.getTransactionCount(fromAddress); // the current transaction count is used as nonce

  let erc20_transfer_abi = <AbiItem>{ "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "type": "function" };

  const tokenContractAddress = "0xDE374ece6fA50e781E81Aac78e811b33D16912c7"; // This is the address of the contract which created the ERC20 token ('daniel' ?!)
  const contract = new web3.eth.Contract([erc20_transfer_abi], tokenContractAddress, {from: fromAddress});

  var rawTransaction = {
    "from": fromAddress,
    "nonce": "0x" + count.toString(16),
    "gasPrice": "0x003B9ACA00",
    "gasLimit": "0x250CA",
    "to": tokenContractAddress,
    "value": "0x0",
    "data": contract.methods.transfer(toAddress, transferAmount).encodeABI(),
    "chainId": 100, // xDai should be '100' accourding to https://chainid.network/chains/
    "networkId": 100
  };

  const tx = new Transaction(rawTransaction);
  tx.sign(fromPrivateKey);
  const serializedTx = tx.serialize();

  const receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
  console.log(`Receipt info:  ${JSON.stringify(receipt, null, '\t')}`);
}