import { ChainId } from "./ChainId";

export type TokenPriceResponseDTO = {
  success: boolean;
  result: {
    chainId?: ChainId;
    tokenAddress?: string;
    tokenPrice?: number;
    currency?: string;
  };
};
