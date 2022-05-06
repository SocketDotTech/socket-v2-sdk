export type TokenBalanceReponseDTO = {
  success: boolean;
  result: {
    chainId?: number;
    tokenAddress?: string;
    userAddress?: string;
    balance?: string;
    decimals?: number;
    icon?: string;
    symbol?: string;
    name?: string;
  };
};
