import { BridgeInsuranceData } from "./BridgeInsuranceData";
import { RefuelData } from "./RefuelData";
import type { Route } from "./Route";

export type StartActiveRouteInputDTO = {
  /**
   * Chain id of source chain.
   */
  fromChainId: number;
  /**
   * Chain id of destination chain.
   */
  toChainId: number;
  /**
   * Token address on source chain.
   */
  fromAssetAddress: string;
  /**
   * Token address on destination chain.
   */
  toAssetAddress: string;
  /**
   * Include the tx details for the first user transaction. If true it will return the txData txType etc.
   * If false, it will only return the active route Id of the selected route.
   */
  includeFirstTxDetails?: boolean;
  /**
   * Selected route by the user to bridge tokens from one chain to another.
   */
  route: Route;
  /** Refuel data for if the user have selected bridge with gas option */
  refuel?: RefuelData;
  /** Bridge Insurance data if the user has opted for bridge insurance */
  bridgeInsuranceData?: BridgeInsuranceData
};
