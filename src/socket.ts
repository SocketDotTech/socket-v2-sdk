import {
  Approvals,
  Balances,
  NextTxResponse,
  OpenAPI,
  Quote,
  Routes,
  Server,
  Supported,
  TokenLists,
} from "./client";
import { ActiveRouteStatus, ActiveRouteResponse } from "./client/models/ActiveRouteResponse";
import { QuotePreferences } from "./client/models/QuoteRequest";
import { SocketTx } from "./socketTx";
import { QuoteParams, SocketOptions, SocketQuote } from "./types";

export class Socket {
  options: SocketOptions;

  client = {
    routes: Routes,
    balances: Balances,
    approvals: Approvals,
    server: Server,
    quote: Quote,
    supported: Supported,
    tokenLists: TokenLists,
  };

  constructor(options: SocketOptions) {
    this.options = options;
    OpenAPI.API_KEY = this.options.apiKey;
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
      fromAmount: amount,
      userAddress: address,
      recipient: address,
      ...(this.options.defaultQuotePreferences || {}),
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

  public assertTxDone(socketTx?: SocketTx) {
    if (socketTx && !socketTx.done) {
      throw new Error(
        `Previous transaction ${socketTx.userTxIndex}: ${socketTx.userTxType} has not been submitted.`
      );
    }
  }

  async *executor(
    initialTx: NextTxResponse,
    activeRoute?: ActiveRouteResponse
  ): AsyncGenerator<SocketTx, void, string> {
    let nextTx: NextTxResponse = initialTx;
    let prevSocketTx: SocketTx | undefined;

    do {
      if (prevSocketTx) {
        this.assertTxDone(prevSocketTx);
        nextTx = (await Routes.nextTx({ activeRouteId: initialTx.activeRouteId })).result;
      }
      const currentSocketTx = new SocketTx(nextTx, this.options.statusCheckInterval);
      let hash = activeRoute?.userTxs[currentSocketTx.userTxIndex].sourceTransactionHash;
      if (!hash) {
        hash = yield currentSocketTx;
        if (!hash) {
          throw new Error(`A hash must be provided to \`next\``);
        }
      }
      await currentSocketTx.submit(hash);
      prevSocketTx = currentSocketTx;
    } while (nextTx.userTxIndex + 1 < nextTx.totalUserTx);
  }

  async start(quote: SocketQuote) {
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

    return this.executor(routeStart);
  }

  async continue(activeRouteId: number) {
    const activeRoute = (await Routes.getActiveRoute({ activeRouteId: activeRouteId })).result;
    if (activeRoute.routeStatus === ActiveRouteStatus.COMPLETED) {
      throw new Error(`Route ${activeRoute.activeRouteId} is already complete`);
    }

    const tx = (await Routes.nextTx({ activeRouteId: activeRoute.activeRouteId })).result;
    return this.executor(tx, activeRoute);
  }
}
