export type ApprovalTxOutputDTO = {
  success: boolean;
  result: {
    data?: string;
    to?: string;
    from?: string;
  };
};
