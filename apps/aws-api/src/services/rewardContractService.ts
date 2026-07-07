import "dotenv/config";
import { createPublicClient, createWalletClient, http, parseEventLogs } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { KRYPTPAY_CONTRACTS, REWARD_CLAIM_ABI } from "@kryptpay/contracts";

const rpcUrl = process.env.RPC_URL;
const privateKey = process.env.REWARD_MANAGER_PRIVATE_KEY as `0x${string}`;

if (!rpcUrl) throw new Error("RPC_URL is required");
if (!privateKey) throw new Error("REWARD_MANAGER_PRIVATE_KEY is required");

const account = privateKeyToAccount(privateKey);

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(rpcUrl),
});

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(rpcUrl),
});

export async function addSignupRewardOnchain(user: `0x${string}`) {
  const hash = await walletClient.writeContract({
    address: KRYPTPAY_CONTRACTS.rewardClaim,
    abi: REWARD_CLAIM_ABI,
    functionName: "addSignupReward",
    args: [user],
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  const logs = parseEventLogs({
    abi: REWARD_CLAIM_ABI,
    logs: receipt.logs,
    eventName: "RewardAdded",
  });

  const rewardLog = logs.find(
    (log) => log.args.user?.toLowerCase() === user.toLowerCase(),
  );

  return {
    txHash: hash,
    rewardId: rewardLog?.args.rewardId?.toString() ?? null,
    amountKpay: rewardLog?.args.amount
  ? (Number(rewardLog.args.amount) / 1e18).toString()
  : "0",
    createdAt: rewardLog?.args.createdAt?.toString() ?? null,
  };
}

export async function addVirtualCardRewardOnchain(user: `0x${string}`) {
  const hash = await walletClient.writeContract({
    address: KRYPTPAY_CONTRACTS.rewardClaim,
    abi: REWARD_CLAIM_ABI,
    functionName: "addVirtualCardReward",
    args: [user],
  });

  await publicClient.waitForTransactionReceipt({ hash });

  return { txHash: hash };
}

export async function addPhysicalCardRewardOnchain(user: `0x${string}`) {
  const hash = await walletClient.writeContract({
    address: KRYPTPAY_CONTRACTS.rewardClaim,
    abi: REWARD_CLAIM_ABI,
    functionName: "addPhysicalCardReward",
    args: [user],
  });

  await publicClient.waitForTransactionReceipt({ hash });

  return { txHash: hash };
}

export async function addReferralRewardOnchain(
  referrer: `0x${string}`,
  referee: `0x${string}`,
) {
  const hash = await walletClient.writeContract({
    address: KRYPTPAY_CONTRACTS.rewardClaim,
    abi: REWARD_CLAIM_ABI,
    functionName: "addReferralReward",
    args: [referrer, referee],
  });

  await publicClient.waitForTransactionReceipt({ hash });

  return { txHash: hash };
}