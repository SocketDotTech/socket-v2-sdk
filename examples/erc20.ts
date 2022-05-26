import { Chain, client, Path, Quotes, TokenList, Trade } from "../src";
import * as ethers from "ethers";
import { TokenAsset } from "../src/client";

// Set the socket SDK api key
client.OpenAPI.API_KEY = "645b2c8c-5825-4930-baf3-d9b997fcd88c"; // Testing key

const usdcTokenFinder = (token: TokenAsset) => token.symbol === "USDC";

const wallet = process.env.PRIVATE_KEY
  ? new ethers.Wallet(process.env.PRIVATE_KEY)
  : ethers.Wallet.createRandom();

const provider = new ethers.providers.JsonRpcProvider("https://gnosis-mainnet.public.blastapi.io");

const HUNDRED_USDC = ethers.BigNumber.from("10000000");

(async () => {
  const userAddress = await wallet.getAddress();
  const chains = await Chain.getSupportedChains();

  // Select chains
  const gnosis = chains.find((chain) => chain.chainDetails.chainId === 100)!;
  const matic = chains.find((chain) => chain.chainDetails.chainId === 137)!;

  const tokenList = await TokenList.getTokenList({
    fromChainId: gnosis.chainDetails.chainId,
    toChainId: matic.chainDetails.chainId,
  });

  // Select USDC on both chains
  const usdcOnGnosis = tokenList.from.find(usdcTokenFinder)!;
  const usdcOnPolygon = tokenList.to.find(usdcTokenFinder)!;

  const path = new Path({ fromToken: usdcOnGnosis, toToken: usdcOnPolygon });
  const quote = await Quotes.getQuotes({ path: path, amount: HUNDRED_USDC, address: userAddress });

  if (!quote.routes || !quote.routes.length) {
    throw new Error("no routes");
  }

  const trade = new Trade({ userAddress, path, route: quote.routes[0] });
  const approvalTxData = await trade.getApproveTransaction();
  if (approvalTxData) {
    const approvalTx = await wallet.connect(provider).sendTransaction(approvalTxData);
    console.log(`Approving: ${approvalTx.hash}`);
    await approvalTx.wait();
  }

  const sendTxData = await trade.getSendTransaction();
  const sendTx = await wallet.connect(provider).sendTransaction(sendTxData);
  console.log(`Sending: ${sendTx.hash}`);
  await sendTx.wait();

  const status = await trade.getStatus(sendTx.hash);
  console.log("Status", status);
  const finalStatus = await status.wait();
  console.log("Trade completed", finalStatus);
})();
