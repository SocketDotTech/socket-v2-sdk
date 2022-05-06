import type { Route } from "./Route";
import type { TokenAsset } from "./TokenAsset";

export type QuoteOutputDTO = {
  /**
   * Status of API.
   */
  success: boolean;
  result: {
    routes?: Array<Route>;
    fromChainId?: number;
    fromAsset?: TokenAsset;
    toChainId?: number;
    toAsset?: TokenAsset;
  };
};
