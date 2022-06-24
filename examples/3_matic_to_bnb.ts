import { NATIVE_TOKEN_ADDRESS } from "../src/constants";
import { runRoute } from "./exampleRunner";

(async () => {
  await runRoute({
    fromAmount: "20",
    fromChainId: 137,
    toChainId: 56,
    fromTokenAddress: NATIVE_TOKEN_ADDRESS,
    toTokenAddress: NATIVE_TOKEN_ADDRESS,
    multiTx: true,
  });
})();
