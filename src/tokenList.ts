import { ChainId } from "@socket.tech/ll-core/constants/types";
import { Token } from ".";
import { NATIVE_TOKEN_ADDRESS } from "./constants";

export class TokenList {
  tokens: Array<Token>;
  chainId: ChainId;

  constructor(chainId: ChainId, tokens: Array<Token>) {
    this.tokens = tokens;
    this.chainId = chainId;
  }

  get nativeToken() {
    const token = this.tokens.find((token) => token.address.toLowerCase() === NATIVE_TOKEN_ADDRESS);
    if (!token) throw new Error("No native token found");
    return token;
  }

  tokenByAddress(address: string) {
    return this.tokens.find((token) => token.address.toLowerCase() === address.toLowerCase());
  }

  tokenBySymbol(symbol: string) {
    return this.tokens.find((token) => token.symbol === symbol);
  }
}
