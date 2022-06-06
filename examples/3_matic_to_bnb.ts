import { runRoute } from "./exampleRunner";

(async () => {
  await runRoute({
    fromAmount: "20",
    fromChainId: 137,
    toChainId: 56,
    fromTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    toTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    multiTx: true,
  });
})();
