import { BigNumber } from "ethers";
import { Approvals, NextTxResponse, Routes } from "./client";
import { PrepareActiveRouteStatus } from "./client/models/RouteStatusOutputDTO";
import { sleep } from "./utils";

const STATUS_CHECK_INTERVAL = 10000;

export interface SocketTx extends NextTxResponse {}

export class SocketTx {
  approvalChecked = false;

  constructor(nextTx: NextTxResponse) {
    Object.assign(this, nextTx);
  }

  async approvalRequired() {
    this.approvalChecked = true;
    if (!this.approvalData) return false;

    const allowance = (
      await Approvals.fetchApprovals({
        chainId: this.chainId,
        owner: this.approvalData?.owner,
        allowanceTarget: this.approvalData?.allowanceTarget,
        tokenAddress: this.approvalData?.approvalTokenAddress,
      })
    ).result;

    const allowanceValue = BigNumber.from(allowance.value);
    const minimumApprovalAmount = BigNumber.from(this.approvalData.minimumApprovalAmount);
    return allowanceValue.lt(minimumApprovalAmount);
  }

  async getApproveTransaction() {
    const approvalRequired = await this.approvalRequired();
    if (!approvalRequired) {
      return null;
    }

    if (!this.approvalData) {
      return null;
    }

    // TODO: User check
    // if (this.userAddress !== this.approvalData.owner) {
    //   throw new Error("Wrong address");
    // }

    const buildApproval = (
      await Approvals.fetchApprovalsCalldata({
        chainId: this.chainId,
        allowanceTarget: this.approvalData.allowanceTarget,
        amount: this.approvalData.minimumApprovalAmount,
        owner: this.approvalData.owner,
        tokenAddress: this.approvalData.approvalTokenAddress,
      })
    ).result;

    return buildApproval;
  }

  async getSendTransaction() {
    if (!this.approvalChecked) {
      throw new Error(
        "Approval not checked. Check `getApproveTransaction` before attempting to send."
      );
    }

    return {
      to: this.txTarget,
      data: this.txData,
      value: this.value,
    };
  }

  async updateActiveRoute(hash: string) {
    const status = await Routes.updateActiveRoute({
      activeRouteId: this.activeRouteId,
      userTxIndex: this.userTxIndex,
      txHash: hash,
    });

    return status.result;
  }

  async done(hash: string) {
    for (;;) {
      const currentStatus = await this.updateActiveRoute(hash);
      const pending = currentStatus === PrepareActiveRouteStatus.PENDING;
      if (pending) {
        await sleep(STATUS_CHECK_INTERVAL);
      } else {
        return currentStatus;
      }
    }
  }
}
