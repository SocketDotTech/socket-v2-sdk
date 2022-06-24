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
import { TokenList } from "./tokenList";
import { QuoteParams, SocketOptions, SocketQuote } from "./types";

/**
 * The Socket represents the socket sdk. This is the starting point for interacting
 * with the socket SDK. It allows you to retrieve routes and start the execution of trades based on quotes
 *
 * It includes direct access to the socket api.
 */
export class Socket {
  /**
   * The api options
   */
  options: SocketOptions;

  /**
   * API client for accessing the socket api directly
   */
  client = {
    routes: Routes,
    balances: Balances,
    approvals: Approvals,
    server: Server,
    quote: Quote,
    supported: Supported,
    tokenLists: TokenLists,
  };

  /**
   *
   * @param options Socket sdk options
   */
  constructor(options: SocketOptions) {
    this.options = options;
    OpenAPI.API_KEY = this.options.apiKey;
  }

  /**
   *
   * @param options
   * @param options.fromChainId The source chain id e.g. 0x1
   * @param options.toChainId The destination chain id e.g. 0x56
   *
   * @returns The `from` and `to` token lists
   */
  async getTokenList({ fromChainId, toChainId }: { fromChainId: number; toChainId: number }) {
    const fromTokenListData = (
      await TokenLists.getFromTokenList({
        fromChainId,
        toChainId,
        isShortList: true,
      })
    ).result;
    const toTokenListData = (
      await TokenLists.getToTokenList({
        fromChainId,
        toChainId,
        isShortList: true,
      })
    ).result;

    const from = new TokenList(fromChainId, fromTokenListData);
    const to = new TokenList(toChainId, toTokenListData);

    return { from, to };
  }

  /**
   *
   * @param params The parameters of the quote
   * @param preferences Additional route preferences for retrieving the quote from the api
   * @returns The best quote if found or null
   */
  async getBestQuote(params: QuoteParams, preferences?: QuotePreferences) {
    const allRoutes = await this.getAllQuotes(params, preferences);
    return allRoutes ? allRoutes[0] : null;
  }

  /**
   *
   * @param params The parameters of the quote
   * @param preferences Additional route preferences for retrieving the quote from the api
   * @returns All quotes found
   */
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

  /**
   * Asserts that the transaction object has been marked done
   * @param socketTx The socket transaction
   */
  private assertTxDone(socketTx?: SocketTx) {
    if (socketTx && !socketTx.done) {
      throw new Error(
        `Previous transaction ${socketTx.userTxIndex}: ${socketTx.userTxType} has not been submitted.`
      );
    }
  }

  /**
   * Returns a generator that yields each transaction for a route in sequence
   * @param initialTx The first transaction to execute
   * @param activeRoute The active route object if this executor is for an active route
   */
  private async *executor(
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

  /**
   * Start executing a socket quote/route.
   * @param quote
   * @returns An iterator that will yield each transaction required in the route
   */
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

  /**
   * Continue an active route
   * @param activeRouteId The active route id of the desired route to continue
   * @returns An iterator that will yield each transaction required in the route
   */
  async continue(activeRouteId: number) {
    const activeRoute = (await Routes.getActiveRoute({ activeRouteId: activeRouteId })).result;
    if (activeRoute.routeStatus === ActiveRouteStatus.COMPLETED) {
      throw new Error(`Route ${activeRoute.activeRouteId} is already complete`);
    }

    const tx = (await Routes.nextTx({ activeRouteId: activeRoute.activeRouteId })).result;
    return this.executor(tx, activeRoute);
  }
}
