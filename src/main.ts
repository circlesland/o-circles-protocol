import {config} from "./config";
import {BN} from "ethereumjs-util";
import {ZERO_ADDRESS} from "./consts";
import {GnosisSafeOps} from "./safe/gnosisSafeTransaction";
import {CirclesHub} from "./circles/circlesHub";
import {GnosisSafeProxy} from "./safe/gnosisSafeProxy";
import {GnosisSafeProxyFactory} from "./safe/gnosisSafeProxyFactory";
import {Erc20Token} from "./token/erc20Token";

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

  const safeEvents = [
    GnosisSafeProxy.AddedOwnerEvent, GnosisSafeProxy.ApproveHashEvent, GnosisSafeProxy.ChangedMasterCopyEvent,
    GnosisSafeProxy.ChangedThresholdEvent, GnosisSafeProxy.DisabledModuleEvent, GnosisSafeProxy.EnabledModuleEvent,
    GnosisSafeProxy.ExecutionFailureEvent, GnosisSafeProxy.ExecutionFromModuleFailureEvent, GnosisSafeProxy.ExecutionFromModuleSuccessEvent,
    GnosisSafeProxy.ExecutionSuccessEvent, GnosisSafeProxy.RemovedOwnerEvent, GnosisSafeProxy.SignMsgEvent
  ];
  safeProxy.subscribeTo(safeEvents).subscribe(event =>
  {
     console.log("Safe event:", event);
  });
  // await safeProxy.feedPastEvents(GnosisSafeProxy.queryPastSuccessfulExecutions(safeProxy.safeProxyAddress));


  const circlesToken = new Erc20Token(
    web3,
    "0x591e3b7b6605098f9f78932ff753cb36bc33a825");

  const tokenEvents = [
    Erc20Token.ApprovalEvent, Erc20Token.TransferEvent
  ];
  circlesToken.subscribeTo(tokenEvents).subscribe(event =>
  {
    console.log("Token event:", event);
  });
  // await circlesToken.feedPastEvents(Erc20Token.queryPastTransfers("0xC816d35b511bbBD647a063ef521bA12242C7F4B5"));

  const circlesHub = new CirclesHub(web3, cfg.HUB_ADDRESS);
  const hubEvents = [
    CirclesHub.HubTransferEvent, CirclesHub.OrganizationSignupEvent, CirclesHub.SignupEvent, CirclesHub.TrustEvent
  ];
  // Subscribe to the events of the circles hub.
  circlesHub.subscribeTo(hubEvents).subscribe(event =>
  {
    console.log("Hub event:", event);
  });
  await circlesHub.feedPastEvents(CirclesHub.queryPastSignup(safeProxy.contractAddress));


  /*

    await circlesHub.feedPastEvents(CirclesHub.queryPastTrusts("0xC816d35b511bbBD647a063ef521bA12242C7F4B5", undefined));
    await circlesHub.feedPastEvents(CirclesHub.queryPastTrusts(undefined, "0xC816d35b511bbBD647a063ef521bA12242C7F4B5"));
    await circlesHub.feedPastEvents(CirclesHub.queryPastTransfers("0xC816d35b511bbBD647a063ef521bA12242C7F4B5", undefined));
    await circlesHub.feedPastEvents(CirclesHub.queryPastTransfers(undefined, "0xC816d35b511bbBD647a063ef521bA12242C7F4B5"));
  */
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
