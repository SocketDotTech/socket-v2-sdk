import type { ApprovalOutputDTO } from "../models/ApprovalOutputDTO";
import type { ApprovalTxOutputDTO } from "../models/ApprovalTxOutputDTO";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class Approvals {
  /**
   * @returns ApprovalOutputDTO Gives approval values of given tokens for a given owner & chainId
   * @throws ApiError
   */
  public static approveControllerFetchApprovals({
    chainId,
    owner,
    allowanceTarget,
    tokenAddress,
    apiKey,
  }: {
    /** ID of chain, e.g Ethereum Mainnet = 1 **/
    chainId: string;
    /** Wallet address of token holder **/
    owner: string;
    /** Address whose spending allowance is to be checked **/
    allowanceTarget: string;
    /** Contract address of token **/
    tokenAddress: string;
    apiKey?: string;
  }): CancelablePromise<ApprovalOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/approval/check-allowance",
      headers: {
        "API-KEY": apiKey,
      },
      query: {
        chainID: chainId,
        owner: owner,
        allowanceTarget: allowanceTarget,
        tokenAddress: tokenAddress,
      },
    });
  }

  /**
   * @returns ApprovalTxOutputDTO Return the Approval Tx Data for the given params.
   * @throws ApiError
   */
  public static approveControllerFetchApprovalsCalldata({
    chainId,
    owner,
    allowanceTarget,
    tokenAddress,
    amount,
    apiKey,
  }: {
    /** ID of chain, e.g Ethereum Mainnet = 1 **/
    chainId: string;
    /** Wallet address of token holder **/
    owner: string;
    /** Address whose spending allowance is to be checked **/
    allowanceTarget: string;
    /** Contract address of token **/
    tokenAddress: string;
    /** Amount of tokens to approve, e.g 10 USDC (6 decimals) **/
    amount: string;
    apiKey?: string;
  }): CancelablePromise<ApprovalTxOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/approval/build-tx",
      headers: {
        "API-KEY": apiKey,
      },
      query: {
        chainID: chainId,
        owner: owner,
        allowanceTarget: allowanceTarget,
        tokenAddress: tokenAddress,
        amount: amount,
      },
    });
  }
}
