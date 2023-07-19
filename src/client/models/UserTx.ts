import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { ApprovalData, BridgeDetails, Token } from "..";
import { ChainId } from "./ChainId";
import { GasFee } from "./GasFee";
import { InsuranceFee } from "./InsuranceFee";
import { PrepareActiveRouteStatus } from "./RouteStatusOutputDTO";
import { TxType } from "./TxType";
import { UserTxType } from "./UserTxType";
import { ExtraData } from "./ExtraData";

export type Step = {
  type: string;
  protocol: BridgeDetails;
  fromChainId: number;
  fromAsset: Token;
  fromAmount: string;
  toChainId: number;
  toAsset: Token;
  toAmount: string;
  gasFees: GasFee;
  serviceTime: number;
  maxServiceTime: number;
  protocolFees: {
    amount: string;
    feesInUsd: number;
    asset: Token;
  };
  bridgeSlippage?: number;
  swapSlippage?: number;
  insuranceFee?: InsuranceFee
  minAmountOut?: string;
  extraData?: ExtraData
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
  gasFees: GasFee;
  serviceTime: number;
  maxServiceTime: number;
  recipient: string;
  userTxIndex: number;
  userTxStatus?: PrepareActiveRouteStatus;
  sourceTransactionHash?: string;
  sourceTransactionReceipt?: TransactionReceipt;
  destinationTxHash?: string;
  destinationTxReceipt?: TransactionReceipt;
  bridgeSlippage?: number;
  swapSlippage?: number;
  protocol?: {
    name: string;
    displayName: string;
    icon: string;
  }
};
