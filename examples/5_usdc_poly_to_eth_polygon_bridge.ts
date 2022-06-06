import { BridgeName } from "../src/client/models/BridgeDetails";
import { runRoute } from "./exampleRunner";

(async () => {
  await runRoute({
    fromAmount: "1",
    fromChainId: 137,
    toChainId: 1,
    fromTokenAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    toTokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    bridge: BridgeName.POLYGON_BRIDGE,
    multiTx: true,
  });
})();
