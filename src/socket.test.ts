import { Socket } from ".";
import { OpenAPI } from "./client";

describe("Socket", () => {
  it("assigns apikey", async () => {
    const socket = new Socket("abc");
    expect(socket.apiKey).toBe("abc");
    expect(OpenAPI.API_KEY).toBe("abc");
  });
});
