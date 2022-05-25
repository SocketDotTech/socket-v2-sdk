import { Approvals, Route, Server } from "./client";
import { TxStatus } from "./client/models/TxStatus";
import { Path } from "./path";
import { sleep } from "./utils";

export class Trade {
  userAddress: string;
  path: Path;
  route: Route;

  get approvalData() {
    return this.route.userTxs.find((tx) => tx.approvalData)?.approvalData;
  }

  get approvalRequired() {
    return !!this.approvalData;
  }

  constructor(userAddress: string, path: Path, route: Route) {
    this.userAddress = userAddress;
    this.path = path;
    this.route = route;
  }

  async getApproveTransaction() {
    if (!this.approvalData) {
      throw new Error("Trade does not require approval.");
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
        tokenAddress: this.path.fromToken.address,
      })
    ).result;

    return buildApproval;
  }

  async getSendTransaction() {
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
          fromChainId: this.path.fromChain.chainDetails.chainId,
          toChainId: this.path.toChain.chainDetails.chainId,
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
