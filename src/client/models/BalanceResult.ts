import { ChainId } from "@socket.tech/ll-core/constants/types";

export type BalanceResult = {
  chainId: ChainId;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  price: number;
  amount: number;
  currency: string;
};
