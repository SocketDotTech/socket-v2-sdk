import axios from "axios";
import { ethers } from "ethers";
import { runRoute } from "./exampleRunner";

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

const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");

(async () => {
  await runRoute({
    provider,
    getFeeData: getPolygonFeeData,
    fromAmount: "5",
    fromChainId: 137,
    toChainId: 56,
    fromTokenAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    toTokenAddress: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
  });
})();
