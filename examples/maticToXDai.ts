import { Chain, client, Path, Quotes, TokenList, Trade } from "../src";
import * as ethers from "ethers";
import { TokenAsset } from "../src/client";
import axios from "axios";

// Set the socket SDK api key
client.OpenAPI.API_KEY = "645b2c8c-5825-4930-baf3-d9b997fcd88c"; // Testing key

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

const TEN_MATIC = ethers.BigNumber.from("10000000000000000000");

(async () => {
  const userAddress = await wallet.getAddress();
  const chains = await Chain.getSupportedChains();

  // Select chains
  const matic = chains.find((chain) => chain.chainDetails.chainId === 137)!;
  const gnosis = chains.find((chain) => chain.chainDetails.chainId === 100)!;

  const tokenList = await TokenList.getTokenList(
    matic.chainDetails.chainId,
    gnosis.chainDetails.chainId
  );

  // Select native tokens (MATIC & xDAI)
  const maticOnPolygon = tokenList.from.find(nativeTokenFinder)!;
  const daiOnGnosis = tokenList.to.find(nativeTokenFinder)!;

  const path = new Path(matic, gnosis, maticOnPolygon, daiOnGnosis);
  const quote = await Quotes.getQuotes(path, TEN_MATIC, userAddress);

  if (!quote.routes || !quote.routes.length) {
    throw new Error("no routes");
  }

  const trade = new Trade(userAddress, path, quote.routes[0]);

  const approvalTxData = await trade.getApproveTransaction();
  if (approvalTxData) throw new Error("Approval not expected");

  const sendTxData = await trade.getSendTransaction();
  const sendTx = await wallet.connect(provider).sendTransaction({
    ...sendTxData,
    ...(await getPolygonFeeData()), // Polygon rpc fee calculation is broken
  });
  console.log(`Sending: ${sendTx.hash}`);
  await sendTx.wait();

  const status = await trade.getStatus(sendTx.hash);
  console.log("Status", status);
  const finalStatus = await status.wait();
  console.log("Trade completed", finalStatus);
})();
