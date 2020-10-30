import {config} from "./config";
import {BN} from "ethereumjs-util";
import {ZERO_ADDRESS} from "./consts";
import {GnosisSafeOps} from "./safe/gnosisSafeTransaction";
import {CirclesHub} from "./circles/circlesHub";
import {GnosisSafeProxy} from "./safe/gnosisSafeProxy";
import {GnosisSafeProxyFactory} from "./safe/gnosisSafeProxyFactory";

async function run()
{
  const cfg = config.getCurrent();
  const web3 = cfg.web3();
  const currentBlock = await web3.eth.getBlockNumber();

  /*
      const safeProxy = await GnosisSafeProxyFactory.deployNewSafeProxy(
          web3,
          cfg.GNOSIS_SAFE_ADDRESS,
          cfg.PROXY_FACTORY_ADDRESS,
          cfg.ACCOUNT.address);
  */

  const safeProxy = new GnosisSafeProxy(
    web3,
    cfg.ACCOUNT.address,
    "0xC816d35b511bbBD647a063ef521bA12242C7F4B5");

  const circlesHub = new CirclesHub(web3, cfg.HUB_ADDRESS);


  // Subscribe to the events of the circles hub.
  circlesHub.getEvents().subscribe(event =>
  {
    console.log("Hub event:", event);
  });

  await circlesHub.feedPastTrusts("0xC816d35b511bbBD647a063ef521bA12242C7F4B5");
  await circlesHub.feedPastTrusts(undefined, "0xC816d35b511bbBD647a063ef521bA12242C7F4B5");
  await circlesHub.feedPastTransfers("0xC816d35b511bbBD647a063ef521bA12242C7F4B5", undefined);
  await circlesHub.feedPastTransfers(undefined, "0xC816d35b511bbBD647a063ef521bA12242C7F4B5");


  /*
      const receipt = await circlesHub.signup(
          cfg.ACCOUNT,
          safeProxy);

      const receipt = await circlesHub.setTrust(
          cfg.ACCOUNT,
          safeProxy,
          "0xDE374ece6fA50e781E81Aac78e811b33D16912c7",
          new BN("0"));

      const receipt = await circlesHub.directTransfer(
          cfg.ACCOUNT,
          safeProxy,
          "0xde374ece6fa50e781e81aac78e811b33d16912c7",
          new BN("1"));

      const receipt = await safeProxy.sendEth(
          cfg.ACCOUNT,
          new BN(web3.utils.toWei("0.0000025", "ether")),
          cfg.ACCOUNT.address);

      console.log(receipt);
  */

  // process.exit();
}

run();
