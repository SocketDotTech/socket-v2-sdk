import type { Web3Provider } from "@ethersproject/providers";
import { ChainId } from "@socket.tech/ll-core/constants/types";
import { ethers } from "ethers";
import { SocketOptions, SocketQuote } from "./types";
import { Socket } from '.'

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

export class ConnectedSocket extends Socket {
  readonly _provider: Web3Provider;

  constructor(options: SocketOptions, provider: Web3Provider) {
    super(options)
    this._provider = provider;
  }

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

  private async _ensureChain(chainId: ChainId) {
    const network = await this._provider.getNetwork();
    if (network.chainId !== chainId) {
      await this._switchNetwork(chainId);
    }
  }

  async walletStart(quote: SocketQuote) {
    const execute = await this.start(quote);
    let next = await execute.next();

    while (!next.done && next.value) {
      const tx = next.value;
      // Callback hook
      console.log(`Executing step ${tx.userTxIndex} "${tx.userTxType}" on chain ${tx.chainId}`);
      const approvalTxData = await tx.getApproveTransaction();
      if (approvalTxData) {
        await this._ensureChain(tx.chainId);
        const approvalTx = await this._provider.getSigner().sendTransaction(approvalTxData);
        // Callback hook
        console.log(`Approving: ${approvalTx.hash}`);
        await approvalTx.wait();
      }
      const sendTxData = await tx.getSendTransaction();
      await this._ensureChain(tx.chainId);
      const sendTx = await this._provider.getSigner().sendTransaction(sendTxData);
      // Callback hook
      console.log(`Sending: ${sendTx.hash}`);
      await sendTx.wait();
      next = await execute.next(sendTx.hash);
    }
  }
}
