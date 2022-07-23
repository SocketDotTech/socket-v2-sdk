import { Path } from "./path";
describe("Path", () => {
  it("assigns from and to correctly", async () => {
    const fromToken = { address: "0x0", chainId: 1, symbol: "A" };
    const toToken = { address: "0x1", chainId: 2, symbol: "B" };
    const path = new Path({ fromToken, toToken });

    expect(path.fromToken).toBe(fromToken);
    expect(path.toToken).toBe(toToken);
  });

  it("throws when fromToken undefined", async () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new Path({ fromToken: { address: "0x0", chainId: 1, symbol: "A" }, toToken: undefined });
    }).toThrow();
  });

  it("throws when toToken undefined", async () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new Path({ fromToken: undefined, toToken: { address: "0x0", chainId: 1, symbol: "A" } });
    }).toThrow();
  });
});
