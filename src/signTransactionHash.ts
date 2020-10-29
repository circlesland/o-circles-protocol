import type Web3 from "web3";
import * as EthLibAccount from "eth-lib/lib/account";

export function signTransactionHash(
    web3:Web3,
    safeOwnerPrivateKey:string,
    transactionHash:string
) {
    const signature = EthLibAccount.sign(transactionHash, safeOwnerPrivateKey);
    const vrs = EthLibAccount.decodeSignature(signature);

    const sig = {
        signature,
        r: web3.utils.toBN(vrs[1]).toString("hex"),
        s: web3.utils.toBN(vrs[2]).toString("hex"),
        v: web3.utils.toDecimal(vrs[0]), // Leave the 'v' value at 27 or 28 to get into the EOA verification in GnosisSafe.sol:255
    };
    return sig;
}
