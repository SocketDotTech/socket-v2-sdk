// import { TxStatus } from "./TxStatus";
// TODO: Tx status is being returned inconsistently
// SHOULD BE IDENTICALY TO TxStatus
/**
 * Status of transaction while bridging.
 */
export enum RouteTxStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

export type RouteStatusOutputDTO = {
  /**
   * Status of API.
   */
  status: boolean;
  result: RouteTxStatus;
};
