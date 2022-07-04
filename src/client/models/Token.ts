import { ChainId } from "./ChainId";

export type Token = {
  /**
   * Name of token.
   */
  name?: string;
  /**
   * Address of token.
   */
  address: string;
  /**
   * URL for icon of token.
   */
  icon?: string;
  /**
   * Decimal used for token.
   */
  decimals?: number;
  /**
   * Symbol of token.
   */
  symbol: string;
  /**
   * Chain id of the token
   */
  chainId: ChainId;
  /**
   * URL for icon of token.
   */
  logoURI?: string;
  /**
   * Unique Id over all chains
   */
  chainAgnosticId?: string | null;
};
