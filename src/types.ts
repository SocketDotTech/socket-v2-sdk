import { Route } from "./client";
import { BridgeRouteErrors } from "./client/models/BridgeRouteErrors";
import { QuotePreferences } from "./client/models/QuoteRequest";
import { RefuelData } from "./client/models/RefuelData";
import { Path } from "./path";

/**
 * The parameters for a quote request
 */
export interface QuoteParams {
  /**  The path desired */
  path: Path;
  /** Amount of the quote */
  amount: string;
  /** User address */
  address: string;
}

/**
 * Quote parameters and the retrieved route
 */
export interface SocketQuote extends QuoteParams {
  /** The route retrieved for the quote */
  route: Route;
  /** Refuel Data */
  refuel?: RefuelData;
  /** Errors */
  errors: BridgeRouteErrors;
}

/** Sdk options */
export interface SocketOptions {
  /**  The socket api key */
  apiKey: string;
  /** How often in ms to poll for status updates when checking transactions */
  statusCheckInterval?: number;
  /** The preferences used when retrieving quotes from the api */
  defaultQuotePreferences?: QuotePreferences;
}
