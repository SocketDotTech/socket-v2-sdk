import { Token } from "./Token";

export type InsuranceFee = {
  amount: string;
  capacity: string;
  asset: Token;
  feesInUsd: number;
};
