import {BN} from "ethereumjs-util";
import type Web3 from "web3";

export type Address = string;
export type ByteString = string;

export enum GnosisSafeOps {
    CALL= 0,
    DELETECALL = 1,
    CREATE = 2
}

export interface GnosisSafeTransaction {
    to: Address;
    value: BN;
    data: ByteString;
    operation:GnosisSafeOps;
    safeTxGas?:BN;
    baseGas?:BN;
    gasPrice:BN;
    gasToken:Address;
    refundReceiver:Address;
    nonce?:number;
}

export function validateSafeTransaction(web3:Web3, safeTransaction:GnosisSafeTransaction) {
    if (safeTransaction.safeTxGas && !BN.isBN(safeTransaction.safeTxGas))
        throw new Error("The 'safeTxGas' property of the transaction is not a valid bn.js BigNum.");
    if (safeTransaction.baseGas && !BN.isBN(safeTransaction.baseGas))
        throw new Error("The 'baseGas' property of the transaction is not a valid bn.js BigNum.");
    if (!BN.isBN(safeTransaction.gasPrice))
        throw new Error("The 'gasPrice' property of the transaction is not a valid bn.js BigNum.");
    if (!BN.isBN(safeTransaction.value))
        throw new Error("The 'value' property of the transaction is not a valid bn.js BigNum.");
    if (!safeTransaction.data.startsWith("0x"))
        throw new Error("The 'data' property doesn't have a '0x' prefix and therefore is not a valid byteString.");
    if (!web3.utils.isAddress(safeTransaction.gasToken))
        throw new Error("The 'gasToken' property doesn't contain a valid Ethereum address.");
    if (!web3.utils.isAddress(safeTransaction.to))
        throw new Error("The 'to' property doesn't contain a valid Ethereum address.");
    if (!web3.utils.isAddress(safeTransaction.refundReceiver))
        throw new Error("The 'refundReceiver' property doesn't contain a valid Ethereum address.");
    if (safeTransaction.nonce && !Number.isInteger(safeTransaction.nonce))
        throw new Error("The 'nonce' property doesn't contain a javascript integer value.");
}
