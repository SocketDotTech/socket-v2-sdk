import { BridgeName } from "..";

export enum BridgeErrorStatus {
  MIN_AMOUNT_NOT_MET = "MIN_AMOUNT_NOT_MET",
  ASSET_NOT_SUPPORTED = "ASSET_NOT_SUPPORTED",
}

export type BridgeRouteErrors = {
  [bridge in BridgeName]?: {
    /** The error status of the bridge */
    status: BridgeErrorStatus;
    /** Minimum amount for this route if status if `MIN_AMOUNT_NOT_MET`*/
    minAmount?: string;
  };
};
