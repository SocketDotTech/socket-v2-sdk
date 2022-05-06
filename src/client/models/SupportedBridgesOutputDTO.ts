import type { BridgeDetails } from "./BridgeDetails";

export type SupportedBridgesOutputDTO = {
  /**
   * Status of API.
   */
  success: boolean;
  result: Array<BridgeDetails>;
};
