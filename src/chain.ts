import { ChainDetails, Token } from ".";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Chain extends ChainDetails {}

/**
 * The chain object represents a supported chain
 */
export class Chain {
  constructor(chainDetails: ChainDetails) {
    Object.assign(this, chainDetails);
  }

  /**
   * The native token of the chain
   */
  get nativeToken(): Token {
    return {
      ...this.currency,
      chainId: this.chainId,
    };
  }
}
