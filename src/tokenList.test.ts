import { TokenList } from ".";
import MOCK_TOKEN_LIST from "./mocks/mockTokenList.json";

describe("Token List", () => {
  let tokenList: TokenList;

  beforeEach(() => {
    tokenList = new TokenList(100, MOCK_TOKEN_LIST);
  });

  it("created chain id", () => {
    expect(tokenList.chainId).toBe(100);
    expect(tokenList.nativeToken.chainId).toBe(100);
  });

  it("native token", () => {
    expect(tokenList.nativeToken.chainId).toBe(100);
    expect(tokenList.nativeToken.address).toBe("0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    expect(tokenList.nativeToken.symbol).toBe("XDAI");
  });

  it("tokenByAddress", () => {
    const usdc = tokenList.tokenByAddress("0xddafbb505ad214d7b80b1f830fccc89b60fb7a83");
    expect(usdc?.address).toBe("0xddafbb505ad214d7b80b1f830fccc89b60fb7a83");
    expect(usdc?.chainId).toBe(100);
    expect(usdc?.symbol).toBe("USDC");
  });
});
