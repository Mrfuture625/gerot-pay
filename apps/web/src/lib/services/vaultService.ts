import { readContract, writeContract } from "@wagmi/core";
import { config } from "@/features/wallet/providers/WalletProvider";
import { KRYPTPAY_CONTRACTS } from "@/lib/contracts/kryptpay";
import { VAULT_ABI } from "@/lib/contracts/vault";

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

export async function getUserCardIds(user: `0x${string}`) {
  return readContract(config, {
    address: KRYPTPAY_CONTRACTS.vault,
    abi: VAULT_ABI,
    functionName: "getUserCardIds",
    args: [user],
  });
}

export async function getCard(cardId: bigint) {
  return readContract(config, {
    address: KRYPTPAY_CONTRACTS.vault,
    abi: VAULT_ABI,
    functionName: "getCard",
    args: [cardId],
  });
}

export async function getEthAmountForReload(usdAmount: bigint) {
  return readContract(config, {
    address: KRYPTPAY_CONTRACTS.vault,
    abi: VAULT_ABI,
    functionName: "getEthAmountForUsd",
    args: [usdAmount],
  });
}

export function getStableAmountForReload(usdAmount: bigint) {
  return usdAmount / 1_000_000_000_000n;
}

export async function getVaultUsdcToken() {
  return readContract(config, {
    address: KRYPTPAY_CONTRACTS.vault,
    abi: VAULT_ABI,
    functionName: "usdcToken",
  });
}

export async function getVaultUsdtToken() {
  return readContract(config, {
    address: KRYPTPAY_CONTRACTS.vault,
    abi: VAULT_ABI,
    functionName: "usdtToken",
  });
}

export async function approveVaultToken(
  tokenAddress: `0x${string}`,
  amount: bigint,
) {
  return writeContract(config, {
    address: tokenAddress,
    abi: ERC20_APPROVE_ABI,
    functionName: "approve",
    args: [KRYPTPAY_CONTRACTS.vault, amount],
  });
}

export async function reloadCardOnchain({
  cardId,
  paymentToken,
  usdAmount,
  ethValue,
}: {
  cardId: bigint;
  paymentToken: number;
  usdAmount: bigint;
  ethValue?: bigint;
}) {
  return writeContract(config, {
    address: KRYPTPAY_CONTRACTS.vault,
    abi: VAULT_ABI,
    functionName: "reloadCard",
    args: [cardId, paymentToken, usdAmount],
    value: ethValue ?? 0n,
  });
}
export async function withdrawFromCardOnchain({
  cardId,
  paymentToken,
  usdAmount,
}: {
  cardId: bigint;
  paymentToken: number;
  usdAmount: bigint;
}) {
  return writeContract(config, {
    address: KRYPTPAY_CONTRACTS.vault,
    abi: VAULT_ABI,
    functionName: "withdrawFromCard",
    args: [
      cardId,
      paymentToken,
      usdAmount,
    ],
  });
}