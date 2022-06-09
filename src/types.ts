import { BigNumber } from "ethers";
import { Route } from "./client";
import { QuotePreferences } from "./client/models/QuoteRequest";
import { Path } from "./path";

export interface QuoteParams {
  path: Path;
  amount: BigNumber;
  address: string;
}

export interface SocketQuote extends QuoteParams {
  route: Route;
}

export interface SocketOptions {
  apiKey: string;
  statusCheckInterval?: number;
  defaultQuotePreferences?: QuotePreferences;
}
