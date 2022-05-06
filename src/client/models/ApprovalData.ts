export type ApprovalData = {
  /**
   * Minimum amount of approval needed.
   */
  minimumApprovalAmount: string;
  /**
   * Address of token for which approval is required.
   */
  approvalTokenAddress: string;
  /**
   * Contract address that needs approval.
   */
  allowanceTarget: string;
  /**
   * Address of owner.
   */
  owner: string;
};
