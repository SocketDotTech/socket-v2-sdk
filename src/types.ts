import { BigNumber } from "ethers";
import { Route } from "./client";
import { Path } from "./path";

export interface QuoteParams {
  path: Path;
  amount: BigNumber;
  address: string;
}

export interface SocketQuote extends QuoteParams {
  route: Route;
}
