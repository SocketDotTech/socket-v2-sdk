import { RefuelData } from "./RefuelData";
import type { Route } from "./Route";
import type { Token } from "./Token";

export type Quote = {
  routes?: Array<Route>;
  refuel?: RefuelData;
  fromChainId?: number;
  fromAsset?: Token;
  toChainId?: number;
  toAsset?: Token;
};

export type QuoteOutputDTO = {
  /**
   * Status of API.
   */
  success: boolean;
  result: Quote;
};
