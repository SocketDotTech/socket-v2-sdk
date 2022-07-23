import { SocketPreferences } from "./SocketPreferences";

export interface TokenListRequest extends SocketPreferences {
  /** Id of source chain, e.g Optimism = 10 **/
  fromChainId: number;
  /** Id of destination chain, e.g xDAI = 100 **/
  toChainId: number;
  /** To be Marked true if you want the shorter and more efficient token list. **/
  isShortList?: boolean;
}
