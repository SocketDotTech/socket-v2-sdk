import { Token } from ".";
import { NATIVE_TOKEN_ADDRESS } from "./constants";

export class TokenList extends Array<Token> {
  chainId: number;

  constructor(chainId: number, items: Array<Token>) {
    super(...items);
    this.chainId = chainId;
  }

  tokenByAddress(address: string) {
    return this.find((token) => token.address.toLowerCase() === address.toLowerCase());
  }

  tokenBySymbol(symbol: string) {
    return this.find((token) => token.symbol === symbol);
  }

  nativeToken() {
    return this.find((token) => token.address.toLowerCase() === NATIVE_TOKEN_ADDRESS);
  }
}
