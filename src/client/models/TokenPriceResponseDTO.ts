export type TokenPriceResponseDTO = {
  success: boolean;
  result: {
    chainId?: number;
    tokenAddress?: string;
    tokenPrice?: number;
    currency?: string;
  };
};
