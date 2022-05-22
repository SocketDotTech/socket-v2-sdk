import BigNumber from "bignumber.js";
import { ChainDetails, TokenLists, TokenAsset, Quote, Route, Approvals, Server } from "./client";

import { Supported } from "./client";

import * as ethers from "ethers";

export class Chain {
  chainDetails: ChainDetails;

  constructor(details: ChainDetails) {
    this.chainDetails = details;
  }
  static async getSupportedChains() {
    const chains = (await Supported.getAllSupportedRoutes()).result;
    return chains.map((chain) => new Chain(chain));
  }
}

export class TokenList {
  static async getTokenList(fromChainId: number, toChainId: number) {
    const fromTokenList = await TokenLists.getFromTokenList({
      fromChainId,
      toChainId,
      isShortList: true,
    });
    const toTokenList = await TokenLists.getToTokenList({
      fromChainId,
      toChainId,
      isShortList: true,
    });

    return {
      from: fromTokenList.result,
      to: toTokenList.result,
    };
  }
}

export class Path {
  fromChain: Chain;
  toChain: Chain;
  fromToken: TokenAsset;
  toToken: TokenAsset;
  constructor(fromChain: Chain, toChain: Chain, fromToken: TokenAsset, toToken: TokenAsset) {
    this.fromChain = fromChain;
    this.toChain = toChain;
    this.fromToken = fromToken;
    this.toToken = toToken;
  }
}

export class Quotes {
  static async getQuotes(path: Path, amount: BigNumber, address: string) {
    return (
      await Quote.getQuote({
        fromChainId: path.fromToken.chainId,
        toChainId: path.toToken.chainId,
        fromTokenAddress: path.fromToken.address,
        toTokenAddress: path.toToken.address,
        fromAmount: amount.toFixed(),
        userAddress: address,
        sort: "gas",
        uniqueRoutesPerBridge: true,
      })
    ).result;
  }
}

export class Trade {
  userAddress: string;
  path: Path;
  route: Route;
  signer: ethers.Signer | undefined;

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

  connect(signer: ethers.Signer) {
    this.signer = signer;
  }

  async approve() {
    if (!this.signer) {
      throw new Error("Signer required to approve.");
    }
    if (!this.approvalData) {
      throw new Error("Trade does not require approval.");
    }
    const userAddress = await this.signer.getAddress();
    if (userAddress !== this.approvalData.owner) {
      throw new Error("Wrong address signer");
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

    const rpc = this.path.fromChain.chainDetails.rpcs[0];
    const provider = new ethers.providers.JsonRpcProvider(
      rpc,
      this.path.fromChain.chainDetails.chainId
    );

    return this.signer.connect(provider).sendTransaction({
      ...buildApproval,
    });
  }

  async send() {
    if (!this.signer) {
      throw new Error("Signer required to send.");
    }

    const buildTx = (
      await Server.getSingleTx({
        requestBody: {
          route: this.route,
        },
      })
    ).result;

    const rpc = this.path.fromChain.chainDetails.rpcs[0];
    const provider = new ethers.providers.JsonRpcProvider(
      rpc,
      this.path.fromChain.chainDetails.chainId
    );
    return this.signer.connect(provider).sendTransaction({
      to: buildTx.txTarget,
      data: buildTx.txData,
      value: buildTx.value,
    });
  }

  async getStatus(hash: string) {
    return (
      await Server.getBridgingStatus({
        transactionHash: hash,
        fromChainId: this.path.fromChain.chainDetails.chainId,
        toChainId: this.path.toChain.chainDetails.chainId,
        bridgeName: this.route.userTxs[0].steps[0].protocol.bridgeName, // TODO: there should be more to this.
      })
    ).result;
  }
}

export * as client from "./client";
