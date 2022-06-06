import type { ActiveRouteResponse } from "./ActiveRouteResponse";

export type ActiveRoutesOutputDTO = {
  /**
   * Status of API response.
   */
  success: boolean;
  result: {
    activeRoutes: Array<ActiveRouteResponse>;
    pagination: { offset: number; limit: number; totalRecords: number };
  };
};
