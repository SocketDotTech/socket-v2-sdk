import { Socket } from "../src";
import * as ethers from "ethers";
import { Path } from "../src/path";
import { BridgeName } from "../src/client/models/BridgeDetails";

const API_KEY = "645b2c8c-5825-4930-baf3-d9b997fcd88c"; // Testing key

const socket = new Socket(API_KEY, {
  singleTxOnly: true,
});

const wallet = process.env.PRIVATE_KEY
  ? new ethers.Wallet(process.env.PRIVATE_KEY)
  : ethers.Wallet.createRandom();

export async function runRoute({
  provider,
  fromAmount,
  fromChainId,
  toChainId,
  fromTokenAddress,
  toTokenAddress,
  getFeeData,
  bridge,
}: {
  provider: ethers.providers.JsonRpcProvider;
  fromAmount: string;
  fromChainId: number;
  toChainId: number;
  fromTokenAddress: string;
  toTokenAddress: string;
  getFeeData?: () => Promise<{
    maxPriorityFeePerGas: ethers.BigNumber;
    maxFeePerGas: ethers.BigNumber;
  }>;
  bridge?: BridgeName;
}) {
  const userAddress = await wallet.getAddress();

  const tokenList = await socket.getTokenList({
    fromChainId: fromChainId,
    toChainId: toChainId,
  });

  const fromToken = tokenList.from.find((token) => token.address === fromTokenAddress);
  const toToken = tokenList.to.find((token) => token.address === toTokenAddress);

  const path = new Path({ fromToken, toToken });
  if (!fromToken.decimals) {
    throw new Error("danger! from token has no decimals!");
  }
  const amount = ethers.utils.parseUnits(fromAmount, fromToken.decimals);
  const prefs = bridge ? { includeBridges: [bridge] } : undefined;
  const quotes = await socket.getAllQuotes(
    {
      path: path,
      amount,
      address: userAddress,
    },
    prefs
  );

  const quote = bridge
    ? quotes.find((quote) => quote.route.usedBridgeNames.includes(bridge))
    : quotes[0];

  if (!quote) {
    throw new Error("no routes");
  }

  for await (const tx of socket.start(quote)) {
    const approvalTxData = await tx.getApproveTransaction();
    if (approvalTxData) {
      const feeData = getFeeData ? await getFeeData() : {};
      const approvalTx = await wallet.connect(provider).sendTransaction({
        ...approvalTxData,
        ...feeData,
      });
      console.log(`Approving: ${approvalTx.hash}`);
      await approvalTx.wait();
    }
    const sendTxData = await tx.getSendTransaction();
    const feeData = getFeeData ? await getFeeData() : {};
    const sendTx = await wallet.connect(provider).sendTransaction({
      ...sendTxData,
      ...feeData,
    });
    console.log(`Sending: ${sendTx.hash}`);
    await sendTx.wait();

    await tx.done(sendTx.hash);
  }
}
