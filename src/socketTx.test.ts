import { NextTxResponse } from "./client";
import { TxType } from "./client/models/TxType";
import { UserTxType } from "./client/models/UserTxType";
import { ActiveRouteResponse } from "./client/models/ActiveRouteResponse";
import { SocketTx } from "./socketTx";
import { Approvals } from "./client/services/Approvals";
import { Routes } from "./client/services/Routes";
import { PrepareActiveRouteStatus } from "./client/models/RouteStatusOutputDTO";
import mockActiveRoute from "./mocks/mockActiveRoute.json";

jest.mock("./client/services/Approvals");
const mockedApprovals = jest.mocked(Approvals, true);

jest.mock("./client/services/Routes");
const mockedRoutes = jest.mocked(Routes, true);

const MOCK_ACTIVE_ROUTE: ActiveRouteResponse = mockActiveRoute as ActiveRouteResponse;

const MOCK_TX: NextTxResponse = {
  activeRouteId: 123,
  approvalData: {
    allowanceTarget: "0x0",
    approvalTokenAddress: "0x1",
    minimumApprovalAmount: "500",
    owner: "0x5",
  },
  chainId: 1,
  totalUserTx: 2,
  txData: "0x123",
  txTarget: "0xc30141B657f4216252dc59Af2e7CdB9D8792e1B0",
  txType: TxType.ETH_SEND_TRANSACTION,
  userTxIndex: 0,
  userTxType: UserTxType.FUND_MOVR,
  value: "500",
};

describe("Socket Tx - Creation", () => {
  it("initialises checks correctly", async () => {
    const tx = new SocketTx(MOCK_TX);
    expect(tx.done).toBe(false);
    expect(tx.approvalChecked).toBe(false);
  });
});

describe("Socket Tx - Approval Required", () => {
  it("returns false if no approval data", async () => {
    const tx = new SocketTx({
      ...MOCK_TX,
      approvalData: null,
    });
    const required = await tx.approvalRequired();
    expect(required).toBe(false);
  });

  it("flags checked when approval checked", async () => {
    const tx = new SocketTx({
      ...MOCK_TX,
      approvalData: null,
    });
    await tx.approvalRequired();
    expect(tx.approvalChecked).toBe(true);
  });

  it.each([
    { test: "below", allowance: "499", expected: true },
    { test: "exceeds", allowance: "600", expected: false },
    { test: "equals", allowance: "500", expected: false },
  ])("return $expected if approval $test required", async ({ allowance, expected }) => {
    const tx = new SocketTx({
      ...MOCK_TX,
    });

    mockedApprovals.fetchApprovals.mockResolvedValue({
      success: true,
      result: {
        value: allowance,
        tokenAddress: "0x1",
      },
    });

    const required = await tx.approvalRequired();
    expect(required).toBe(expected);
  });
});

describe("Socket Tx - Get Send Transaction", () => {
  it("throws error if approval not checked", async () => {
    const tx = new SocketTx(MOCK_TX);
    expect(tx.approvalChecked).toBe(false);
    await expect(tx.getSendTransaction()).rejects.toThrow();
  });

  it("provides transaction data if approval checked", async () => {
    const tx = new SocketTx(MOCK_TX);
    mockedApprovals.fetchApprovals.mockResolvedValue({
      success: true,
      result: {
        value: "600",
        tokenAddress: "0x1",
      },
    });
    mockedRoutes.getActiveRoute.mockResolvedValue({
      success: true,
      result: MOCK_ACTIVE_ROUTE,
    });
    const required = await tx.approvalRequired();
    expect(required).toBe(false);

    const txData = await tx.getSendTransaction();
    expect(txData.to).toBe(tx.txTarget);
    expect(txData.data).toBe(tx.txData);
    expect(txData.value).toBe(tx.value);
  });
});

describe("Socket Tx - Submit", () => {
  it("resolves when update is completed", async () => {
    const tx = new SocketTx(MOCK_TX, 50);
    mockedRoutes.updateActiveRoute.mockResolvedValue({
      status: true,
      result: PrepareActiveRouteStatus.PENDING,
    });
    setTimeout(() => {
      mockedRoutes.updateActiveRoute.mockResolvedValue({
        status: true,
        result: PrepareActiveRouteStatus.COMPLETED,
      });
    }, 100);
    const result = await tx.submit("0x0");
    expect(result).toBe(PrepareActiveRouteStatus.COMPLETED);
  });

  it("does not allow multiple hash to be submitted", async () => {
    const tx = new SocketTx(MOCK_TX, 50);
    tx.submit("0x123");
    await expect(tx.submit("0x456")).rejects.toThrow();
  });
});

describe("Socket Tx - Validate send address", () => {
  it("invalid when address included in socket addresses", async () => {
    const tx = new SocketTx({
      ...MOCK_TX,
      txTarget: "0xe91d153e0b41518a2ce8dd3d7944fa863463a97d", // not socket address
    });
    await tx.approvalRequired();
    await expect(async () => tx.getSendTransaction()).rejects.toThrow();
  });
});
