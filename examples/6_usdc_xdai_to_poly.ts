import { runRoute } from "./exampleRunner";

(async () => {
  await runRoute({
    fromAmount: "12",
    fromChainId: 100,
    toChainId: 137,
    fromTokenAddress: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
    toTokenAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  });
})();
