import { NextTxResponse, OpenAPI, Quote, Routes, Supported, TokenLists } from "./client";
import { QuotePreferences } from "./client/models/QuoteRequest";
import { SocketTx } from "./socketTx";
import { QuoteParams, SocketQuote } from "./types";

export class Socket {
  apiKey: string;
  defaultQuotePreferences?: QuotePreferences;

  constructor(apiKey: string, defaultQuotePreferences?: QuotePreferences) {
    this.apiKey = apiKey;
    OpenAPI.API_KEY = this.apiKey;
    this.defaultQuotePreferences = defaultQuotePreferences;
  }

  async getSupportedChains() {
    (await Supported.getAllSupportedRoutes()).result;
  }

  async getTokenList({ fromChainId, toChainId }: { fromChainId: number; toChainId: number }) {
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

  async getBestQuote(params: QuoteParams) {
    const allRoutes = await this.getAllQuotes(params);
    return allRoutes ? allRoutes[0] : null;
  }

  async getAllQuotes(
    { path, address, amount }: QuoteParams,
    preferences?: QuotePreferences
  ): Promise<SocketQuote[]> {
    const request = {
      fromChainId: path.fromToken.chainId,
      toChainId: path.toToken.chainId,
      fromTokenAddress: path.fromToken.address,
      toTokenAddress: path.toToken.address,
      fromAmount: amount.toString(),
      userAddress: address,
      recipient: address,
      ...(this.defaultQuotePreferences || {}),
      ...(preferences || {}),
    };

    const quote = (await Quote.getQuote(request)).result;

    return (
      quote.routes?.map((route) => ({
        route,
        path,
        address,
        amount,
      })) || []
    );
  }

  async *start(quote: SocketQuote): AsyncGenerator<SocketTx> {
    const routeStart = (
      await Routes.startActiveRoute({
        startRequest: {
          route: quote.route,
          fromChainId: quote.path.fromToken.chainId,
          toChainId: quote.path.toToken.chainId,
          fromAssetAddress: quote.path.fromToken.address,
          toAssetAddress: quote.path.toToken.address,
          includeFirstTxDetails: true,
        },
      })
    ).result;

    let nextTx: NextTxResponse | undefined;

    do {
      if (!nextTx) {
        nextTx = routeStart;
      } else {
        nextTx = (await Routes.nextTx({ activeRouteId: routeStart.activeRouteId })).result;
      }
      yield new SocketTx(nextTx);
    } while (nextTx.userTxIndex + 1 < nextTx.totalUserTx);
  }
}
