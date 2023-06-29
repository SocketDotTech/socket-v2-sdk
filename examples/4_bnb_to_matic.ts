import { NATIVE_TOKEN_ADDRESS } from "../src/constants";
import { runRoute } from "./exampleRunner";

(async () => {
  await runRoute({
    fromAmount: "10",
    fromChainId: 1,
    toChainId: 1313161554,
    fromTokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    toTokenAddress: NATIVE_TOKEN_ADDRESS,
    multiTx: true,
    feeTakerAddress: "0xF75aAa99e6877fA62375C37c343c51606488cd08",
    feePercent: "5",
    bridgeWithGas: true,
  });
})();
