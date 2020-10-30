import {config} from "./config";
import {BN} from "ethereumjs-util";
import {ZERO_ADDRESS} from "./consts";
import {GnosisSafeOps} from "./safe/gnosisSafeTransaction";
import {CirclesHub} from "./circles/circlesHub";
import {GnosisSafeProxy} from "./safe/gnosisSafeProxy";

async function run()
{

  const cfg = config.getCurrent();
  const web3 = cfg.web3();

  //
  // Deploy a new safe ..
  //
  /*
      const safeProxy = await GnosisSafeProxyFactory.deployNewSafeProxy(
          web3,
          cfg.GNOSIS_SAFE_ADDRESS,
          cfg.PROXY_FACTORY_ADDRESS,
          cfg.ACCOUNT.address);
  */

  //
  // .. or use an existing safe
  //

  const safeProxy = new GnosisSafeProxy(
    web3,
    cfg.ACCOUNT.address,
    "0x12345");


  const circlesHub = new CirclesHub(web3, cfg.HUB_ADDRESS);

  //
  // Signup at the circles hub
  //
  /*
  const receipt = await circlesHub.signup(
    safeProxy,
    cfg.ACCOUNT.address,
    cfg.ACCOUNT.privateKey);
  */

  //
  // Trust someone
  //
  /*
   const receipt = await circlesHub.setTrust(
       safeProxy,
       "0x12345",
       new BN("50"),
       cfg.ACCOUNT.address,
       cfg.ACCOUNT.privateKey);

  //
  // Transfer circles to other safes that trust you
  //
  const receipt = await circlesHub.directTransfer(
    safeProxy,
    "0x12345",
    new BN("1"),
    cfg.ACCOUNT.address,
    cfg.ACCOUNT.privateKey);
   */

  //
  // Transfer regular ETH or xDAI via the safe
  //
  /*
  const receipt = await safeProxy.sendEth(
      new BN(web3.utils.toWei("0.025", "ether")),
      cfg.ACCOUNT.address,
      cfg.ACCOUNT.address,
      cfg.ACCOUNT.privateKey);
   */

  // console.log(receipt);

  process.exit();
}

run();
