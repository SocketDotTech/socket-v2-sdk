import { ChainId } from "./ChainId";

export type TokenBalanceReponseDTO = {
  success: boolean;
  result: {
    chainId?: ChainId;
    tokenAddress?: string;
    userAddress?: string;
    balance?: string;
    decimals?: number;
    icon?: string;
    symbol?: string;
    name?: string;
  };
};
