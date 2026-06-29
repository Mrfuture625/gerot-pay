import { readContract, writeContract } from "@wagmi/core";
import { config } from "@/features/wallet/providers/WalletProvider";
import { KRYPTPAY_CONTRACTS } from "@/lib/contracts/kryptpay";
import { MARKETPLACE_ABI } from "@/lib/contracts/marketplace";

const ERC20_APPROVE_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export async function getFinalCardPriceUsd(
  cardType: number,
  couponCode: string,
) {
  return readContract(config, {
    address: KRYPTPAY_CONTRACTS.cardMarketplace,
    abi: MARKETPLACE_ABI,
    functionName: "getFinalPriceUsd",
    args: [cardType, couponCode],
  });
}

export async function getEthAmountForUsd(usdAmount: bigint) {
  return readContract(config, {
    address: KRYPTPAY_CONTRACTS.cardMarketplace,
    abi: MARKETPLACE_ABI,
    functionName: "getEthAmountForUsd",
    args: [usdAmount],
  });
}

export async function getUsdcToken() {
  return readContract(config, {
    address: KRYPTPAY_CONTRACTS.cardMarketplace,
    abi: MARKETPLACE_ABI,
    functionName: "usdcToken",
  });
}

export async function getUsdtToken() {
  return readContract(config, {
    address: KRYPTPAY_CONTRACTS.cardMarketplace,
    abi: MARKETPLACE_ABI,
    functionName: "usdtToken",
  });
}

export function getStableAmountForUsd(usdAmount: bigint) {
  return usdAmount / 1_000_000_000_000n;
}

export async function approveStableToken(
  tokenAddress: `0x${string}`,
  amount: bigint,
) {
  return writeContract(config, {
    address: tokenAddress,
    abi: ERC20_APPROVE_ABI,
    functionName: "approve",
    args: [KRYPTPAY_CONTRACTS.cardMarketplace, amount],
  });
}

export async function buyCardOnchain({
  cardType,
  paymentToken,
  couponCode,
  ethValue,
}: {
  cardType: number;
  paymentToken: number;
  couponCode: string;
  ethValue?: bigint;
}) {
  return writeContract(config, {
    address: KRYPTPAY_CONTRACTS.cardMarketplace,
    abi: MARKETPLACE_ABI,
    functionName: "buyCard",
    args: [cardType, paymentToken, couponCode],
    value: ethValue ?? 0n,
  });
}