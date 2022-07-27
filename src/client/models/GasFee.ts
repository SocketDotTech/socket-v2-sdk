import { Token } from "..";

export type GasFee = {
  /** Gas token details. */
  asset: Token;
  /** Approx Gas Limit of the transaction. */
  gasLimit: number;
  /** USD value of gas fees at current gas price. */
  feesInUsd: number;
  /** Estimated Amount of gas token will be used */
  gasAmount: string;
};
