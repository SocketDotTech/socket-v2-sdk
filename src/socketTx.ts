import { BigNumber } from "ethers";
import { Approvals, NextTxResponse, Routes } from "./client";
import { PrepareActiveRouteStatus } from "./client/models/RouteStatusOutputDTO";
import { sleep } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SocketTx extends NextTxResponse {}

/**
 * An entity representing the transaction prompted by the socket api
 */
export class SocketTx {
  /**
   * How often in ms to poll for status updates when checking the transaction
   */
  statusCheckInterval: number;
  /**
   * If the approval has been checked
   */
  approvalChecked = false;
  /**
   * If the transaction is done
   */
  done = false;
  /**
   *  Hash associated with this socket transaction step
   */
  hash: string | undefined;

  /**
   * @param nextTx The api object for the next transaction
   * @param statusCheckInterval How often in ms to poll for status updates when checking the transaction
   */
  constructor(nextTx: NextTxResponse, statusCheckInterval = 10000) {
    Object.assign(this, nextTx);
    this.statusCheckInterval = statusCheckInterval;
  }

  /**
   * Whether an approval transaction is required.
   * @returns True if required, otherwise false.
   */
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

  /**
   * Get the apporval transaction data if it is required
   * @returns Apporval data to be sent if required, otherwise null
   */
  async getApproveTransaction() {
    const approvalRequired = await this.approvalRequired();
    if (!approvalRequired) {
      return null;
    }

    if (!this.approvalData) {
      return null;
    }

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

  /**
   * Get the transaction data
   * @returns Send transaction data
   */
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

  /**
   * Get the latest status for the transaction
   * @param hash The hash for this transaction on the network
   * @returns The current status
   */
  private async updateActiveRoute(hash: string) {
    const status = await Routes.updateActiveRoute({
      activeRouteId: this.activeRouteId,
      userTxIndex: this.userTxIndex,
      txHash: hash,
    });

    return status.result;
  }

  /**
   * Submit the hash for this transaction and wait until it is marked as complete
   * @param hash The hash for this transaction on the network
   * @returns Returns the final status "COMPLETED" once the transaction is complete
   */
  async submit(hash: string) {
    if (this.hash) {
      throw new Error(
        `The transaction step ${this.userTxIndex}: ${this.userTxType} has hash already set to ${this.hash}`
      );
    }
    this.hash = hash;
    for (;;) {
      const currentStatus = await this.updateActiveRoute(hash);
      const pending = currentStatus === PrepareActiveRouteStatus.PENDING;
      if (pending) {
        await sleep(this.statusCheckInterval);
      } else {
        this.done = true;
        return currentStatus;
      }
    }
  }
}
