import { Token } from "./client";

/**
 * The Path object represents a trade from a source token to a destination token.
 */
export class Path {
  /**
   * The source token
   */
  fromToken: Token;
  /**
   * The destination token
   */
  toToken: Token;

  /**
   *
   * @param options The options for the path
   * @param options.fromToken The source token
   * @param options.toToken The destination token
   */
  constructor({ fromToken, toToken }: { fromToken: Token; toToken: Token }) {
    if (!fromToken || !toToken) {
      throw new Error("`fromToken` and `toToken` must be defined.");
    }
    this.fromToken = fromToken;
    this.toToken = toToken;
  }
}
