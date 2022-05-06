import type { ChainDetails } from "./ChainDetails";

export type SupportedChainsOutputDTO = {
  /**
   * Status of API.
   */
  success: boolean;
  result: Array<ChainDetails>;
};
