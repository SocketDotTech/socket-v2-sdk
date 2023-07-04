import { Bridge } from "@socket.tech/ll-core";

export import BridgeName = Bridge;

export type BridgeDetails = {
  /**
   * Name of bridge.
   */
  name: BridgeName;
  /**
   * URL for icon of bridge.
   */
  icon?: string;
  /**
   * Approx time for bridging in seconds.
   */
  serviceTime?: number;
  /**
   * Display name of bridge.
   */
  displayName: string;
  /**
   * Security score of bridge.
   */
  securityScore?: number;
};
