import type { ApprovalData } from "./ApprovalData";
import { ChainId } from "./ChainId";
import { TxType } from "./TxType";
import { UserTxType } from "./UserTxType";

export type SingleTxResponse = {
  /**
   * Type of user transaction.
   */
  userTxType: UserTxType;
  /**
   * Address to which transaction has to be sent.
   */
  txTarget: string;
  /**
   * Id of chain where transaction has to be sent.
   */
  chainId: ChainId;
  /**
   * Calldata for transaction.
   */
  txData: string;
  /**
   * Type of transaction.
   */
  txType: TxType;
  /**
   * Native token amount to be sent with transaction.
   */
  value: string;
  /**
   * Total number of transactions in Active Route.
   */
  totalUserTx: number;
  approvalData: ApprovalData;
};
