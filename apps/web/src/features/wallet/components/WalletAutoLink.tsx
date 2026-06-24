"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";

export function WalletAutoLink() {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    async function linkWallet() {
      if (!isConnected || !address) return;

      await fetch("/api/wallet/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: address,
        }),
      });
    }

    linkWallet();
  }, [address, isConnected]);

  return null;
}