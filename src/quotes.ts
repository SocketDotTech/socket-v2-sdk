import BigNumber from "bignumber.js";
import { Quote } from "./client";
import { Path } from "./path";

export class Quotes {
  static async getQuotes(path: Path, amount: BigNumber, address: string) {
    return (
      await Quote.getQuote({
        fromChainId: path.fromToken.chainId,
        toChainId: path.toToken.chainId,
        fromTokenAddress: path.fromToken.address,
        toTokenAddress: path.toToken.address,
        fromAmount: amount.toFixed(),
        userAddress: address,
        recipient: address,
        singleTxOnly: true,
      })
    ).result;
  }
}
