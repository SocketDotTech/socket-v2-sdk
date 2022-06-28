import type { Balance } from "../models/Balance";
import type { TokenBalanceReponseDTO } from "../models/TokenBalanceReponseDTO";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import { ChainId } from "../models/ChainId";

export class Balances {
  /**
   * @returns Balance Returns the balance of all tokens for a user address on all supported chains
   * @throws ApiError
   */
  public static getBalances({ userAddress }: { userAddress: string }): CancelablePromise<Balance> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/balances",
      headers: {
        "API-KEY": OpenAPI.API_KEY,
      },
      query: {
        userAddress: userAddress,
      },
    });
  }

  /**
   * @returns TokenBalanceReponseDTO Returns the balance of the token on any given chain
   * @throws ApiError
   */
  public static getBalance({
    tokenAddress,
    chainId,
    userAddress,
  }: {
    /** Token contract address on network, e.g USDC on Ethereum Mainnet **/
    tokenAddress: string;
    /** ID of chain, e.g Ethereum Mainnet = 1 **/
    chainId: ChainId;
    /** Address of the user **/
    userAddress: string;
  }): CancelablePromise<TokenBalanceReponseDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/balances/token-balance",
      query: {
        tokenAddress: tokenAddress,
        chainId: chainId,
        userAddress: userAddress,
      },
    });
  }
}
