"use client";

import { useAccount, useBalance } from "wagmi";
import { sepolia } from "wagmi/chains";
import { GlassPanel } from "@/components/shared/GlassPanel";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletSummaryCard() {
  const { address, isConnected } = useAccount();

  const { data: balance } = useBalance({
    address,
    chainId: sepolia.id,
  });

  return (
    <GlassPanel>
      <p className="text-sm text-zinc-400">Wallet</p>

      <h2 className="mt-3 text-2xl font-semibold">
        {isConnected && address ? shortAddress(address) : "Not connected"}
      </h2>

      <p className="mt-2 text-sm text-zinc-500">
        {balance ? `${balance.formatted} ${balance.symbol}` : "Sepolia ETH balance"}
      </p>
    </GlassPanel>
  );
}