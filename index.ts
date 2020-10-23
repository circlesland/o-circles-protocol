import Web3 from "web3";
import {deploySafe, getSafeOwners, getTransactionHash} from "./safe";
import {getSignupTransactionData, signupWithExternallyOwnedAccount} from "./hub";
import {Transaction} from "ethereumjs-tx";
import {AbiItem} from "web3-utils";

const GNOSIS_SAFE_ADDRESS = '0x5Ed4Ad5BB8e1D5fd254da44D1f4133DE92D0182e';
const PROXY_FACTORY_ADDRESS = '0x63b34d56C78330903427AF9ba051d991A39c02d3';
const HUB_ADDRESS = "0x2F9B05B87825Bc8ff3Eee1b2d6918A9837257ECd";

const ERC20_ABI = [ { "inputs": [ { "internalType": "address", "name": "_owner", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "currentIssuance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "hub", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "inflationOffset", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lastTouched", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "time", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "period", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "periods", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "timeout", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "periodsWhenLastTouched", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "hubDeployedAt", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "stop", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "stopped", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "findInflationOffset", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "look", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "update", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "hubTransfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "dst", "type": "address" }, { "internalType": "uint256", "name": "wad", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" } ];

const ACCOUNT = {
  address: "0x2EA4c9373ed66f9c411ba2253b7BDDcCE3892340",
  privateKey: "244812c31875f500a2af64eae1a5b64c6bf753530a8eabb2b188dac48bc85153"
};

const provider = new Web3.providers.HttpProvider(
  "HTTP://127.0.0.1:7545"
);

const web3 = new Web3();
web3.setProvider(provider);

async function run() {
  // Get metadata about the network
  const chainId = await web3.eth.getChainId();
  const networkId = await web3.eth.net.getId();

  // Create a new safe
  const deploySafeResult = await deploySafe(
    web3,
    GNOSIS_SAFE_ADDRESS,
    PROXY_FACTORY_ADDRESS,
    ACCOUNT.address
  );

  const owners = await getSafeOwners(web3, deploySafeResult.address);

  // -- Use the new Safe to signup at the hub --
  // 1. Construct the transaction that should be executed by the safe
  const signupData = await getSignupTransactionData(web3, HUB_ADDRESS);

  // 2. Send the data to the safe for hashing
  const signupTxData = {
    "from": ACCOUNT.address,
    "nonce": "0x" + Date.now().toString(16), // TODO: timestamp OK?
    "gasPrice": "0x003B9ACA00", // TODO: estimate the gas price and use the estimation
    "gasLimit": "0x250CA",
    "to": HUB_ADDRESS, // The transaction should be sent to the HUB
    "value": "0x0",
    "data": signupData,
    "chainId": chainId,
    "networkId": networkId
  };
  // 3. Wrap the data in a transaction
  const signupTransaction = new Transaction(signupTxData);
  // 4. Let the safe hash the transaction
  const signupTransactionHash = await getTransactionHash(web3, deploySafeResult.address, signupTransaction);
  // TODO: 5. The necessary owner quorum must sign the hash
  // TODO: 6. Let the Safe execute the transaction


  const signupResult = await signupWithExternallyOwnedAccount(
    web3,
    HUB_ADDRESS,
    ACCOUNT.address
  );

  /* Transfer ERC20 Token from Safe to Address:
  const count = await web3.eth.getTransactionCount(ACCOUNT.address);
  const tokenAddress = ""; // TODO: Need the address from the hub.signup method
  const tokenReceiverAddress = ""; // TODO: Who should receive the token?
  const transferAmount = 100000000;
  const erc20Contract = new web3.eth.Contract(<AbiItem[]>ERC20_ABI, tokenAddress);
  const erc20Transfer = erc20Contract.methods.transfer(
      tokenReceiverAddress,
      transferAmount
  ).encodeABI();

  const transferTokenTransactionData = {
      "from": ACCOUNT.address,
      "nonce": "0x" + count.toString(16),
      "gasPrice": "0x003B9ACA00",
      "gasLimit": "0x250CA",
      "to": tokenAddress,
      "value": "0x0",
      "data": erc20Transfer,
      "chainId": chainId,
      "networkId": networkId
  };
  const transferTokenTransaction = new Transaction(transferTokenTransactionData);
  const transferHash = await getTransactionHash(web3, deploySafeResult.address, transferTokenTransaction);
  */
}

// run();