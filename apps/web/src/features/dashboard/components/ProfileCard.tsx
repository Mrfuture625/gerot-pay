"use client";

import { useAccount } from "wagmi";
import { GlassPanel } from "@/components/shared/GlassPanel";

function shortAddress(address?: string) {
  if (!address) return "Wallet not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

type ProfileCardProps = {
  name: string;
  telegramUsername: string;
};

export function ProfileCard({
  name,
  telegramUsername,
}: ProfileCardProps) {
  const { address, isConnected } = useAccount();

  return (
    <GlassPanel>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {name}
          </h1>

          <p className="mt-2 text-zinc-400">
            @{telegramUsername}
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            {isConnected
              ? shortAddress(address)
              : "Wallet not connected"}
          </p>
        </div>

        <div className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300">
          ✓ Verified User
        </div>
      </div>
    </GlassPanel>
  );
}