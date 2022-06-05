// import { TxStatus } from "./TxStatus";
// TODO: Tx status is being returned inconsistently
// SHOULD BE IDENTICALY TO TxStatus
/**
 * Status of transaction while bridging.
 */
export enum PrepareActiveRouteStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

export type RouteStatusOutputDTO = {
  /**
   * Status of API.
   */
  status: boolean;
  result: PrepareActiveRouteStatus;
};
