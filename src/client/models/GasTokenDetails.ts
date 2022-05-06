export type GasTokenDetails = {
  /**
   * Address of gas token.
   */
  address: string;
  /**
   * URL for icon of gas token.
   */
  icon: string;
  /**
   * Name of gas token.
   */
  name: string;
  /**
   * Symbol of gas token.
   */
  symbol: string;
  /**
   * Decimals of gas token.
   */
  decimals: number;
  /**
   * Minimum amount to be left for gas while using max amount.
   */
  minNativeCurrencyForGas: string;
};
