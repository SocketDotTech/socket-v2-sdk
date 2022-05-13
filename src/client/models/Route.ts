import type { ChainGasBalances } from "./ChainGasBalances";
import type { MinGasBalances } from "./MinGasBalances";
import { UserTx } from "./UserTx";

export type Route = {
  /**
   * Unique id for each route.
   */
  routeId: string;
  /**
   * Sending token amount.
   */
  fromAmount: string;
  chainGasBalances: ChainGasBalances;
  minimumGasBalances: MinGasBalances;
  /**
   * Approximate receiving token amount.
   */
  toAmount: string;
  /**
   * Array of bridges used in the route
   */
  usedBridgeNames: Array<
    | "polygon-bridge"
    | "hop"
    | "anyswap-router-v4"
    | "hyphen"
    | "arbitrum-bridge"
    | "connext"
    | "celer"
  >;
  /**
   * Total number of transactions for the route.
   */
  totalUserTx: number;
  /**
   * Combined USD gas fees for all transactions in the route.
   */
  totalGasFeesInUsd: number;
  /**
   * Address of user receiving the amount.
   */
  recipient: string;
  /**
   * Address of user making the transactions.
   */
  sender: string;
  /**
   * Array of user transactions.
   */
  userTxs: Array<UserTx>;
  /**
   * Estimate of total time in seconds, excluding the transaction time.
   */
  serviceTime: number;
};
