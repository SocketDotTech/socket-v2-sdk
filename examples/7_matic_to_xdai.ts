import { NATIVE_TOKEN_ADDRESS } from "../src/constants";
import { runRoute } from "./exampleRunner";

(async () => {
  await runRoute({
    fromAmount: "5",
    fromChainId: 137,
    toChainId: 100,
    fromTokenAddress: NATIVE_TOKEN_ADDRESS,
    toTokenAddress: NATIVE_TOKEN_ADDRESS,
  });
})();
