import type { BalanceResult } from "./BalanceResult";

export type Balance = {
  success: boolean;
  result: Array<BalanceResult>;
};
