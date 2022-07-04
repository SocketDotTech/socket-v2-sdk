import { Web3Provider } from "@ethersproject/providers";
import { SocketQuote, Web3ConnectedSocket } from ".";
import { BaseSocket } from "./baseSocket";

/**
 * @inheritdoc
 */
export class Socket extends BaseSocket {
  /**
   * Start executing a socket quote/route.
   * @param quote
   * @returns An iterator that will yield each transaction required in the route
   */
  async start(quote: SocketQuote) {
    return this._startQuote(quote);
  }

  /**
   * Continue an active route
   * @param activeRouteId The active route id of the desired route to continue
   * @returns An iterator that will yield each transaction required in the route
   */
  async continue(activeRouteId: number) {
    return this._continueRoute(activeRouteId);
  }

  /**
   * Connect Socket to a web3 provider that will be used to execute routes
   * @param provider The web3 provider to use as user wallet
   */
  connect(provider: Web3Provider) {
    return new Web3ConnectedSocket(this._options, provider);
  }
}
