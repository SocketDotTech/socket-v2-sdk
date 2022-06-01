import { Socket } from "../src";
import * as ethers from "ethers";
import { TokenAsset } from "../src/client";
import { Path } from "../src/path";

const API_KEY = "645b2c8c-5825-4930-baf3-d9b997fcd88c"; // Testing key

const socket = new Socket(API_KEY, {
  singleTxOnly: true,
});

const usdcTokenFinder = (token: TokenAsset) => token.symbol === "USDC";

const wallet = process.env.PRIVATE_KEY
  ? new ethers.Wallet(process.env.PRIVATE_KEY)
  : ethers.Wallet.createRandom();

const provider = new ethers.providers.JsonRpcProvider("https://gnosis-mainnet.public.blastapi.io");

const FIVE_USDC = ethers.BigNumber.from("5000000");

(async () => {
  const userAddress = await wallet.getAddress();
  const chains = await socket.getSupportedChains();

  // Select chains
  const gnosis = chains.find((chain) => chain.chainId === 100)!;
  const matic = chains.find((chain) => chain.chainId === 137)!;

  const tokenList = await socket.getTokenList({
    fromChainId: gnosis.chainId,
    toChainId: matic.chainId,
  });

  // Select USDC on both chains
  const usdcOnGnosis = tokenList.from.find(usdcTokenFinder)!;
  const usdcOnPolygon = tokenList.to.find(usdcTokenFinder)!;

  const path = new Path({ fromToken: usdcOnGnosis, toToken: usdcOnPolygon });
  const quote = await socket.getBestQuote({
    path: path,
    amount: FIVE_USDC,
    address: userAddress,
  });

  if (!quote) {
    throw new Error("no routes");
  }

  for await (const tx of socket.start(quote)) {
    const approvalTxData = await tx.getApproveTransaction();
    if (approvalTxData) {
      const approvalTx = await wallet.connect(provider).sendTransaction(approvalTxData);
      console.log(`Approving: ${approvalTx.hash}`);
      await approvalTx.wait();
    }
    const sendTxData = await tx.getSendTransaction();
    const sendTx = await wallet.connect(provider).sendTransaction(sendTxData);
    console.log(`Sending: ${sendTx.hash}`);
    await sendTx.wait();

    await tx.done(sendTx.hash);
  }
})();
