import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { CancelTokenStatic } from "axios";
import { ApprovalData, BridgeDetails, Token } from "..";
import { ChainId } from "./ChainId";
import { PrepareActiveRouteStatus } from "./RouteStatusOutputDTO";
import { TxType } from "./TxType";
import { UserTxType } from "./UserTxType";

export type GasFees = {
  asset: CancelTokenStatic;
  gasLimit: number;
  feesInUsd: number;
};

export type Step = {
  type: string;
  protocol: BridgeDetails;
  fromChainId: number;
  fromAsset: Token;
  fromAmount: string;
  toChainId: number;
  toAsset: Token;
  toAmount: string;
  gasFees: GasFees;
  serviceTime: number;
};

export type UserTx = {
  userTxType: UserTxType;
  txType: TxType;
  chainId: ChainId;
  toAmount: string;
  toAsset: Token;
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
