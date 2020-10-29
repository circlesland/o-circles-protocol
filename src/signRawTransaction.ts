import type Web3 from "web3";
import {Address, BN} from "ethereumjs-util";
import Common from "ethereumjs-common";
import {Transaction, TxData} from "ethereumjs-tx";
import {config} from "./config";
import {ByteString} from "./safe/gnosisSafeTransaction";

export async function signRawTransaction(web3:Web3, to:Address, data:ByteString, gasPrice:BN, gasLimit:BN, value:BN)
: Promise<ByteString>
{
    const ethJsCommon: Common = await config.getCurrent().ethjs.getCommon(web3);
    const nonce = "0x" + new BN(await web3.eth.getTransactionCount(config.xDai.ACCOUNT.address)).toString("hex");

    const rawTx: TxData = {
        gasPrice: "0x" + gasPrice.toString("hex"),
        gasLimit: "0x" + gasLimit.add(new BN("24877")).toString("hex"),
        to: to,
        value: "0x" + value.toString("hex"),
        data: data,
        nonce: nonce
    };

    const txOptions = ethJsCommon
        ? {common: ethJsCommon}
        : {};

    const tx = new Transaction(rawTx, txOptions);
    tx.sign(Buffer.from(config.xDai.ACCOUNT.privateKey.slice(2), "hex"));

    return '0x' + tx.serialize().toString('hex');
}
