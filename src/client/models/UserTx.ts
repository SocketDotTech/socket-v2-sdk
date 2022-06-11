import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { ApprovalData, BridgeDetails, TokenAsset } from "..";
import { PrepareActiveRouteStatus } from "./RouteStatusOutputDTO";
import { TxType } from "./TxType";
import { UserTxType } from "./UserTxType";

export type GasFees = {
  asset: TokenAsset;
  gasLimit: number;
  feesInUsd: number;
};

export type Step = {
  type: string;
  protocol: BridgeDetails;
  fromChainId: number;
  fromAsset: TokenAsset;
  fromAmount: string;
  toChainId: number;
  toAsset: TokenAsset;
  toAmount: string;
  gasFees: GasFees;
  serviceTime: number;
};

export type UserTx = {
  userTxType: UserTxType;
  txType: TxType;
  chainId: number;
  toAmount: string;
  toAsset: TokenAsset;
  stepCount: number;
  routePath: string;
  sender: string;
  approvalData?: ApprovalData;
  steps: Step[];
  gasFees: GasFees;
  serviceTime: number;
  recipient: string;
  userTxIndex: number;
  userTxStatus?: PrepareActiveRouteStatus;
  sourceTransactionHash?: string;
  sourceTransactionReceipt?: TransactionReceipt;
  destinationTxHash?: string;
  destinationTxReceipt?: TransactionReceipt;
};
