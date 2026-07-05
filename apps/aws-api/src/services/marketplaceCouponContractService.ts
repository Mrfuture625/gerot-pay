import "dotenv/config";
import { createPublicClient, createWalletClient, http, parseEventLogs } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { KRYPTPAY_CONTRACTS, MARKETPLACE_ABI } from "@kryptpay/contracts";

const rpcUrl = process.env.RPC_URL;
const privateKey = process.env.MARKETPLACE_OWNER_PRIVATE_KEY as `0x${string}` | undefined;

function getClients() {
  if (!rpcUrl) throw new Error("RPC_URL is required");
  if (!privateKey) throw new Error("MARKETPLACE_OWNER_PRIVATE_KEY is required");

  const account = privateKeyToAccount(privateKey);

  return {
    publicClient: createPublicClient({ chain: sepolia, transport: http(rpcUrl) }),
    walletClient: createWalletClient({ account, chain: sepolia, transport: http(rpcUrl) }),
  };
}

function toUnixSeconds(date: Date | string | null | undefined) {
  if (!date) return 0n;
  return BigInt(Math.floor(new Date(date).getTime() / 1000));
}

function couponTargetFlags(appliesTo: string) {
  const target = String(appliesTo).toUpperCase();

  return {
    virtualAllowed: target === "ALL" || target === "VIRTUAL_CARD",
    physicalAllowed: target === "ALL" || target === "PHYSICAL_CARD",
  };
}

export async function createCouponOnchain(input: {
  code: string;
  discountPercent: number;
  maxUses: number | null;
  expiresAt: Date | string | null;
  appliesTo: string;
}) {
  const { publicClient, walletClient } = getClients();
  const { virtualAllowed, physicalAllowed } = couponTargetFlags(input.appliesTo);

  const hash = await walletClient.writeContract({
    address: KRYPTPAY_CONTRACTS.cardMarketplace,
    abi: MARKETPLACE_ABI,
    functionName: "createCoupon",
    args: [
      input.code,
      BigInt(input.discountPercent),
      BigInt(input.maxUses ?? 0),
      toUnixSeconds(input.expiresAt),
      virtualAllowed,
      physicalAllowed,
    ],
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  const logs = parseEventLogs({
    abi: MARKETPLACE_ABI,
    logs: receipt.logs,
    eventName: "CouponCreated",
  });

  return {
    txHash: hash,
    couponId: logs[0]?.args.couponId?.toString() ?? null,
  };
}

export async function updateCouponOnchain(input: {
  couponId: string;
  discountPercent: number;
  maxUses: number | null;
  expiresAt: Date | string | null;
  active: boolean;
  appliesTo: string;
}) {
  const { publicClient, walletClient } = getClients();
  const { virtualAllowed, physicalAllowed } = couponTargetFlags(input.appliesTo);

  const hash = await walletClient.writeContract({
    address: KRYPTPAY_CONTRACTS.cardMarketplace,
    abi: MARKETPLACE_ABI,
    functionName: "updateCoupon",
    args: [
      BigInt(input.couponId),
      BigInt(input.discountPercent),
      BigInt(input.maxUses ?? 0),
      toUnixSeconds(input.expiresAt),
      input.active,
      virtualAllowed,
      physicalAllowed,
    ],
  });

  await publicClient.waitForTransactionReceipt({ hash });
  return { txHash: hash };
}

export async function setCouponActiveOnchain(couponId: string, active: boolean) {
  const { publicClient, walletClient } = getClients();

  const hash = await walletClient.writeContract({
    address: KRYPTPAY_CONTRACTS.cardMarketplace,
    abi: MARKETPLACE_ABI,
    functionName: "setCouponActive",
    args: [BigInt(couponId), active],
  });

  await publicClient.waitForTransactionReceipt({ hash });
  return { txHash: hash };
}