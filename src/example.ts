import BigNumber from "bignumber.js";
import { Chain, client, Path, Quotes, TokenList, Trade } from ".";
import ethers from "ethers";

client.OpenAPI.API_KEY = "645b2c8c-5825-4930-baf3-d9b997fcd88c"; // Testing key

const ETH_TOKEN_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
const wallet = ethers.Wallet.createRandom();

(async () => {
  const userAddress = await wallet.getAddress();
  const chains = await Chain.getSupportedChains();
  const ethereum = chains.find((chain) => chain.chainDetails.chainId === 1)!;
  const optimism = chains.find((chain) => chain.chainDetails.chainId === 10)!;

  const tokenList = await TokenList.getTokenList(
    ethereum.chainDetails.chainId,
    optimism.chainDetails.chainId
  );

  const ethOnEthereum = tokenList.from.find((token) => token.address === ETH_TOKEN_ADDRESS)!;
  const ethOnOptimism = tokenList.to.find((token) => token.address === ETH_TOKEN_ADDRESS)!;

  const path = new Path(ethereum, optimism, ethOnEthereum, ethOnOptimism);
  const quote = await Quotes.getQuotes(path, new BigNumber("100000000000000000"), userAddress);

  if (!quote.routes || !quote.routes.length) {
    throw new Error("no routes");
  }

  const trade = new Trade(userAddress, path, quote.routes[0]);

  trade.connect(wallet);

  if (trade.approvalRequired) {
    const approvalTx = await trade.approve();
    console.log(`Approving: ${approvalTx.hash}`);
    await approvalTx.wait();
  }

  const sendTx = await trade.send();
  console.log(`Sending: ${sendTx.hash}`);
  await sendTx.wait();

  // TODO: watch status

  console.log("Trade completed");
})();
