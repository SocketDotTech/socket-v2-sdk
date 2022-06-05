import type { ActiveRoutesOutputDTO } from "../models/ActiveRoutesOutputDTO";
import type { NextTxOutputDTO } from "../models/NextTxOutputDTO";
import type { RouteStatusOutputDTO } from "../models/RouteStatusOutputDTO";
import type { StartActiveRouteInputDTO } from "../models/StartActiveRouteInputDTO";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import { ActiveRoutesRequest } from "../models/ActiveRoutesRequest";
import { ActiveRouteOutputDTO } from "../models/ActiveRouteOutputDTO";

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
    startRequest,
  }: {
    startRequest: StartActiveRouteInputDTO;
  }): CancelablePromise<NextTxOutputDTO> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v2/route/start",
      headers: {
        "API-KEY": OpenAPI.API_KEY,
      },
      body: startRequest,
      mediaType: "application/json",
    });
  }

  /**
   * @returns ActiveRouteDTO Get active route details using active route id
   * @throws ApiError
   */
  public static getActiveRoute({
    activeRouteId,
  }: {
    /** Id of the Active Route. **/
    activeRouteId: number;
  }): CancelablePromise<ActiveRouteOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/route/active-routes",
      headers: {
        "API-KEY": OpenAPI.API_KEY,
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
  public static getActiveRoutesForUser(
    request: ActiveRoutesRequest
  ): CancelablePromise<ActiveRoutesOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/route/active-routes/users",
      headers: {
        "API-KEY": OpenAPI.API_KEY,
      },
      query: request,
    });
  }

  /**
   * @returns NextTxOutputDTO Get next tx details of an active route
   * @throws ApiError
   */
  public static nextTx({
    activeRouteId,
  }: {
    /** Id of Active Route. **/
    activeRouteId: number;
  }): CancelablePromise<NextTxOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/route/build-next-tx",
      headers: {
        "API-KEY": OpenAPI.API_KEY,
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
  }: {
    /** Id of Active Route. **/
    activeRouteId: number;
    /** Index of the userTxs in the Active Route. Every active route will have a userTxs array. userTxIndex is the index of the object in the userTxs array. **/
    userTxIndex: number;
    /** Transaction hash that relates to the userTxIndex. Each object in the userTxs is a transaction that has to be done by the user to progress in the route. If all the transactions are completed in the route, it will be marked complete. **/
    txHash?: string;
    /** Signature to be sent in case the next transaction is dependant on the signature. **/
    signature?: string;
  }): CancelablePromise<RouteStatusOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/route/prepare",
      headers: {
        "API-KEY": OpenAPI.API_KEY,
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
