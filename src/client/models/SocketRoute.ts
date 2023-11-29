import { Token } from "./Token";

type FeeData = {
  [time: string]: {
    feesInUsd: number;
    amount: string;
  };
};

export type SocketBridgeFees = {
  asset: Token;
  feeDeductedByMins: FeeData;
};

export type SocketRoute = {
  bridgeFees: SocketBridgeFees;
  bridgeSlippage: string;
  fromAmount: string;
  fromAsset: Token;
  fromChainId: number;
  inputValueInUsd: number;
  isOnlySwapRoute: boolean;
  minAmountOut: string;
  minAmountOutInUsd: number;
  outputValueInUsd: number;
  recipient: string;
  sender: string;
  toAmount: string;
  toAsset: Token;
  toChainId: number;
  fromTokenPriceInUsd: number;
  toTokenPriceInUsd: number;
};