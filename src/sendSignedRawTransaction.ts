import type Web3 from "web3";
import type {ByteString} from "./safe/gnosisSafeTransaction";

export async function sendSignedRawTransaction(web3:Web3, serializedTx:ByteString) {
    return web3.eth.sendSignedTransaction(serializedTx)
        .once('transactionHash', (hash) =>
        {
            console.log("web3.eth.sendSignedTransaction | Got transaction hash: " + hash);
        })
        .once('receipt', (receipt) =>
        {
            console.log("web3.eth.sendSignedTransaction | Got receipt:", receipt);
        })
        .on('confirmation', (confNumber, receipt) =>
        {
            console.log("web3.eth.sendSignedTransaction | Got confirmation. Conf No.: " + confNumber);
        })
        .on('error', (error) =>
        {
            console.log("web3.eth.sendSignedTransaction | Got error");
            console.error(error);
        })
        .then(function (receipt)
        {
            console.log("web3.eth.sendSignedTransaction | Transaction was mined.");
            return receipt;
        });
}
