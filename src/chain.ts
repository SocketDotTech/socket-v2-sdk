import { ChainDetails, Token } from ".";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Chain extends ChainDetails {}

export class Chain {
  constructor(chainDetails: ChainDetails) {
    Object.assign(this, chainDetails);
  }

  get nativeToken(): Token {
    return {
      ...this.currency,
      chainId: this.chainId,
    };
  }
}
