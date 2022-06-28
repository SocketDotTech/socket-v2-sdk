import type { SupportedBridgesOutputDTO } from "../models/SupportedBridgesOutputDTO";
import type { SupportedChainsOutputDTO } from "../models/SupportedChainsOutputDTO";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import { ChainId } from "@socket.tech/ll-core/constants/types";

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
  public static getAllSupportedChains(): CancelablePromise<SupportedChainsOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/supported/chains",
      headers: {
        "API-KEY": OpenAPI.API_KEY,
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
  }: {
    /** Id of chain, e.g Optimism = 10 **/
    chainId: ChainId;
    /** Contract address of the token **/
    address: string;
  }): CancelablePromise<SupportedChainsOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/supported/token-support",
      headers: {
        "API-KEY": OpenAPI.API_KEY,
      },
      query: {
        chainId,
        address: address,
      },
    });
  }
}
