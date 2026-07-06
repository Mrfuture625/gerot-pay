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

const CARD_TYPE = {
  virtual: 0,
  physical: 1,
} as const;

function getClients() {
  if (!rpcUrl) throw new Error("RPC_URL is required");
  if (!privateKey) throw new Error("Owner private key is required");

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

function normalizeCardType(cardType: string) {
  const type = cardType.toLowerCase();

  if (type !== "virtual" && type !== "physical") {
    throw new Error("Invalid card type");
  }

  return type as "virtual" | "physical";
}

export async function getCardPricesOnchain() {
  const { publicClient } = getClients();

  const [virtualPrice, physicalPrice] = await Promise.all([
    publicClient.readContract({
      address: KRYPTPAY_CONTRACTS.cardMarketplace,
      abi: MARKETPLACE_ABI,
      functionName: "getCardPriceUsd",
      args: [CARD_TYPE.virtual],
    }),
    publicClient.readContract({
      address: KRYPTPAY_CONTRACTS.cardMarketplace,
      abi: MARKETPLACE_ABI,
      functionName: "getCardPriceUsd",
      args: [CARD_TYPE.physical],
    }),
  ]);

  return {
    virtual: Number(virtualPrice),
    physical: Number(physicalPrice),
  };
}

export async function setCardPriceOnchain(cardType: string, priceUsd: number) {
  const type = normalizeCardType(cardType);

  if (!Number.isFinite(priceUsd) || priceUsd <= 0) {
    throw new Error("Invalid price");
  }

  const roundedPrice = Math.round(priceUsd);

  const { publicClient, walletClient } = getClients();

  const hash = await walletClient.writeContract({
    address: KRYPTPAY_CONTRACTS.cardMarketplace,
    abi: MARKETPLACE_ABI,
    functionName: "setCardPrice",
    args: [CARD_TYPE[type], BigInt(roundedPrice)],
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  return {
    txHash: hash,
    status: receipt.status,
    cardType: type,
    priceUsd: roundedPrice,
  };
}