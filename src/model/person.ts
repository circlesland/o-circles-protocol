import type {Safe} from "../interfaces/safe";
import type {Token} from "../interfaces/token";
import type {Address} from "../interfaces/address";
import {CirclesHub} from "../circles/circlesHub";
import {filter} from 'rxjs/operators';
import type {TrustRelation} from "../interfaces/trustRelation";
import type {Event} from "../interfaces/event";
import {BN} from "ethereumjs-util";
import {CirclesToken} from "./circlesToken";

export type TrustConnections = {
  incoming: {[from:string]:TrustRelation},
  outgoing: {[to:string]:TrustRelation},
};

export class Person implements Safe
{
  /**
   * Te address of the safe that represents this participant.
   */
  readonly address: Address;
  readonly circlesHub: CirclesHub;

  constructor(address: Address, circlesHub: CirclesHub)
  {
    this.address = address;
    this.circlesHub = circlesHub;
  }

  /**
   * Gets the personal circles token of this person.
   */
  async getOwnToken(): Promise<CirclesToken|undefined>
  {
    const safeAddress = this.address;
    const foundOwnToken = await new Promise<Token>(async (resolve, reject) =>
    {
      const subscription = this.circlesHub.subscribeTo([CirclesHub.SignupEvent])
        .pipe(
          filter((event: any) => event.returnValues.user
            && event.returnValues.user.toLowerCase() === safeAddress.toLowerCase()),
        )
        .subscribe(signup =>
        {
          subscription.unsubscribe();

          resolve({
            address: signup.returnValues.token
          });
        });

     const count = await this.circlesHub.feedPastEvents(CirclesHub.queryPastSignup(safeAddress));
     if (count == 0) {
       subscription.unsubscribe();
       resolve(undefined);
     }
    });

    if (!foundOwnToken)
      return undefined;

    return new CirclesToken(this.circlesHub.web3, foundOwnToken.address);
  }

  /**
   * Gets the current state of the persons' trust relations by listening to all
   * previous CirclesHub.Trust events for this person and building an aggregate state
   * with the most recent trust limits.
   */
  async getTrustRelations(): Promise<TrustConnections>
  {
    const safeAddress = this.address;

    const incoming: TrustRelation[] = [];
    const outgoing: TrustRelation[] = [];

    const subscription = this.circlesHub.subscribeTo([CirclesHub.TrustEvent])
      .pipe(
        filter((event: any) => event.event == CirclesHub.TrustEvent),
      )
      .subscribe(event =>
      {
        const trustRelation: TrustRelation = {
          blockNumber: new BN(event.blockNumber),
          blockHash: event.blockHash,
          address: event.address,
          from: event.returnValues.user,
          to: event.returnValues.canSendTo,
          limit: event.returnValues.limit
        };

        if (event.returnValues.canSendTo === safeAddress)
        {
          incoming.push(trustRelation);
        }
        if (event.returnValues.user === safeAddress)
        {
          outgoing.push(trustRelation);
        }
      });

    await Promise.all([
      await this.circlesHub.feedPastEvents(CirclesHub.queryPastTrusts(this.address)),
      await this.circlesHub.feedPastEvents(CirclesHub.queryPastTrusts(undefined, this.address))
    ]);

    subscription.unsubscribe();

    const bnComparerAsc = (a: Event, b: Event) => a.blockNumber.cmp(b.blockNumber);

    incoming.sort(bnComparerAsc);
    const incomingConnections:{[key:string]:TrustRelation} = {};
    incoming.forEach(c => incomingConnections[c.from] = c)

    outgoing.sort(bnComparerAsc);
    const outgoingConnections:{[key:string]:TrustRelation} = {};
    outgoing.forEach(c => outgoingConnections[c.to] = c)

    return {
      incoming: incomingConnections,
      outgoing: outgoingConnections
    };
  }
}