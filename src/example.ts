import { TokenLists } from ".";

const API_KEY = "645b2c8c-5825-4930-baf3-d9b997fcd88c"; // Testing key

(async () => {
  const tokenList = await TokenLists.getToTokenList({
    fromChainId: "1",
    toChainId: "137",
    apiKey: API_KEY,
  });
  console.log(tokenList);
})();
