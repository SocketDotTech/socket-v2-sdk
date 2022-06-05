import { BigNumber } from "ethers";
import { ActiveRouteResponse, Route } from "./client";
import { Path } from "./path";

export interface QuoteParams {
  path: Path;
  amount: BigNumber;
  address: string;
}

export interface SocketQuote extends QuoteParams {
  route: Route;
}

export interface SocketActiveQuote extends QuoteParams {
  route: ActiveRouteResponse;
}
