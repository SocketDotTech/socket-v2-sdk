import { Chain } from "./chain";
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
import { Web3Provider } from "@ethersproject/providers";
import { Web3ConnectedSocket } from ".";
import { ChainId } from "@socket.tech/ll-core/constants/types";

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
  _options: SocketOptions;

  /**
   * Cached instance of all chain details
   */
  _chainsCache: Chain[] | undefined;

  /**
   * The provider to use for executing routes
   */
  _provider: Web3Provider | undefined;

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
    this._options = options;
    OpenAPI.API_KEY = this._options.apiKey;
  }

  /**
   * Connect Socket to a provider that will be used to execute routes
   * @param provider The web3 provider to use as user wallet
   */
  connect(provider: Web3Provider) {
    return new Web3ConnectedSocket(this._options, provider);
  }

  async getChains() {
    if (this._chainsCache) return this._chainsCache;

    const supportedChains = await Supported.getAllSupportedChains();

    this._chainsCache = supportedChains.result.map((chain) => new Chain(chain));

    return this._chainsCache;
  }

  async getChain(chainId: ChainId) {
    const chains = await this.getChains();
    const chain = chains.find((c) => c.chainId === chainId);
    if (!chain) {
      throw new Error("Chain not supported");
    }

    return chain;
  }

  /**
   * Get the list of tokens available for each chain for a given path
   * @param options
   * @param options.fromChainId The source chain id e.g. 0x1
   * @param options.toChainId The destination chain id e.g. 0x56
   *
   * @returns The `from` and `to` token lists
   */
  async getTokenList({ fromChainId, toChainId }: { fromChainId: ChainId; toChainId: ChainId }) {
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
   * Checks that the preferences desired are valid
   * @param preferences The quote preferences
   */
  validatePreferences(preferences: QuotePreferences) {
    if (preferences.includeBridges && preferences.excludeBridges) {
      throw new Error("Only one of `includeBridges` or `excludeBridges` can be specified.");
    }

    if (preferences.includeDexes && preferences.excludeDexes) {
      throw new Error("Only one of `includeDexes` or `excludeDexes` can be specified.");
    }
  }

  /**
   * Get the best quote
   * @param params The parameters of the quote
   * @param preferences Additional route preferences for retrieving the quote from the api
   * @returns The best quote if found or null
   */
  async getBestQuote(params: QuoteParams, preferences?: QuotePreferences) {
    const allRoutes = await this.getAllQuotes(params, preferences);
    return allRoutes ? allRoutes[0] : null;
  }

  /**
   * Get All quotes
   * @param params The parameters of the quote
   * @param preferences Additional route preferences for retrieving the quote from the api
   * @returns All quotes found
   */
  async getAllQuotes(
    { path, address, amount }: QuoteParams,
    preferences?: QuotePreferences
  ): Promise<SocketQuote[]> {
    const finalPreferences = {
      ...(this._options.defaultQuotePreferences || {}),
      ...(preferences || {}),
    };
    this.validatePreferences(finalPreferences);

    const request = {
      fromChainId: path.fromToken.chainId,
      toChainId: path.toToken.chainId,
      fromTokenAddress: path.fromToken.address,
      toTokenAddress: path.toToken.address,
      fromAmount: amount,
      userAddress: address,
      recipient: address,
      ...finalPreferences,
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
      const currentSocketTx = new SocketTx(nextTx, this._options.statusCheckInterval);
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
