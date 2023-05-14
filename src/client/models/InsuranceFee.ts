import { Token } from "./Token";

export type InsuranceFee = {
  allowanceTarget: 'string',
  amount: string;
  asset: Token;
  capacity: string;
  deadline: number;
  feesInUsd: number;
  maxCapacityPerTx: string;
  nativeAsset: Token;
  nativeFeeAmount: string;
  nativeFeesInUsd: number
};