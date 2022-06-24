import { NATIVE_TOKEN_ADDRESS } from "../src/constants";
import { runRoute } from "./exampleRunner";

(async () => {
  await runRoute({
    fromAmount: "0.04",
    fromChainId: 56,
    toChainId: 137,
    fromTokenAddress: NATIVE_TOKEN_ADDRESS,
    toTokenAddress: NATIVE_TOKEN_ADDRESS,
    multiTx: true,
  });
})();
