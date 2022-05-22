import type { TokenAsset } from "./TokenAsset";

export type TokenListOutputDTO = {
  /**
   * Status of API.
   */
  success: boolean;
  result: Array<TokenAsset>;
};
