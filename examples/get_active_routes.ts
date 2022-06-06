import { ethers } from "ethers";
import { Socket } from "../src";
import { Routes } from "../src/client";

const API_KEY = "645b2c8c-5825-4930-baf3-d9b997fcd88c"; // Testing key

const wallet = process.env.PRIVATE_KEY
  ? new ethers.Wallet(process.env.PRIVATE_KEY)
  : ethers.Wallet.createRandom();

const socket = new Socket(API_KEY);

(async () => {
  const userAddress = await wallet.getAddress();
  const routes = await socket.client.routes.getActiveRoutesForUser({ userAddress });
  console.log(routes);
})();
