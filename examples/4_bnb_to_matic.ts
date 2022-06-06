import { runRoute } from "./exampleRunner";

(async () => {
  await runRoute({
    fromAmount: "0.04",
    fromChainId: 56,
    toChainId: 137,
    fromTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    toTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    multiTx: true,
  });
})();
