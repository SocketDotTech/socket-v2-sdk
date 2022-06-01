import * as ethers from "ethers";
import { TokenAsset } from "../src/client";
import axios from "axios";
import { Socket } from "../src";
import { Path } from "../src/path";

// Set the socket SDK api key
const API_KEY = "645b2c8c-5825-4930-baf3-d9b997fcd88c"; // Testing key

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

const nativeTokenFinder = (token: TokenAsset) =>
  token.address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

const wallet = process.env.PRIVATE_KEY
  ? new ethers.Wallet(process.env.PRIVATE_KEY)
  : ethers.Wallet.createRandom();

const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");

const FIVE_MATIC = ethers.BigNumber.from("5000000000000000000");

const socket = new Socket(API_KEY, {
  singleTxOnly: true,
});

(async () => {
  const userAddress = await wallet.getAddress();
  const chains = await socket.getSupportedChains();

  // Select chains
  const matic = chains.find((chain) => chain.chainDetails.chainId === 137)!;
  const gnosis = chains.find((chain) => chain.chainDetails.chainId === 100)!;

  const tokenList = await socket.getTokenList({
    fromChainId: matic.chainDetails.chainId,
    toChainId: gnosis.chainDetails.chainId,
  });

  // Select native tokens (MATIC & xDAI)
  const maticOnPolygon = tokenList.from.find(nativeTokenFinder)!;
  const daiOnGnosis = tokenList.to.find(nativeTokenFinder)!;

  const path = new Path({ fromToken: maticOnPolygon, toToken: daiOnGnosis });
  const quote = await socket.getBestQuote({ path, amount: FIVE_MATIC, address: userAddress });

  if (!quote) {
    throw new Error("no routes");
  }

  for await (const tx of socket.start(quote)) {
    const approvalTxData = await tx.getApproveTransaction();
    if (approvalTxData) {
      throw new Error("approval not expected");
    }
    const sendTxData = await tx.getSendTransaction();
    const sendTx = await wallet.connect(provider).sendTransaction({
      ...sendTxData,
      ...(await getPolygonFeeData()),
    });
    console.log(`Sending: ${sendTx.hash}`);
    await sendTx.wait();

    await tx.done(sendTx.hash);
  }
})();
