import type Web3 from "web3";
import type Common from "ethereumjs-common";
import {Transaction, TxData} from "ethereumjs-tx";
import {config} from "./config";
import type {Address, ByteString} from "./safe/gnosisSafeTransaction";
import BN from "bn.js";

export async function signRawTransaction(web3:Web3, to:Address, data:ByteString, gasLimit:BN, value:BN)
    : Promise<ByteString>
{
    const ethJsCommon: Common = await config.getCurrent().ethjs.getCommon(web3);
    const nonce = "0x" + new BN(await web3.eth.getTransactionCount(config.xDai.ACCOUNT.address)).toString("hex");

    const rawTx: TxData = {
        gasPrice: "0x" + config.getCurrent().getGasPrice(web3).toString("hex"),
        gasLimit: "0x" + gasLimit.toString("hex"),
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
