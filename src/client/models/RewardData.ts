import { Token } from "./Token";

export type RewardData = {
  amount: string;
  asset: Token;
  amountInUsd: number;
  chainId: number;
};
