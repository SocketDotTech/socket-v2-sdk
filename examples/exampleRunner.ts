import axios from "axios";
import { Socket } from "../src";
import * as ethers from "ethers";
import { Path } from "../src/path";
import { BridgeName } from "../src/client/models/BridgeDetails";
import { SocketTx } from "../src/socketTx";

const API_KEY = "645b2c8c-5825-4930-baf3-d9b997fcd88c"; // Testing key

const wallet = process.env.PRIVATE_KEY
  ? new ethers.Wallet(process.env.PRIVATE_KEY)
  : ethers.Wallet.createRandom();

// Polygon ethers fee data is broken
async function getPolygonFeeData() {
  const gas: {
    standard: {
      maxPriorityFee: number;
      maxFee: number;
    };
  } = (await axios.get("https://gasstation-mainnet.matic.network/v2")).data;

  return {
    maxPriorityFeePerGas: ethers.utils.parseUnits(
      Math.ceil(gas.standard.maxPriorityFee).toString(),
      "gwei"
    ),
    maxFeePerGas: ethers.utils.parseUnits(Math.ceil(gas.standard.maxFee).toString(), "gwei"),
  };
}

const chainProviders: { [index: number]: ethers.providers.JsonRpcProvider } = {
  100: new ethers.providers.JsonRpcProvider("https://gnosis-mainnet.public.blastapi.io"),
  137: new ethers.providers.JsonRpcProvider("https://polygon-rpc.com"),
  56: new ethers.providers.JsonRpcProvider("https://bsc-dataseed4.binance.org"),
};

export async function runRoute({
  fromAmount,
  fromChainId,
  toChainId,
  fromTokenAddress,
  toTokenAddress,
  bridge,
  multiTx = false,
}: {
  fromAmount: string;
  fromChainId: number;
  toChainId: number;
  fromTokenAddress: string;
  toTokenAddress: string;
  bridge?: BridgeName;
  multiTx?: boolean;
}) {
  const socket = new Socket({
    apiKey: API_KEY,
    defaultQuotePreferences: {
      singleTxOnly: !multiTx,
    },
  });

  const userAddress = await wallet.getAddress();

  const tokenList = await socket.getTokenList({
    fromChainId: fromChainId,
    toChainId: toChainId,
  });

  const fromToken = tokenList.from.find(
    (token) => token.address.toLowerCase() === fromTokenAddress.toLowerCase()
  )!;
  const toToken = tokenList.to.find(
    (token) => token.address.toLowerCase() === toTokenAddress.toLowerCase()
  )!;

  const path = new Path({ fromToken, toToken });
  if (!fromToken.decimals) {
    throw new Error("danger! from token has no decimals!");
  }
  const amount = ethers.utils.parseUnits(fromAmount, fromToken.decimals).toString();
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

  console.log("Running Quote", JSON.stringify(quote, null, 2));

  if (!quote) {
    throw new Error("no routes");
  }

  const execute = await socket.start(quote);
  await executeRoute(execute);
}

export async function executeRoute(execute: AsyncGenerator<SocketTx, void, string>) {
  let next = await execute.next();

  while (!next.done && next.value) {
    const tx = next.value;
    console.log(`Executing step ${tx.userTxIndex} "${tx.userTxType}" on chain ${tx.chainId}`);
    const provider = chainProviders[tx.chainId];
    const approvalTxData = await tx.getApproveTransaction();
    if (approvalTxData) {
      const feeData = tx.chainId === 137 ? await getPolygonFeeData() : {};
      const approvalTx = await wallet.connect(provider).sendTransaction({
        ...approvalTxData,
        ...feeData,
      });
      console.log(`Approving: ${approvalTx.hash}`);
      await approvalTx.wait();
    }
    const sendTxData = await tx.getSendTransaction();
    const feeData = tx.chainId === 137 ? await getPolygonFeeData() : {};
    const sendTx = await wallet.connect(provider).sendTransaction({
      ...sendTxData,
      ...feeData,
    });
    console.log(`Sending: ${sendTx.hash}`);
    await sendTx.wait();
    next = await execute.next(sendTx.hash);
  }
}
