import {config} from "./config";
import {BN} from "ethereumjs-util";
import {ZERO_ADDRESS} from "./consts";
import {CirclesHub} from "./circles/circlesHub";
import {GnosisSafeProxy} from "./safe/gnosisSafeProxy";
import {GnosisSafeProxyFactory} from "./safe/gnosisSafeProxyFactory";
import {Erc20Token} from "./token/erc20Token";
import type Web3 from "web3";
import {Person} from "./model/person";
import {TrustRelation} from "./interfaces/trustRelation";

/**
 * Initializes an existing safe proxy or creates a new one if none was found.
 * @param web3
 * @param cfg
 */
async function initSafeProxy(web3:Web3, cfg:any)
{
  //
  // Either create a new safe proxy:
  //
  /*
  const safeProxyFactory = new GnosisSafeProxyFactory(web3, cfg.PROXY_FACTORY_ADDRESS, cfg.GNOSIS_SAFE_ADDRESS, cfg.ACCOUNT.address);
  const safeProxy = await safeProxyFactory.deployNewSafeProxy();
  */

  //
  // Or use an existing proxy:
  //
  const safeProxy = new GnosisSafeProxy(
    web3,
    cfg.ACCOUNT.address,
    "0xC816d35b511bbBD647a063ef521bA12242C7F4B5");

  return safeProxy;
}

async function initCirclesHub(web3:Web3, cfg:any, safeProxy:GnosisSafeProxy)
{
  const circlesHub = new CirclesHub(web3, cfg.HUB_ADDRESS);
  return circlesHub;
}

async function run()
{
  const cfg = config.getCurrent();
  const web3 = cfg.web3();

  const safeProxy = await initSafeProxy(web3, cfg);
  const circlesHub = await initCirclesHub(web3, cfg, safeProxy);

  const me = new Person(safeProxy.address, circlesHub);
  const myToken = await me.getOwnToken();
  if (!myToken)
    throw new Error("The person has no token");

  // Get incoming and outgoing trusts
  const {incoming, outgoing} = await me.getTrustRelations();

  // Concat both trust lists and get the addresses of all related persons
  const allRelatedPersons:{[key:string]:any} = {};
  Object.keys(incoming).map(k => incoming[k])
        .concat(Object.keys(outgoing).map(k => outgoing[k]))
    .forEach(trustRelation => {
      allRelatedPersons[trustRelation.from] = null;
      allRelatedPersons[trustRelation.to] = null;
    });

  // Query the token of every related person and
  // then our balance for each token.
  let myBalance = new BN("0");
  const balances = await Promise.all(
    Object.keys(allRelatedPersons)
      .map(addr => new Person(addr, circlesHub))
      .map(async p => {
        const token = await p.getOwnToken();
        if (!token){
          return {
            person: p,
            token: null,
            balance: new BN("0")
          };
        }

        const balance = await token.getBalanceOf(me.address);
        myBalance = myBalance.add(balance);

        return {
          person: p,
          token: token,
          balance: balance
        };
      }));


  // Format the balances
  console.log(`My Token:`);
  console.log(myToken.address)

  console.log("");
  const myBalances = balances
    .filter(o => o.balance.gt(new BN("0")))
    .map(o => `${o.token ? o.token.address : "<no token>"}: ${web3.utils.fromWei(o.balance.toString(), "ether")}`)
    .join('\n');

  console.log("My balances:");
  console.log("----------------------------");
  console.log(myBalances);

  console.log("----------------------------");
  console.log("Total:", web3.utils.fromWei(myBalance.toString(), "ether"));


/*
  const receipt = await circlesHub.setTrust(
    cfg.ACCOUNT,
    safeProxy,
    "0xDE374ece6fA50e781E81Aac78e811b33D16912c7",
    new BN("0"));
*/
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

  process.exit();
}

run();
