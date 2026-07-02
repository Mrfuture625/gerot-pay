import { readContract, writeContract } from "@wagmi/core";
import { config } from "@/features/wallet/providers/WalletProvider";
import { KRYPTPAY_CONTRACTS } from "@kryptpay/contracts";
import { REWARD_CLAIM_ABI } from "@kryptpay/contracts";

export async function getUserRewards(address: `0x${string}`) {
  return readContract(config, {
    address: KRYPTPAY_CONTRACTS.rewardClaim,
    abi: REWARD_CLAIM_ABI,
    functionName: "getUserRewards",
    args: [address],
  });
}

export async function getClaimableAmount(address: `0x${string}`) {
  return readContract(config, {
    address: KRYPTPAY_CONTRACTS.rewardClaim,
    abi: REWARD_CLAIM_ABI,
    functionName: "getClaimableAmount",
    args: [address],
  });
}

export async function getLockedAmount(address: `0x${string}`) {
  return readContract(config, {
    address: KRYPTPAY_CONTRACTS.rewardClaim,
    abi: REWARD_CLAIM_ABI,
    functionName: "getLockedAmount",
    args: [address],
  });
}

export async function getTotalPendingAmount(address: `0x${string}`) {
  return readContract(config, {
    address: KRYPTPAY_CONTRACTS.rewardClaim,
    abi: REWARD_CLAIM_ABI,
    functionName: "getTotalPendingAmount",
    args: [address],
  });
}

export async function isRewardUnlocked(rewardId: bigint) {
  return readContract(config, {
    address: KRYPTPAY_CONTRACTS.rewardClaim,
    abi: REWARD_CLAIM_ABI,
    functionName: "isRewardUnlocked",
    args: [rewardId],
  });
}

export async function claimReward(rewardId: bigint) {
  return writeContract(config, {
    address: KRYPTPAY_CONTRACTS.rewardClaim,
    abi: REWARD_CLAIM_ABI,
    functionName: "claim",
    args: [rewardId],
  });
}

export async function claimInstantReward(rewardId: bigint) {
  return writeContract(config, {
    address: KRYPTPAY_CONTRACTS.rewardClaim,
    abi: REWARD_CLAIM_ABI,
    functionName: "claimInstant",
    args: [rewardId],
  });
}

export async function claimAllRewards() {
  return writeContract(config, {
    address: KRYPTPAY_CONTRACTS.rewardClaim,
    abi: REWARD_CLAIM_ABI,
    functionName: "claimAllUnlocked",
  });
}

export async function claimAllInstantRewards() {
  return writeContract(config, {
    address: KRYPTPAY_CONTRACTS.rewardClaim,
    abi: REWARD_CLAIM_ABI,
    functionName: "claimAllInstant",
  });
}