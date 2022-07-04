import { Chain } from "./chain";
import MOCK_CHAIN_DETAILS from "./mocks/mockChainDetails.json";

describe("Chain", () => {
  it("can get native token", async () => {
    const chain = new Chain(MOCK_CHAIN_DETAILS);
    expect(chain.chainId).toBe(100);
    const nativeToken = chain.nativeToken;
    expect(nativeToken.chainId).toBe(100);
    expect(nativeToken.address).toBe("0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    expect(nativeToken.symbol).toBe("XDAI");
    expect(nativeToken.decimals).toBe(18);
  });
});
