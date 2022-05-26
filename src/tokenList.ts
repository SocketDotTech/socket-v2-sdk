import { TokenLists } from "./client";

export class TokenList {
  static async getTokenList({
    fromChainId,
    toChainId,
  }: {
    fromChainId: number;
    toChainId: number;
  }) {
    const fromTokenList = await TokenLists.getFromTokenList({
      fromChainId,
      toChainId,
      isShortList: true,
    });
    const toTokenList = await TokenLists.getToTokenList({
      fromChainId,
      toChainId,
      isShortList: true,
    });

    return {
      from: fromTokenList.result,
      to: toTokenList.result,
    };
  }
}
