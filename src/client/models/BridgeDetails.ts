export type BridgeDetails = {
  /**
   * Name of bridge.
   */
  bridgeName: BridgeName;
  /**
   * URL for icon of bridge.
   */
  icon?: string;
  /**
   * Approx time for bridging in seconds.
   */
  serviceTime: number;
  /**
   * Display name of bridge.
   */
  displayName: string;
};

/**
 * Name of bridge.
 */
export enum BridgeName {
  POLYGON_BRIDGE = "polygon-bridge",
  HOP = "hop",
  ANYSWAP_ROUTER_V4 = "anyswap-router-v4",
  HYPHEN = "hyphen",
  ARBITRUM_BRIDGE = "arbitrum-bridge",
  CONNEXT = "connext",
  CELER = "celer",
}
