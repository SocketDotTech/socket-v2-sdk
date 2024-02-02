import { OpRebateData } from "./OpRebateData";
import { RewardData } from "./RewardData";

export type ExtraData = {
  /**
   * @deprecated socket no longer uses opRebateData
   */
  opRebateData?: OpRebateData;
  rewards?: RewardData[];
};
