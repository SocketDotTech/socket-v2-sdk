import { TxStatus } from "./TxStatus";

export type RouteStatusOutputDTO = {
  /**
   * Status of API.
   */
  status: boolean;
  result: TxStatus;
};
