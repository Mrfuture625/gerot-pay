"use client";

import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { getPublicClient } from "@wagmi/core";
import { useAccount } from "wagmi";

import { config } from "@/features/wallet/providers/WalletProvider";
import { VAULT_ABI } from "@kryptpay/contracts";
import { REWARD_CLAIM_ABI } from "@kryptpay/contracts";
import { KRYPTPAY_CONTRACTS } from "@kryptpay/contracts";

export function useDashboard() {
  const { address } = useAccount();

  const [loading, setLoading] = useState(true);

  const [cards, setCards] = useState<any[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);

  async function load() {
    if (!address) return;

    setLoading(true);

    try {
      const client = getPublicClient(config);

      if (!client) return;

      const ids = await client.readContract({
        address: KRYPTPAY_CONTRACTS.vault,
        abi: VAULT_ABI,
        functionName: "getUserCardIds",
        args: [address],
      });

      const loadedCards = [];

      let total = 0;

      for (const id of ids) {
        const card = await client.readContract({
          address: KRYPTPAY_CONTRACTS.vault,
          abi: VAULT_ABI,
          functionName: "getCard",
          args: [id],
        });

        loadedCards.push(card);

        total += Number(formatUnits(card.balanceUsd, 18));
      }

      setCards(loadedCards);
      setTotalBalance(total);

      const pending = await client.readContract({
        address: KRYPTPAY_CONTRACTS.rewardClaim,
        abi: REWARD_CLAIM_ABI,
        functionName: "getTotalPendingAmount",
        args: [address],
      });

      setTotalRewards(Number(formatUnits(pending, 18)));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [address]);

  return {
    loading,
    cards,
    totalBalance,
    totalRewards,
    refresh: load,
  };
}