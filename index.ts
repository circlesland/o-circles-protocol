import Web3 from "web3";
import {deploySafe} from "./safe";
import {signupWithExternallyOwnedAccount} from "./hub";

const GNOSIS_SAFE_ADDRESS = '0x5Ed4Ad5BB8e1D5fd254da44D1f4133DE92D0182e';
const PROXY_FACTORY_ADDRESS = '0x63b34d56C78330903427AF9ba051d991A39c02d3';
const HUB_ADDRESS = "0x2F9B05B87825Bc8ff3Eee1b2d6918A9837257ECd";

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
  // Create a new safe
  const deploySafeResult = await deploySafe(
    web3,
    GNOSIS_SAFE_ADDRESS,
    PROXY_FACTORY_ADDRESS,
    ACCOUNT.address
  );

  // Use the new Safe to signup at the hub
  const signupResult = await signupWithExternallyOwnedAccount(
    web3,
    HUB_ADDRESS,
    ACCOUNT.address
  );
}

//run();