import { Socket } from ".";
import { OpenAPI } from "./client";

describe("Socket", () => {
  it("assigns apikey", async () => {
    const socket = new Socket({ apiKey: "abc" });
    expect(socket.options.apiKey).toBe("abc");
    expect(OpenAPI.API_KEY).toBe("abc");
  });
});
