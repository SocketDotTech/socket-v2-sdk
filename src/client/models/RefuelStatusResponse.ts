import { TxStatus } from "./TxStatus";

export type RefuelStatusResponse = {
    destinationTxStatus: TxStatus;
    sourceTxStatus: TxStatus;
    bridge: string;
    status: TxStatus;
    destinationTransactionHash?: string;
}