export const DeineMudda = null;
//
//
// import {config} from "./config";
// import {BN} from "ethereumjs-util";
// import {ZERO_ADDRESS} from "./consts";
// import {CirclesHub} from "./circles/circlesHub";
// import {GnosisSafeProxy} from "./safe/gnosisSafeProxy";
// import {GnosisSafeProxyFactory} from "./safe/gnosisSafeProxyFactory";
// import {Erc20Token} from "./token/erc20Token";
// import type Web3 from "web3";
// import {Person} from "./model/person";
// import {TrustRelation} from "./interfaces/trustRelation";
// import {CirclesToken} from "./model/circlesToken";
//
// /**
//  * Initializes an existing safe proxy or creates a new one if none was found.
//  * @param web3
//  * @param cfg
//  */
// async function initSafeProxy(web3: Web3, cfg: any)
// {
//   //
//   // Either create a new safe proxy:
//   //
//   /*
//   const safeProxyFactory = new GnosisSafeProxyFactory(web3, cfg.PROXY_FACTORY_ADDRESS, cfg.GNOSIS_SAFE_ADDRESS, cfg.ACCOUNT.address);
//   const safeProxy = await safeProxyFactory.deployNewSafeProxy();
//   */
//
//   //
//   // Or use an existing proxy:
//   //
//   const safeProxy = new GnosisSafeProxy(
//     web3,
//     cfg.ACCOUNT.address,
//     "0xC816d35b511bbBD647a063ef521bA12242C7F4B5");
//
//   return safeProxy;
// }
//
// async function initCirclesHub(web3: Web3, cfg: any, safeProxy: GnosisSafeProxy)
// {
//   const circlesHub = new CirclesHub(web3, cfg.HUB_ADDRESS);
//   return circlesHub;
// }
//
// async function run()
// {
//   const cfg = config.getCurrent();
//   const web3 = cfg.web3();
//
//   const safeProxy = await initSafeProxy(web3, cfg);
//   const circlesHub = await initCirclesHub(web3, cfg, safeProxy);
//
//   const me = new Person(circlesHub, "0xDE374ece6fA50e781E81Aac78e811b33D16912c7");
//   const myToken = await me.getOwnToken();
//   if (!myToken)
//     throw new Error("The person has no token");
//
//   // Get incoming and outgoing trusts
//   const canReceiveFrom  = await me._getCanReceiveFrom();
//   const canSendTo = await me._getCanSendTo();
//
//   const tokenBalance =
//     await Promise.all(
//       (await circlesHub
//         .queryEvents(CirclesHub.queryPastSignups(Object.keys(canReceiveFrom)))
//         .toArray())
//         .map(event =>
//         {
//           return {
//             token: event.returnValues.token,
//             ofUser: event.returnValues.user
//           };
//         })
//         .map(o =>
//         {
//           return {
//             token: new CirclesToken(web3, o.token),
//             person: new Person(circlesHub, o.ofUser, o.token)
//           };
//         })
//         .map(async o =>
//         {
//           return {
//             ...o,
//             circlesBalance: await o.token.getBalanceOf(me.address)
//           }
//         }));
//
//   const total = tokenBalance.map(o => o.balance)
//     .reduce((p, c) => p.add(c), new BN("0")).toString();
//
//   console.log(me.address + " accepts the following tokens:\n---------------------\n", tokenBalance.map(o => o.token.address + " (Balance: " + o.balance.toString() + ")").join("\n"));
//   console.log("\n");
//   console.log(me.address + " total:\n---------------------\n", total);
//   console.log("\n");
//   console.log(me.address + "'s token is accepted by:\n---------------------\n", Object.keys(canSendTo).join("\n"));
//
//   /*
//     const receipt = await circlesHub.setTrust(
//       cfg.ACCOUNT,
//       safeProxy,
//       "0xDE374ece6fA50e781E81Aac78e811b33D16912c7",
//       new BN("0"));
//   */
//   /*
//
//     await circlesHub.feedPastEvents(CirclesHub.queryPastTrusts("0xC816d35b511bbBD647a063ef521bA12242C7F4B5", undefined));
//     await circlesHub.feedPastEvents(CirclesHub.queryPastTrusts(undefined, "0xC816d35b511bbBD647a063ef521bA12242C7F4B5"));
//     await circlesHub.feedPastEvents(CirclesHub.queryPastTransfers("0xC816d35b511bbBD647a063ef521bA12242C7F4B5", undefined));
//     await circlesHub.feedPastEvents(CirclesHub.queryPastTransfers(undefined, "0xC816d35b511bbBD647a063ef521bA12242C7F4B5"));
//   */
//   /*
//       const receipt = await circlesHub.signup(
//           cfg.ACCOUNT,
//           safeProxy);
//
//       const receipt = await circlesHub.setTrust(
//           cfg.ACCOUNT,
//           safeProxy,
//           "0xDE374ece6fA50e781E81Aac78e811b33D16912c7",
//           new BN("0"));
//
//       const receipt = await circlesHub.directTransfer(
//           cfg.ACCOUNT,
//           safeProxy,
//           "0xde374ece6fa50e781e81aac78e811b33d16912c7",
//           new BN("1"));
//
//       const receipt = await safeProxy.sendEth(
//           cfg.ACCOUNT,
//           new BN(web3.utils.toWei("0.0000025", "ether")),
//           cfg.ACCOUNT.address);
//
//       console.log(receipt);
//   */
//
//   process.exit();
// }
//
// run();
