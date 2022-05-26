import { TokenAsset } from "./client";

export class Path {
  fromToken: TokenAsset;
  toToken: TokenAsset;
  constructor({ fromToken, toToken }: { fromToken: TokenAsset; toToken: TokenAsset }) {
    this.fromToken = fromToken;
    this.toToken = toToken;
  }
}
