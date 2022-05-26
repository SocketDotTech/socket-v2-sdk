import { ethers } from "ethers";
import { Quote } from "./client";
import { Path } from "./path";

export class Quotes {
  static async getQuotes({
    path,
    amount,
    address,
  }: {
    path: Path;
    amount: ethers.BigNumber;
    address: string;
  }) {
    return (
      await Quote.getQuote({
        fromChainId: path.fromToken.chainId,
        toChainId: path.toToken.chainId,
        fromTokenAddress: path.fromToken.address,
        toTokenAddress: path.toToken.address,
        fromAmount: amount.toString(),
        userAddress: address,
        recipient: address,
        singleTxOnly: true,
      })
    ).result;
  }
}
