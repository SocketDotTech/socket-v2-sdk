import type { ActiveRoutesOutputDTO } from "../models/ActiveRoutesOutputDTO";
import type { NextTxOutputDTO } from "../models/NextTxOutputDTO";
import type { RouteStatusOutputDTO } from "../models/RouteStatusOutputDTO";
import type { StartActiveRouteInputDTO } from "../models/StartActiveRouteInputDTO";
import type { StartActiveRouteResponseDTO } from "../models/StartActiveRouteResponseDTO";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class Routes {
  /**
   * Function that takes in a route and starts the selected route.
   * Function is responsible for
   * - Saving the selected route to bridge tokens from one chain to another.
   * - Saving the fromChain, toChain, and fromAsssetAddress and toAssetAddress
   * - Returns the Active Route Id, Current Tx, Total number of txs, txType
   * @returns StartActiveRouteResponseDTO Starts the Active Route and gives back the data to start the route
   * @returns any
   * @throws ApiError
   */
  public static startActiveRoute({
    requestBody,
    apiKey,
  }: {
    requestBody: StartActiveRouteInputDTO;
    apiKey?: string;
  }): CancelablePromise<StartActiveRouteResponseDTO | any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v2/route/start",
      headers: {
        "API-KEY": apiKey,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * @returns ActiveRoutesOutputDTO Get active route details using active route id
   * @throws ApiError
   */
  public static getActiveRoutes({
    activeRouteId,
    apiKey,
  }: {
    /** Id of the Active Route. **/
    activeRouteId: string;
    apiKey?: string;
  }): CancelablePromise<ActiveRoutesOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/route/active-routes",
      headers: {
        "API-KEY": apiKey,
      },
      query: {
        activeRouteId: activeRouteId,
      },
    });
  }

  /**
   * @returns ActiveRoutesOutputDTO Get all the active routes from a user address. Filters like fromChainId, toChainId and token addresses can be used to get back specific active routes.
   * @throws ApiError
   */
  public static getActiveRoutesForUser({
    userAddress,
    sort,
    offset,
    limit,
    routeStatus,
    fromChainId,
    toChainId,
    fromTokenAddress,
    toTokenAddress,
    apiKey,
  }: {
    /** Address of user starting the route. **/
    userAddress: string;
    /** Sort param for routes. **/
    sort?: "updatedAt" | "createdAt";
    /** Offset for fetching active routes. **/
    offset?: string;
    /** Number of active routes to return in one API call. **/
    limit?: string;
    /** Status of the route. The route will only be marked completed if all the user txs have been completed. **/
    routeStatus?: "PENDING" | "COMPLETED";
    /** Id of sending chain **/
    fromChainId?: string;
    /** Id of destination chain. **/
    toChainId?: string;
    /** Address of token on source chain. **/
    fromTokenAddress?: string;
    /** Token address on destination chain. **/
    toTokenAddress?: string;
    apiKey?: string;
  }): CancelablePromise<ActiveRoutesOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/route/active-routes/users",
      headers: {
        "API-KEY": apiKey,
      },
      query: {
        userAddress: userAddress,
        sort: sort,
        offset: offset,
        limit: limit,
        routeStatus: routeStatus,
        fromChainId: fromChainId,
        toChainId: toChainId,
        fromTokenAddress: fromTokenAddress,
        toTokenAddress: toTokenAddress,
      },
    });
  }

  /**
   * @returns NextTxOutputDTO Get next tx details of an active route
   * @throws ApiError
   */
  public static nextTx({
    activeRouteId,
    apiKey,
  }: {
    /** Id of Active Route. **/
    activeRouteId: string;
    apiKey?: string;
  }): CancelablePromise<NextTxOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/route/build-next-tx",
      headers: {
        "API-KEY": apiKey,
      },
      query: {
        activeRouteId: activeRouteId,
      },
    });
  }

  /**
   * @returns RouteStatusOutputDTO Get status of an active route
   * @throws ApiError
   */
  public static getActiveRouteStatus({
    activeRouteId,
    userTxIndex,
    txHash,
    signature,
    apiKey,
  }: {
    /** Id of Active Route. **/
    activeRouteId: string;
    /** Index of the userTxs in the Active Route. Every active route will have a userTxs array. userTxIndex is the index of the object in the userTxs array. **/
    userTxIndex: string;
    /** Transaction hash that relates to the userTxIndex. Each object in the userTxs is a transaction that has to be done by the user to progress in the route. If all the transactions are completed in the route, it will be marked complete. **/
    txHash?: string;
    /** Signature to be sent in case the next transaction is dependant on the signature. **/
    signature?: string;
    apiKey?: string;
  }): CancelablePromise<RouteStatusOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/route/prepare",
      headers: {
        "API-KEY": apiKey,
      },
      query: {
        activeRouteId: activeRouteId,
        userTxIndex: userTxIndex,
        txHash: txHash,
        signature: signature,
      },
    });
  }
}
