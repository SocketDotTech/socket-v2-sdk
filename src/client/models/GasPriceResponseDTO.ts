import { ChainId } from "./ChainId";

export type GasPriceResponseDTO = {
  success: boolean;
  result: {
    chainId?: ChainId;
    txType?: number;
    fast?: {
      gasPrice?: number;
      estimatedSeconds?: number;
    };
    normal?: {
      gasPrice?: number;
      estimatedSeconds?: number;
    };
    slow?: {
      gasPrice?: number;
      estimatedSeconds?: number;
    };
  };
};
