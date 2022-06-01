import { BridgeName } from "./BridgeDetails";

export interface QuotePreferences {
  /** Flag to return only best route per bridge using the sort criteria **/
  uniqueRoutesPerBridge?: boolean;
  /** Param to sort routes based on. **/
  sort?: "output" | "gas" | "time";
  /** Flag to specify if routes that have dex swap should be ignored. **/
  disableSwapping?: boolean;
  /** Specify Dexes that should be included in routes. **/
  includeDexes?: Array<"oneinch" | "zerox">;
  /** Specify Dexes that should be excluded in routes.
   * This option will be ignored if includeDexes is specified. **/
  excludeDexes?: Array<"oneinch" | "zerox">;
  /** Specify Bridges that should be included in routes. **/
  includeBridges?: Array<BridgeName>;
  /** Specify Bridges that should be excluded in routes.
   * This option will be ignored if includeBridges is specified. **/
  excludeBridges?: Array<BridgeName>;
  /** Maximum number of transactions.
   * This option will be ignored if singleTxOnly is marked as true. **/
  maxUserTxs?: string;
  /** Only get quotes with one user transaction to bridge. **/
  singleTxOnly?: boolean;
  /** Only get quotes with that are compatible with contracts **/
  isContractCall?: boolean;
}

export interface QuoteRequest extends QuotePreferences {
  /** Chain id of source chain. **/
  fromChainId: number;
  /** Token address on source chain. **/
  fromTokenAddress: string;
  /** Chain id of destination chain. **/
  toChainId: number;
  /** Token address on destination chain. **/
  toTokenAddress: string;
  /** Amount of sending tokens. **/
  fromAmount: string;
  /** Address of user. This will be used to check approvals. **/
  userAddress: string;
  /** Address of recipient. This will be used to check approvals. **/
  recipient?: string;
}
