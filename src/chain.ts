import { ChainDetails, Supported } from "./client";

export class Chain {
  chainDetails: ChainDetails;

  constructor(details: ChainDetails) {
    this.chainDetails = details;
  }
  static async getSupportedChains() {
    const chains = (await Supported.getAllSupportedRoutes()).result;
    return chains.map((chain) => new Chain(chain));
  }
}
