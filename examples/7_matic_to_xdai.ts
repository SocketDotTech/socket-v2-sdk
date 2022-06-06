import { runRoute } from "./exampleRunner";

(async () => {
  await runRoute({
    fromAmount: "5",
    fromChainId: 137,
    toChainId: 100,
    fromTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    toTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  });
})();
