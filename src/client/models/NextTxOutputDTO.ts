import type { NextTxResponse } from "./NextTxResponse";

export type NextTxOutputDTO = {
  /**
   * Status of API.
   */
  status: boolean;
  result: NextTxResponse;
};
