import { BigNumber } from "ethers";
import { NextTxResponse, OpenAPI, Quote, Routes, Supported, TokenLists } from "./client";
import { ActiveRouteStatus } from "./client/models/ActiveRouteResponse";
import { ActiveRoutesRequest } from "./client/models/ActiveRoutesRequest";
import { QuotePreferences } from "./client/models/QuoteRequest";
import { Path } from "./path";
import { SocketTx } from "./socketTx";
import { QuoteParams, SocketActiveQuote, SocketQuote } from "./types";

export class Socket {
  apiKey: string;
  defaultQuotePreferences?: QuotePreferences;

  constructor(apiKey: string, defaultQuotePreferences?: QuotePreferences) {
    this.apiKey = apiKey;
    OpenAPI.API_KEY = this.apiKey;
    this.defaultQuotePreferences = defaultQuotePreferences;
  }

  async getSupportedChains() {
    return (await Supported.getAllSupportedRoutes()).result;
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

  async getBestQuote(params: QuoteParams, preferences?: QuotePreferences) {
    const allRoutes = await this.getAllQuotes(params, preferences);
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

  async *continue(activeRouteId: number): AsyncGenerator<SocketTx> {
    const activeRoute = (await Routes.getActiveRoute({ activeRouteId: activeRouteId })).result;
    if (activeRoute.routeStatus === ActiveRouteStatus.COMPLETED) {
      throw new Error(`Route ${activeRoute.activeRouteId} is already complete`);
    }

    let nextTx: NextTxResponse;

    do {
      nextTx = (await Routes.nextTx({ activeRouteId: activeRoute.activeRouteId })).result;
      yield new SocketTx(nextTx);
    } while (nextTx.userTxIndex + 1 < nextTx.totalUserTx);
  }

  async getActiveRoutes(options: ActiveRoutesRequest): Promise<SocketActiveQuote[]> {
    // TODO: pagination
    const routes = (await Routes.getActiveRoutesForUser(options)).result.activeRoutes;
    const quotes = routes.map((route) => ({
      route,
      path: new Path({ fromToken: route.fromAsset, toToken: route.toAsset }),
      address: route.userAddress,
      amount: BigNumber.from(route.fromAmount),
    }));
    return quotes;
  }
}
