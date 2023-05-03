import { Socket } from ".";
import { NextTxResponse, OpenAPI } from "./client";
import { Routes } from "./client/services/Routes";
import { Path } from "./path";
import mockRoute from "./mocks/mockRoute.json";
import { SocketQuote } from "./types";
import { UserTxType } from "./client/models/UserTxType";
import { TxType } from "./client/models/TxType";
import { BridgeName } from "./client/models/BridgeDetails";
import { PrepareActiveRouteStatus } from "./client/models/RouteStatusOutputDTO";
import { Middleware } from "@socket.tech/ll-core";

jest.mock("./client/services/Routes");
const mockedRoutes = jest.mocked(Routes, true);

const MOCK_ROUTE = mockRoute;
const MOCK_ROUTE_TX0 = MOCK_ROUTE.userTxs[0];
const MOCK_NEXT_TX: NextTxResponse = {
  activeRouteId: 123,
  totalUserTx: 3,
  userTxIndex: 0,
  value: "100",
  txData: "0x0",
  txTarget: "0x0",
  chainId: MOCK_ROUTE_TX0.chainId,
  txType: MOCK_ROUTE_TX0.txType as TxType,
  approvalData: MOCK_ROUTE_TX0.approvalData,
  userTxType: MOCK_ROUTE_TX0.userTxType as UserTxType,
};

describe("Socket", () => {
  it("assigns apikey", async () => {
    const socket = new Socket({ apiKey: "abc" });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(socket._options.apiKey).toBe("abc");
    expect(OpenAPI.API_KEY).toBe("abc");
  });

  it("assigns base Url", async () => {
    const socket = new Socket({ apiKey: "abc", baseUrl: "http://localhost:8080" });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(socket._options.baseUrl).toBe("http://localhost:8080");
    expect(OpenAPI.BASE).toBe("http://localhost:8080");
  });

  it("both include and exclude dex invalid", () => {
    const socket = new Socket({ apiKey: "abc" });
    expect(() =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      socket.validatePreferences({
        includeDexes: [Middleware.OneInch],
        excludeDexes: [Middleware.OneInch],
      })
    ).toThrow();
  });

  it("both include and exclude bridge invalid", () => {
    const socket = new Socket({ apiKey: "abc" });
    expect(() =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      socket.validatePreferences({
        includeBridges: [BridgeName.AnySwap],
        excludeBridges: [BridgeName.AnySwap],
      })
    ).toThrow();
  });
});

describe("Socket - Execute", () => {
  it("executes all steps", async () => {
    const socket = new Socket({ apiKey: "abc" });
    const fromToken = { address: "0x0", chainId: 1, symbol: "A" };
    const toToken = { address: "0x1", chainId: 2, symbol: "B" };
    const quote: SocketQuote = {
      address: "0x0",
      amount: "10000",
      path: new Path({ fromToken, toToken }),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      route: MOCK_ROUTE,
    };
    mockedRoutes.startActiveRoute.mockResolvedValueOnce({
      status: true,
      result: {
        ...MOCK_NEXT_TX,
        txData: "0x0",
        userTxIndex: 0,
      },
    });

    // Immediately resolve submissions
    mockedRoutes.updateActiveRoute.mockResolvedValue({
      status: true,
      result: PrepareActiveRouteStatus.COMPLETED,
    });

    const generaetor = await socket.start(quote);
    expect(generaetor.activeRouteId).toEqual(123);
    const tx0 = await generaetor.next();
    if (!tx0.value) throw new Error("did not give tx");
    expect(tx0.value.txData).toBe("0x0");

    mockedRoutes.nextTx.mockResolvedValueOnce({
      status: true,
      result: {
        ...MOCK_NEXT_TX,
        txData: "0x1",
        userTxIndex: 1,
      },
    });

    const tx1 = await generaetor.next("0x123");
    expect(mockedRoutes.updateActiveRoute.mock.calls).toContainEqual([
      {
        activeRouteId: 123,
        userTxIndex: 0,
        txHash: "0x123",
      },
    ]);

    if (!tx1.value) throw new Error("did not give tx");
    expect(tx1.value.txData).toBe("0x1");

    mockedRoutes.nextTx.mockResolvedValueOnce({
      status: true,
      result: {
        ...MOCK_NEXT_TX,
        txData: "0x2",
        userTxIndex: 2,
      },
    });

    const tx2 = await generaetor.next("0x456");
    expect(mockedRoutes.updateActiveRoute.mock.calls).toContainEqual([
      {
        activeRouteId: 123,
        userTxIndex: 1,
        txHash: "0x456",
      },
    ]);

    if (!tx2.value) throw new Error("did not give tx");
    expect(tx2.value.txData).toBe("0x2");

    const txDone = await generaetor.next("0x789");
    expect(txDone.done).toBe(true);
    expect(mockedRoutes.updateActiveRoute.mock.calls).toContainEqual([
      {
        activeRouteId: 123,
        userTxIndex: 2,
        txHash: "0x789",
      },
    ]);
  });
});
