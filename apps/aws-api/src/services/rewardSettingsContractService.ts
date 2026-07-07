import "dotenv/config";
import {
  createPublicClient,
  createWalletClient,
  formatUnits,
  http,
  parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { KRYPTPAY_CONTRACTS, REWARD_CLAIM_ABI } from "@kryptpay/contracts";

const rpcUrl = process.env.RPC_URL;
const privateKey = (
  process.env.REWARD_MANAGER_PRIVATE_KEY ||
  process.env.MARKETPLACE_OWNER_PRIVATE_KEY
) as `0x${string}` | undefined;

function getClients() {
  if (!rpcUrl) throw new Error("RPC_URL is required");
  if (!privateKey) throw new Error("Owner private key is required");

  const account = privateKeyToAccount(privateKey);

  return {
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

export async function getRewardSettingsOnchain() {
  const { publicClient } = getClients();

  const [
    signupReward,
    referralReward,
    virtualCardReward,
    physicalCardReward,
    claimDelay,
    instantClaimFee,
  ] = await Promise.all([
    publicClient.readContract({
      address: KRYPTPAY_CONTRACTS.rewardClaim,
      abi: REWARD_CLAIM_ABI,
      functionName: "signupRewardAmount",
    }),
    publicClient.readContract({
      address: KRYPTPAY_CONTRACTS.rewardClaim,
      abi: REWARD_CLAIM_ABI,
      functionName: "referralRewardAmount",
    }),
    publicClient.readContract({
      address: KRYPTPAY_CONTRACTS.rewardClaim,
      abi: REWARD_CLAIM_ABI,
      functionName: "virtualCardRewardAmount",
    }),
    publicClient.readContract({
      address: KRYPTPAY_CONTRACTS.rewardClaim,
      abi: REWARD_CLAIM_ABI,
      functionName: "physicalCardRewardAmount",
    }),
    publicClient.readContract({
      address: KRYPTPAY_CONTRACTS.rewardClaim,
      abi: REWARD_CLAIM_ABI,
      functionName: "claimDelay",
    }),
    publicClient.readContract({
      address: KRYPTPAY_CONTRACTS.rewardClaim,
      abi: REWARD_CLAIM_ABI,
      functionName: "instantClaimFee",
    }),
  ]);

  return {
    signupReward: Number(formatUnits(signupReward as bigint, 18)),
    referralReward: Number(formatUnits(referralReward as bigint, 18)),
    virtualCardReward: Number(formatUnits(virtualCardReward as bigint, 18)),
    physicalCardReward: Number(formatUnits(physicalCardReward as bigint, 18)),
    claimDelaySeconds: Number(claimDelay),
    instantClaimFee: Number(formatUnits(instantClaimFee as bigint, 18)),
  };
}

export async function setRewardAmountsOnchain(input: {
  signupReward: number;
  referralReward: number;
  virtualCardReward: number;
  physicalCardReward: number;
}) {
  const { publicClient, walletClient } = getClients();

  const hash = await walletClient.writeContract({
    address: KRYPTPAY_CONTRACTS.rewardClaim,
    abi: REWARD_CLAIM_ABI,
    functionName: "setRewardAmounts",
    args: [
      parseUnits(String(input.signupReward), 18),
      parseUnits(String(input.referralReward), 18),
      parseUnits(String(input.virtualCardReward), 18),
      parseUnits(String(input.physicalCardReward), 18),
    ],
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  return {
    txHash: hash,
    status: receipt.status,
  };
}