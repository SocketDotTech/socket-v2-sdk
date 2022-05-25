import { Chain } from "./chain";
import { TokenAsset } from "./client";

export class Path {
  fromChain: Chain;
  toChain: Chain;
  fromToken: TokenAsset;
  toToken: TokenAsset;
  constructor(fromChain: Chain, toChain: Chain, fromToken: TokenAsset, toToken: TokenAsset) {
    this.fromChain = fromChain;
    this.toChain = toChain;
    this.fromToken = fromToken;
    this.toToken = toToken;
  }
}
