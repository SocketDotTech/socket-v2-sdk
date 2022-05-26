import type { QuoteOutputDTO } from "../models/QuoteOutputDTO";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class Quote {
  /**
   * @returns QuoteOutputDTO Returns all the possible routes for bridging tokens from one chain to another. One of the routes can be selected and passed in to start the route.
   * @throws ApiError
   */
  public static getQuote({
    fromChainId,
    fromTokenAddress,
    toChainId,
    toTokenAddress,
    fromAmount,
    userAddress,
    uniqueRoutesPerBridge,
    sort,
    recipient,
    disableSwapping,
    includeDexes,
    excludeDexes,
    includeBridges,
    excludeBridges,
    maxUserTxs,
    singleTxOnly,
    isContractCall,
  }: {
    /** Chain id of source chain. **/
    fromChainId: number;
    /** Token address on source chain. **/
    fromTokenAddress: string;
    /** Chain id of destination chain. **/
    toChainId: number;
    /** Token address on destination chain. **/
    toTokenAddress: string;
    /** Amount of sending tokens. **/
    fromAmount: string;
    /** Address of user. This will be used to check approvals. **/
    userAddress: string;
    /** Flag to return only best route per bridge using the sort criteria **/
    uniqueRoutesPerBridge?: boolean;
    /** Param to sort routes based on. **/
    sort?: "output" | "gas" | "time";
    /** Address of recipient. This will be used to check approvals. **/
    recipient?: string;
    /** Flag to specify if routes that have dex swap should be ignored. **/
    disableSwapping?: boolean;
    /** Specify Dexes that should be included in routes. **/
    includeDexes?: Array<"oneinch" | "zerox">;
    /** Specify Dexes that should be excluded in routes.
     * This option will be ignored if includeDexes is specified. **/
    excludeDexes?: Array<"oneinch" | "zerox">;
    /** Specify Bridges that should be included in routes. **/
    includeBridges?: Array<
      | "polygon-bridge"
      | "hop"
      | "anyswap-router-v4"
      | "hyphen"
      | "arbitrum-bridge"
      | "connext"
      | "celer"
    >;
    /** Specify Bridges that should be excluded in routes.
     * This option will be ignored if includeBridges is specified. **/
    excludeBridges?: Array<
      | "polygon-bridge"
      | "hop"
      | "anyswap-router-v4"
      | "hyphen"
      | "arbitrum-bridge"
      | "connext"
      | "celer"
    >;
    /** Maximum number of transactions.
     * This option will be ignored if singleTxOnly is marked as true. **/
    maxUserTxs?: string;
    /** Only get quotes with one user transaction to bridge. **/
    singleTxOnly?: boolean;
    /** Only get quotes with that are compatible with contracts **/
    isContractCall?: boolean;
  }): CancelablePromise<QuoteOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/quote",
      headers: {
        "API-KEY": OpenAPI.API_KEY,
      },
      query: {
        fromChainId: fromChainId,
        fromTokenAddress: fromTokenAddress,
        toChainId: toChainId,
        toTokenAddress: toTokenAddress,
        fromAmount: fromAmount,
        userAddress: userAddress,
        recipient: recipient,
        uniqueRoutesPerBridge: uniqueRoutesPerBridge,
        disableSwapping: disableSwapping,
        includeDexes: includeDexes,
        excludeDexes: excludeDexes,
        includeBridges: includeBridges,
        excludeBridges: excludeBridges,
        sort: sort,
        maxUserTxs: maxUserTxs,
        singleTxOnly: singleTxOnly,
        isContractCall: isContractCall,
      },
    });
  }
}
