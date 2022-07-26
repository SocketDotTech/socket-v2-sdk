import { SocketPreferences } from "./SocketPreferences";

export enum SortOptions {
  Output = "output",
  Gas = "gas",
  Time = "time",
}

export interface QuotePreferences extends SocketPreferences {
  /** Flag to return only best route per bridge using the sort criteria **/
  uniqueRoutesPerBridge?: boolean;
  /** Param to sort routes based on. **/
  sort?: SortOptions;
  /** Maximum number of transactions.
   * This option will be ignored if singleTxOnly is marked as true. **/
  maxUserTxs?: string;
  /** Only get quotes with that are compatible with contracts **/
  isContractCall?: boolean;
  /** include gas transfer with bridging tx **/
  bridgeWithGas?: boolean;
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
