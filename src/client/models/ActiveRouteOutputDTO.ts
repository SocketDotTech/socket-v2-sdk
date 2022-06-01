import type { ActiveRouteResponse } from "./ActiveRouteResponse";

export type ActiveRouteOutputDTO = {
  /**
   * Status of API response.
   */
  success: boolean;
  result: ActiveRouteResponse;
};
