import type { Token } from "./Token";

export type TokenListOutputDTO = {
  /**
   * Status of API.
   */
  success: boolean;
  result: Array<Token>;
};
