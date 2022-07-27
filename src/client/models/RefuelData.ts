import { Token } from "..";
import { GasFee } from "./GasFee";

export interface RefuelData {
  fromAmount: string;
  toAmount: string;
  gasFees: GasFee;
  recipient: string;
  serviceTime: number;
  fromAsset: Token;
  toAsset: Token;
  fromChainId: number;
  toChainId: number;
}
