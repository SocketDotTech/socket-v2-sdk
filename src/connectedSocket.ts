import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { AddEthereumChainParameters, Socket, SocketQuote } from ".";

export class ConnectedSocket {
  _socket: Socket;
  _provider: Web3Provider;

  constructor(socket: Socket, provider: Web3Provider) {
    this._socket = socket;
    this._provider = provider;
  }

  async switchNetwork(chainId: number) {
    const chain = await this._socket.getChain(chainId);
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

  async ensureChain(chainId: number) {
    const network = await this._provider.getNetwork();
    if (network.chainId !== chainId) {
      await this.switchNetwork(chainId);
    }
  }

  async start(quote: SocketQuote) {
    const execute = await this._socket.start(quote);
    let next = await execute.next();

    while (!next.done && next.value) {
      const tx = next.value;
      // Callback hook
      console.log(`Executing step ${tx.userTxIndex} "${tx.userTxType}" on chain ${tx.chainId}`);
      const approvalTxData = await tx.getApproveTransaction();
      if (approvalTxData) {
        await this.ensureChain(tx.chainId);
        const approvalTx = await this._provider.getSigner().sendTransaction(approvalTxData);
        // Callback hook
        console.log(`Approving: ${approvalTx.hash}`);
        await approvalTx.wait();
      }
      const sendTxData = await tx.getSendTransaction();
      await this.ensureChain(tx.chainId);
      const sendTx = await this._provider.getSigner().sendTransaction(sendTxData);
      // Callback hook
      console.log(`Sending: ${sendTx.hash}`);
      await sendTx.wait();
      next = await execute.next(sendTx.hash);
    }
  }
}
