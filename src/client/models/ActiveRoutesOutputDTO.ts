import type { ActiveRouteResponse } from "./ActiveRouteResponse";

export type ActiveRoutesOutputDTO = {
  /**
   * Status of API response.
   */
  success: boolean;
  result: ActiveRouteResponse;
};
