import type { TokenListOutputDTO } from "../models/TokenListOutputDTO";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

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
  }: {
    /** Id of source chain, e.g Optimism = 10 **/
    fromChainId: number;
    /** Id of destination chain, e.g xDAI = 100 **/
    toChainId: number;
    /** Flag to specify if tokens that need dex swap should be ignored. **/
    disableSwapping?: boolean;
    /** Specify Dexes that should be included for token support. **/
    includeDexes?: Array<"oneinch" | "zerox">;
    /** Specify Dexes that should be excluded for token support.
     * This option will be ignored if includeDexes is specified. **/
    excludeDexes?: Array<"oneinch" | "zerox">;
    /** Specify Bridges that should be included for token support. **/
    includeBridges?: Array<
      | "polygon-bridge"
      | "hop"
      | "anyswap-router-v4"
      | "hyphen"
      | "arbitrum-bridge"
      | "connext"
      | "celer"
    >;
    /** Specify Bridges that should be excluded for token support.
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
    /** To be Marked true if you want the token list that needs only a single transaction from the user to bridge. **/
    singleTxOnly?: boolean;
    /** To be Marked true if you want the shorter and more efficient token list. **/
    isShortList?: boolean;
  }): CancelablePromise<TokenListOutputDTO> {
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
  }: {
    /** Id of source chain, e.g Optimism = 10 **/
    fromChainId: number;
    /** Id of destination chain, e.g xDAI = 100 **/
    toChainId: number;
    /** Flag to specify if tokens that need dex swap should be ignored.
     * This option will be ignored if singleTxOnly is marked true. **/
    disableSwapping?: boolean;
    /** Specify Dexes that should be included for token support. **/
    includeDexes?: Array<"oneinch" | "zerox">;
    /** Specify Dexes that should be excluded for token support.
     * This option will be ignored if includeDexes is specified. **/
    excludeDexes?: Array<"oneinch" | "zerox">;
    /** Specify Bridges that should be included for token support. **/
    includeBridges?: Array<
      | "polygon-bridge"
      | "hop"
      | "anyswap-router-v4"
      | "hyphen"
      | "arbitrum-bridge"
      | "connext"
      | "celer"
    >;
    /** Specify Bridges that should be excluded for token support.
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
    /** To be Marked true if you want the token list that needs only a single transaction from the user to bridge. **/
    singleTxOnly?: boolean;
    /** To be Marked true if you want the shorter and more efficient token list. **/
    isShortList?: boolean;
  }): CancelablePromise<TokenListOutputDTO> {
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
