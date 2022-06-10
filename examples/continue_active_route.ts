import { ethers } from "ethers";
import { Socket } from "../src";
import { executeRoute } from "./exampleRunner";

const API_KEY = "645b2c8c-5825-4930-baf3-d9b997fcd88c"; // Testing key

const wallet = process.env.PRIVATE_KEY
  ? new ethers.Wallet(process.env.PRIVATE_KEY)
  : ethers.Wallet.createRandom();

const socket = new Socket({ apiKey: API_KEY });

(async () => {
  const userAddress = await wallet.getAddress();
  // Cotninue latest active route
  const routes = await (await socket.client.routes.getActiveRoutesForUser({ userAddress })).result;
  const route = routes.activeRoutes[0];
  const execute = await socket.continue(route.activeRouteId);
  await executeRoute(execute);
})();
