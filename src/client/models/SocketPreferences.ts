import { BridgeName, Dexes } from "..";

export interface SocketPreferences {
  /** Flag to specify if routes that have dex swap should be ignored. **/
  disableSwapping?: boolean;
  /** Specify Dexes that should be included in routes. **/
  includeDexes?: Array<Dexes>;
  /** Specify Dexes that should be excluded in routes.
   * This option will be ignored if includeDexes is specified. **/
  excludeDexes?: Array<Dexes>;
  /** Specify Bridges that should be included in routes. **/
  includeBridges?: Array<BridgeName>;
  /** Specify Bridges that should be excluded in routes.
   * This option will be ignored if includeBridges is specified. **/
  excludeBridges?: Array<BridgeName>;
  /** Only get quotes with one user transaction to bridge. **/
  singleTxOnly?: boolean;
}
