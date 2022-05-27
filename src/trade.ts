import { BigNumber } from "ethers";
import { Approvals, Route, Server } from "./client";
import { TxStatus } from "./client/models/TxStatus";
import { Path } from "./path";
import { sleep } from "./utils";

export class Trade {
  userAddress: string;
  path: Path;
  route: Route;
  approvalChecked = false;

  get approvalData() {
    return this.route.userTxs.find((tx) => tx.approvalData)?.approvalData;
  }

  constructor({ userAddress, path, route }: { userAddress: string; path: Path; route: Route }) {
    this.userAddress = userAddress;
    this.path = path;
    this.route = route;
  }

  async approvalRequired() {
    this.approvalChecked = true;
    if (!this.approvalData) return false;

    const allowance = (
      await Approvals.fetchApprovals({
        chainId: this.path.fromToken.chainId,
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

    if (this.userAddress !== this.approvalData.owner) {
      throw new Error("Wrong address");
    }

    const buildApproval = (
      await Approvals.fetchApprovalsCalldata({
        chainId: this.path.fromToken.chainId,
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

    const buildTx = (
      await Server.getSingleTx({
        requestBody: {
          route: this.route,
        },
      })
    ).result;

    return {
      to: buildTx.txTarget,
      data: buildTx.txData,
      value: buildTx.value,
    };
  }

  async getStatus(hash: string) {
    const _getStatus = async () => {
      return (
        await Server.getBridgingStatus({
          transactionHash: hash,
          fromChainId: this.path.fromToken.chainId,
          toChainId: this.path.toToken.chainId,
          bridgeName: this.route.usedBridgeNames[0], // TODO: there should be more to this.
        })
      ).result;
    };

    const status = await _getStatus();

    return {
      ...status,
      async wait() {
        for (;;) {
          const currentStatus = await _getStatus();
          const pending =
            currentStatus.sourceTxStatus === TxStatus.PENDING ||
            currentStatus.destinationTxStatus === TxStatus.PENDING;
          if (pending) {
            await sleep(5000);
          } else {
            return currentStatus;
          }
        }
      },
    };
  }
}
