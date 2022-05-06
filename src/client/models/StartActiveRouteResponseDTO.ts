import type { ApprovalData } from "./ApprovalData";
import { ChainId } from "./ChainId";
import { TxType } from "./TxType";
import { UserTxType } from "./UserTxType";

export type StartActiveRouteResponseDTO = {
  userTxType?: UserTxType;
  txTarget?: string;
  chainId?: ChainId;
  activeRouteId: number;
  txData?: string;
  txType?: TxType;
  value?: string;
  userTxIndex?: number;
  totalUserTx: number;
  approvalData?: ApprovalData;
};
