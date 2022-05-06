import type { BridgeStatusResponse } from "./BridgeStatusResponse";

export type BridgeStatusResponseDTO = {
  /**
   * Status of API.
   */
  success: boolean;
  result: BridgeStatusResponse;
};
