import type { Web3Provider } from "@ethersproject/providers";
import { ChainId } from "@socket.tech/ll-core/constants/types";
import { ethers } from "ethers";
import { SocketOptions, SocketQuote } from "./types";
import { SocketTx } from ".";
import { ActiveRouteGenerator, BaseSocket } from "./baseSocket";

export interface AddEthereumChainParameters {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

/** Callback when a socket transaction is complete. */
export type SocketTxDoneCallback = (tx: SocketTx) => void;
/** Callback when a transaction for send/approval has completed.  */
export type TxDoneCallback = (tx: SocketTx, hash: string) => void;
/** Callback when chain switch has completed. */
export type ChainSwitchDoneCallback = (chainId: ChainId) => void;

export interface EventCallbacks {
  /** Callback when a new socket transaction has begun. */
  onTx?: (tx: SocketTx) => SocketTxDoneCallback | void;
  /** Callback when an approval is being requested. */
  onApprove?: (tx: SocketTx) => TxDoneCallback | void;
  /** Callback when a send transaction is being requested. */
  onSend?: (tx: SocketTx) => TxDoneCallback | void;
  /** Callback when switching chains is being requested. */
  onChainSwitch?: (fromChainId: ChainId, toChainId: ChainId) => ChainSwitchDoneCallback | void;
  /** Callback when the route execution has completed. */
  onDone?: (activerouteId: number) => void;
}

/**
 * @inheritdoc
 *
 * The connected socket sdk interfaces directly with wallets
 */
export class Web3ConnectedSocket extends BaseSocket {
  readonly _provider: Web3Provider;

  constructor(options: SocketOptions, provider: Web3Provider) {
    super(options);
    this._provider = provider;
  }

  /**
   * Switch to the desired network
   * @param chainId chain
   */
  private async _switchNetwork(chainId: ChainId) {
    const chain = await this.getChain(chainId);
    try {
      await this._provider.send("wallet_switchEthereumChain", [
        { chainId: ethers.utils.hexlify(chainId) },
      ]);
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          const addPayload: AddEthereumChainParameters = {
            chainId: ethers.utils.hexlify(chainId),
            chainName: chain.name,
            nativeCurrency: {
              name: chain.currency.name,
              symbol: chain.currency.symbol,
              decimals: chain.currency.decimals,
            },
            rpcUrls: chain.rpcs,
            blockExplorerUrls: chain.explorers,
            iconUrls: [chain.icon],
          };
          await this._provider.send("wallet_addEthereumChain", [addPayload]);
        } catch (addError: any) {
          throw new Error(`Failed to switch to ${chainId}: ${addError}`);
        }
      }
    }
  }

  /**
   * Ensure that the provider is on the given chain
   * @param chainId chain
   * @param onChainSwitch Callback for chain switching
   */
  private async _ensureChain(chainId: ChainId, onChainSwitch: EventCallbacks["onChainSwitch"]) {
    const network = await this._provider.getNetwork();
    if (network.chainId !== chainId) {
      const doneCallback = onChainSwitch && onChainSwitch(network.chainId, chainId);
      await this._switchNetwork(chainId);
      if (doneCallback) doneCallback(chainId);
    }
  }

  /** Execute the quote */
  private async _execute(iterator: ActiveRouteGenerator, callbacks: EventCallbacks) {
    let next = await iterator.next();

    while (!next.done && next.value) {
      const tx = next.value;
      const txDoneCallback = callbacks.onTx && callbacks.onTx(tx);

      const approvalTxData = await tx.getApproveTransaction();
      if (approvalTxData) {
        await this._ensureChain(tx.chainId, callbacks.onChainSwitch);
        const approveCallback = callbacks.onApprove && callbacks.onApprove(tx);
        const approvalTx = await this._provider.getSigner().sendTransaction(approvalTxData);
        if (approveCallback) approveCallback(tx, approvalTx.hash);
        await approvalTx.wait();
      }

      const sendTxData = await tx.getSendTransaction();
      await this._ensureChain(tx.chainId, callbacks.onChainSwitch);
      const sendCallback = callbacks.onSend && callbacks.onSend(tx);
      const sendTx = await this._provider.getSigner().sendTransaction(sendTxData);
      if (sendCallback) sendCallback(tx, sendTx.hash);
      await sendTx.wait();

      next = await iterator.next(sendTx.hash);
      if (txDoneCallback) txDoneCallback(tx);
    }

    if (callbacks.onDone) callbacks.onDone(iterator.activeRouteId);
  }

  /**
   * Start executing the quote on the provider
   * @param quote The quote to execute
   * @param callbacks optional callbacks for different states of the execution
   */
  async start(quote: SocketQuote, callbacks: EventCallbacks): Promise<number> {
    const iterator = await this._startQuote(quote);
    this._execute(iterator, callbacks);
    return iterator.activeRouteId;
  }

  /**
   * Continue an active route
   * @param activeRouteId The active route id of the desired route to continue
   * @param callbacks optional callbacks for different states of the execution
   */
  async continue(activeRouteId: number, callbacks: EventCallbacks) {
    const iterator = await this._continueRoute(activeRouteId);
    await this._execute(iterator, callbacks);
  }
}
