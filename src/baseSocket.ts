import { Chain } from "./chain";
import {
  Approvals,
  Balances,
  BridgeRouteErrors,
  NextTxResponse,
  OpenAPI,
  Quotes,
  Routes,
  Server,
  SortOptions,
  Supported,
  TokenLists,
} from "./client";
import { ActiveRouteStatus, ActiveRouteResponse } from "./client/models/ActiveRouteResponse";
import { QuotePreferences } from "./client/models/QuoteRequest";
import { SocketTx } from "./socketTx";
import { TokenList } from "./tokenList";
import { QuoteParams, SocketOptions, SocketQuote } from "./types";
import { Web3Provider } from "@ethersproject/providers";
import { ChainId } from "@socket.tech/ll-core";
import { ActiveRoutesRequest } from "./client/models/ActiveRoutesRequest";
import { SocketPreferences } from "./client/models/SocketPreferences";
import { TokenListRequest } from "./client/models/TokenListRequest";

export interface ActiveRouteGenerator extends AsyncGenerator<SocketTx, void, string> {
  /** Active Route Id */
  activeRouteId: number;
}

/**
 * The Socket represents the socket sdk. This is the starting point for interacting
 * with the socket SDK. It allows you to retrieve routes and start the execution of trades based on quotes
 *
 * It includes direct access to the socket api.
 */
export abstract class BaseSocket {
  /**
   * The api options
   */
  protected _options: SocketOptions;

  /**
   * Cached instance of all chain details
   */
  protected _chainsCache: Chain[] | undefined;

  /**
   * The provider to use for executing routes
   */
  protected _provider: Web3Provider | undefined;

  /**
   * API client for accessing the socket api directly
   */
  client = {
    routes: Routes,
    balances: Balances,
    approvals: Approvals,
    server: Server,
    quotes: Quotes,
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
    OpenAPI.BASE = this._options.baseUrl ?? OpenAPI.BASE;
  }

  /**
   * Get all supported chains
   * @returns List of chains
   */
  async getChains() {
    if (this._chainsCache) return this._chainsCache;

    const supportedChains = await Supported.getAllSupportedChains();

    this._chainsCache = supportedChains.result.map((chain) => new Chain(chain));

    return this._chainsCache;
  }

  /**
   * Get a chain by id
   * @param chainId The numeric id of the chain
   * @returns The requested chain
   */
  async getChain(chainId: ChainId) {
    const chains = await this.getChains();
    const chain = chains.find((c) => c.chainId === chainId);
    if (!chain) {
      throw new Error("Chain not supported");
    }

    return chain;
  }

  /**
   * get Balances for a user address
   * @param userAddress The user address 
   */
  async getBalances({userAddress}) {
    return await Balances.getBalances({userAddress})
  }


  /**
   * get Balance for a user address
   * @param tokenAddress The token address
   * @param chainId The chain id
   * @param userAddress The user address
   * @returns The balance
   */

  async getBalance({
    tokenAddress,
    chainId,
    userAddress,
  }) {
    return await Balances.getBalance({
      tokenAddress,
      chainId,
      userAddress,
    })
  }


  /**
   * Get the list of tokens available for each chain for a given path
   * @param options
   * @param options.fromChainId The source chain id e.g. 0x1
   * @param options.toChainId The destination chain id e.g. 0x56
   *
   * @returns The `from` and `to` token lists
   */
  async getTokenList(request: TokenListRequest) {
    const fromTokenListData = (
      await TokenLists.getFromTokenList({
        isShortList: true,
        ...request,
      })
    ).result;
    const toTokenListData = (
      await TokenLists.getToTokenList({
        isShortList: true,
        ...request,
      })
    ).result;

    const from = new TokenList(request.fromChainId, fromTokenListData);
    const to = new TokenList(request.toChainId, toTokenListData);

    return { from, to };
  }

  /**
   * Checks that the preferences desired are valid
   * @param preferences The socket preferences
   */
  private validatePreferences(preferences: SocketPreferences) {
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
    const {routes} = await this.getAllQuotes(params, preferences);
    // API returns the 'sort by time' in descending order of service time, hence reversing the order
    // To be removed once API response is fixed
    if (preferences?.sort === SortOptions.Time) {
      return routes ? routes.reverse()[0] : null;
    } else return routes ? routes[0] : null;
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
  ): Promise<{ routes: SocketQuote[]; bridgeRouteErrors: BridgeRouteErrors }> {
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

    const quote = (await Quotes.getQuote(request)).result;
    return {
      routes:
        quote.routes?.map((route) => ({
          route,
          path,
          address,
          amount,
          refuel: quote.refuel,
          errors: quote.bridgeRouteErrors,
        })) || [],
      bridgeRouteErrors: quote.bridgeRouteErrors,
    };
  }

  /**
   * Retrieve the active routes. Active routes can be used to continue a quote
   * @param options Criteria for returning active routes. Commonly `address` is most useful
   * @returns list of active routes
   */
  async getActiveRoutes(options: ActiveRoutesRequest) {
    const routes = await Routes.getActiveRoutesForUser(options);
    return routes.result;
  }

  /**
   * Asserts that the transaction object has been marked done
   * @param socketTx The socket transaction
   */
  private _assertTxDone(socketTx?: SocketTx) {
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
  private async *_executor(
    initialTx: NextTxResponse,
    activeRoute?: ActiveRouteResponse
  ): AsyncGenerator<SocketTx, void, string> {
    let nextTx: NextTxResponse = initialTx;
    let prevSocketTx: SocketTx | undefined;

    do {
      if (prevSocketTx) {
        this._assertTxDone(prevSocketTx);
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
  protected async _startQuote(quote: SocketQuote): Promise<ActiveRouteGenerator> {
    const routeStart = (
      await Routes.startActiveRoute({
        startRequest: {
          route: quote.route,
          refuel: quote.refuel,
          fromChainId: quote.path.fromToken.chainId,
          toChainId: quote.path.toToken.chainId,
          fromAssetAddress: quote.path.fromToken.address,
          toAssetAddress: quote.path.toToken.address,
          includeFirstTxDetails: true,
        },
      })
    ).result;

    return { activeRouteId: routeStart.activeRouteId, ...this._executor(routeStart) };
  }

  /**
   * Continue an active route
   * @param activeRouteId The active route id of the desired route to continue
   * @returns An iterator that will yield each transaction required in the route
   */
  protected async _continueRoute(activeRouteId: number): Promise<ActiveRouteGenerator> {
    const activeRoute = (await Routes.getActiveRoute({ activeRouteId: activeRouteId })).result;
    if (activeRoute.routeStatus === ActiveRouteStatus.COMPLETED) {
      throw new Error(`Route ${activeRoute.activeRouteId} is already complete`);
    }

    const tx = (await Routes.nextTx({ activeRouteId: activeRoute.activeRouteId })).result;
    return {
      activeRouteId: activeRoute.activeRouteId,
      ...this._executor(tx, activeRoute),
    };
  }
}
