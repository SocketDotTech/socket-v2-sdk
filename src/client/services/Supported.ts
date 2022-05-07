import type { SupportedBridgesOutputDTO } from "../models/SupportedBridgesOutputDTO";
import type { SupportedChainsOutputDTO } from "../models/SupportedChainsOutputDTO";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class Supported {
  /**
   * @returns SupportedBridgesOutputDTO All Supported Bridges
   * @throws ApiError
   */
  public static getAllBridges(): CancelablePromise<SupportedBridgesOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/supported/bridges",
    });
  }

  /**
   * @returns SupportedChainsOutputDTO All Supported Chains by Movr
   * @throws ApiError
   */
  public static getAllSupportedRoutes({
    apiKey,
  }: {
    apiKey?: string;
  }): CancelablePromise<SupportedChainsOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/supported/chains",
      headers: {
        "API-KEY": apiKey,
      },
    });
  }

  /**
   * @returns SupportedChainsOutputDTO Get if token is supported
   * @throws ApiError
   */
  public static getIfTokenIsSupported({
    chainId,
    address,
    apiKey,
  }: {
    /** Id of chain, e.g Optimism = 10 **/
    chainId: string;
    /** Contract address of the token **/
    address: string;
    apiKey?: string;
  }): CancelablePromise<SupportedChainsOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/supported/token-support",
      headers: {
        "API-KEY": apiKey,
      },
      query: {
        chainId: chainId,
        address: address,
      },
    });
  }
}
