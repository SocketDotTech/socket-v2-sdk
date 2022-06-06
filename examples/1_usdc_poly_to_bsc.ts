import { runRoute } from "./exampleRunner";

(async () => {
  await runRoute({
    fromAmount: "15",
    fromChainId: 137,
    toChainId: 56,
    fromTokenAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    toTokenAddress: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
  });
})();
