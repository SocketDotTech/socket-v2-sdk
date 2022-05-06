import { TxStatus } from "./TxStatus";

export type BridgeStatusResponse = {
  /**
   * Source Transaction.
   */
  sourceTx: string;
  /**
   * Status of source transaction while bridging.
   */
  sourceTxStatus: TxStatus;
  /**
   * Destination Transaction hash.
   */
  destinationTransactionHash: string;
  /**
   * Status of destination transaction while bridging.
   */
  destinationTxStatus: TxStatus;
  /**
   * Source Chain Id
   */
  fromChainId: number;
  /**
   * Destination Chain Id.
   */
  toChainId: number;
};
