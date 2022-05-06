import type { SingleTxResponse } from "./SingleTxResponse";

export type SingleTxOutputDTO = {
  /**
   * Status of API.
   */
  status: boolean;
  result: SingleTxResponse;
};
