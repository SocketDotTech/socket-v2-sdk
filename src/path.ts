import { TokenAsset } from "./client";

/**
 * The Path object represents a trade from a source token to a destination token.
 */
export class Path {
  /**
   * The source token
   */
  fromToken: TokenAsset;
  /**
   * The destination token
   */
  toToken: TokenAsset;

  /**
   *
   * @param options The options for the path
   * @param options.fromToken The source token
   * @param options.toToken The destination token
   */
  constructor({ fromToken, toToken }: { fromToken: TokenAsset; toToken: TokenAsset }) {
    this.fromToken = fromToken;
    this.toToken = toToken;
  }
}
