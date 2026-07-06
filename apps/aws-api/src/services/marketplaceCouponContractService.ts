import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { KRYPTPAY_CONTRACTS, MARKETPLACE_ABI } from "@kryptpay/contracts";

const rpcUrl = process.env.RPC_URL;
const privateKey = (
  process.env.MARKETPLACE_OWNER_PRIVATE_KEY ||
  process.env.REWARD_MANAGER_PRIVATE_KEY
) as `0x${string}` | undefined;

function getClients() {
  if (!rpcUrl) throw new Error("RPC_URL is required");
  if (!privateKey) throw new Error("MARKETPLACE_OWNER_PRIVATE_KEY is required");

  const account = privateKeyToAccount(privateKey);

  return {
    account,
    publicClient: createPublicClient({
      chain: sepolia,
      transport: http(rpcUrl),
    }),
    walletClient: createWalletClient({
      account,
      chain: sepolia,
      transport: http(rpcUrl),
    }),
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
  const { account, publicClient, walletClient } = getClients();
  const { virtualAllowed, physicalAllowed } = couponTargetFlags(input.appliesTo);

  console.log("=== Creating coupon on-chain ===");
  console.log("Contract:", KRYPTPAY_CONTRACTS.cardMarketplace);
  console.log("Owner:", account.address);
  console.log("Code:", input.code);
  console.log("Discount:", input.discountPercent);

  const { request, result } = await publicClient.simulateContract({
    account,
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

  const hash = await walletClient.writeContract(request);

  console.log("Coupon tx:", hash);
  console.log("Coupon id:", result.toString());

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  console.log("Receipt status:", receipt.status);

  return {
    txHash: hash,
    couponId: result.toString(),
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