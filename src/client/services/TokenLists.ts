import type { TokenListOutputDTO } from "../models/TokenListOutputDTO";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import { TokenListRequest } from "../models/TokenListRequest";

export class TokenLists {
  /**
   * @returns TokenListOutputDTO All Supported token by a given chainId
   * @throws ApiError
   */
  public static getFromTokenList({
    fromChainId,
    toChainId,
    disableSwapping,
    includeDexes,
    excludeDexes,
    includeBridges,
    excludeBridges,
    singleTxOnly,
    isShortList,
  }: TokenListRequest): CancelablePromise<TokenListOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/token-lists/from-token-list",
      headers: {
        "API-KEY": OpenAPI.API_KEY,
      },
      query: {
        fromChainId: fromChainId,
        toChainId: toChainId,
        disableSwapping: disableSwapping,
        includeDexes: includeDexes,
        excludeDexes: excludeDexes,
        includeBridges: includeBridges,
        excludeBridges: excludeBridges,
        singleTxOnly: singleTxOnly,
        isShortList: isShortList,
      },
    });
  }

  /**
   * @returns TokenListOutputDTO All Supported token by a given route
   * @throws ApiError
   */
  public static getToTokenList({
    fromChainId,
    toChainId,
    disableSwapping,
    includeDexes,
    excludeDexes,
    includeBridges,
    excludeBridges,
    singleTxOnly,
    isShortList,
  }: TokenListRequest): CancelablePromise<TokenListOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/token-lists/to-token-list",
      headers: {
        "API-KEY": OpenAPI.API_KEY,
      },
      query: {
        fromChainId: fromChainId,
        toChainId: toChainId,
        disableSwapping: disableSwapping,
        includeDexes: includeDexes,
        excludeDexes: excludeDexes,
        includeBridges: includeBridges,
        excludeBridges: excludeBridges,
        singleTxOnly: singleTxOnly,
        isShortList: isShortList,
      },
    });
  }
}
