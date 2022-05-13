import type { TokenAsset } from "./TokenAsset";
import { UserTx } from "./UserTx";

export type ActiveRouteResponse = {
  /**
   * Id of the Active Route.
   */
  activeRouteId: number;
  /**
   * Address of user doing the Active Route.
   */
  userAddress: string;
  /**
   * Total number of txs required in Active Route.
   */
  totalUserTx: number;
  /**
   * Array of user txs.
   */
  userTxs: Array<UserTx>;
  /**
   * Id of source chain.
   */
  fromChainId: number;
  /**
   * Id of destination chain.
   */
  toChainId: number;
  /**
   * Address of token on source chain.
   */
  fromAssetAddress: string;
  /**
   * Address of token on destination chain.
   */
  toAssetAddress: string;
  /**
   * Amount of sending tokens.
   */
  fromAmount: string;
  /**
   * Approximate amount of receiving tokens.
   */
  toAmount: string;
  /**
   * Status of the Active Route.
   */
  routeStatus: string;
  /**
   * Timestamp of Route start.
   */
  createdAt: string;
  /**
   * Timestamp of last route update.
   */
  updatedAt: string;
  /**
   * Index of current tx in userTxs array.
   */
  currentUserTxIndex: number;
  fromAsset: TokenAsset;
  toAsset: TokenAsset;
};
