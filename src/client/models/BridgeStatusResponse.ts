import { RefuelStatusResponse } from "./RefuelStatusResponse";
import { Token } from "./Token";
import { TxStatus } from "./TxStatus";

export type BridgeStatusResponse = {
  /**
   * Destination Transaction hash.
   */
  destinationTransactionHash?: string;
  /**
   * Status of source transaction while bridging.
   */
  sourceTxStatus: TxStatus;
  /**
   * Bridge name
   */
  bridgeName: string;
  /**
   * Indicates whether the tx is a socket transaction
   */
  isSocketTx: boolean;
  /**
   * Source Transaction.
   */
  sourceTransactionHash: string;
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
  /**
   * Refuel
   */
  refuel?: RefuelStatusResponse;
  /**
   * Source Asset
   */
  fromAsset?: Token;
  /**
   * Destination Asset (actual received token)
   */
  toAsset?: Token;
  /**
   * Source Token Price
   */
  srcTokenPrice?: number;
  /**
   * Destination Token Price
   */
  destTokenPrice?: number;
  /**
   * Source Amount
   */
  fromAmount?: string;
  /**
   * Destination Amount (actual amount received)
   */
  toAmount?: string;
  /**
   * Address of the sender
   */
  sender?: string;
  /**
   * Address of the recipient
   */
  recipient?: string;
};
