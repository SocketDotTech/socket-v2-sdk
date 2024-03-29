import { BridgeInsuranceData } from "./BridgeInsuranceData";
import type { RefuelData } from "./RefuelData";
import type { Route } from "./Route";

export type SingleTxDTO = {
  route: Route;
  refuel?: RefuelData;
  bridgeInsuranceData?: BridgeInsuranceData;
};
