import { ChainId } from "@socket.tech/ll-core";
import { Token } from ".";
import { NATIVE_TOKEN_ADDRESS } from "./constants";

/**
 * The TokenList represents a list of tokens for a given chain
 */
export class TokenList {
  tokens: Array<Token>;
  chainId: ChainId;

  constructor(chainId: ChainId, tokens: Array<Token>) {
    this.tokens = tokens;
    this.chainId = chainId;
  }

  /**
   * The native token of the chain
   */
  get nativeToken() {
    const token = this.tokens.find((token) => token.address.toLowerCase() === NATIVE_TOKEN_ADDRESS);
    if (!token) throw new Error("No native token found");
    return token;
  }

  /**
   * Retrieve token by its address
   * @param address token address
   * @returns token object
   */
  tokenByAddress(address: string) {
    return this.tokens.find((token) => token.address.toLowerCase() === address.toLowerCase());
  }

  /**
   * Retrieve token by its symbol
   * @param symbol symbol. Example: USDC
   * @returns token object
   */
  tokenBySymbol(symbol: string) {
    return this.tokens.find((token) => token.symbol === symbol);
  }
}
