import type { QuoteOutputDTO } from "../models/QuoteOutputDTO";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import { QuoteRequest } from "../models/QuoteRequest";

export class Quote {
  /**
   * @returns QuoteOutputDTO Returns all the possible routes for bridging tokens from one chain to another. One of the routes can be selected and passed in to start the route.
   * @throws ApiError
   */
  public static getQuote(quoteRequest: QuoteRequest): CancelablePromise<QuoteOutputDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v2/quote",
      headers: {
        "API-KEY": OpenAPI.API_KEY,
      },
      query: quoteRequest,
    });
  }
}
