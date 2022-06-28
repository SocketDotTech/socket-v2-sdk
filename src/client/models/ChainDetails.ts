import { ChainId } from "./ChainId";
import type { GasTokenDetails } from "./GasTokenDetails";

export type ChainDetails = {
  /**
   * Id of chain.
   */
  chainId: ChainId;
  /**
   * Name of chain.
   */
  name: string;
  /**
   * URL for icon of chain.
   */
  icon: string;
  /**
   * Flag indicating whether the chain is L1.
   */
  isL1: boolean;
  /**
   * Flag indicating whether sending of tokens is supported from chain.
   */
  sendingEnabled: boolean;
  /**
   * Flag indicating whether receiving of tokens is supported to chain.
   */
  receivingEnabled: boolean;
  currency: GasTokenDetails;
  rpcs: Array<string>;
  explorers: Array<string>;
};
