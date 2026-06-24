import type { Hash } from "viem";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@/features/wallet/providers/WalletProvider";

export async function waitForPurchaseConfirmation(hash: Hash) {
  return waitForTransactionReceipt(config, {
    hash,
    confirmations: 1,
  });
}