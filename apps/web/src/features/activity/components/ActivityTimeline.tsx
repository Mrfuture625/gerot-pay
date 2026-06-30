"use client";

import { useEffect, useMemo, useState } from "react";
import { formatUnits, parseAbiItem } from "viem";
import { getPublicClient } from "@wagmi/core";
import { useAccount } from "wagmi";
import {
  CreditCard,
  Gift,
  RefreshCw,
  Upload,
  Wallet,
  ShoppingBag,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConnectWalletButton } from "@/features/wallet/components/ConnectWalletButton";
import { config } from "@/features/wallet/providers/WalletProvider";
import { KRYPTPAY_CONTRACTS } from "@/lib/contracts/kryptpay";
import { appToast } from "@/lib/toast";

type Filter = "all" | "purchase" | "reload" | "withdraw" | "reward";

type ChainActivity = {
  id: string;
  type: Filter;
  title: string;
  detail: string;
  amount: string;
  time: string;
  blockNumber: bigint;
  icon: typeof CreditCard;
};

const filters: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Purchases", value: "purchase" },
  { label: "Reloads", value: "reload" },
  { label: "Withdrawals", value: "withdraw" },
  { label: "Rewards", value: "reward" },
];

function formatUsd(value: bigint) {
  return `$${Number(formatUnits(value, 18)).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
}

function formatKpay(value: bigint) {
  return `${Number(formatUnits(value, 18)).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })} KPAY`;
}

function formatTime(timestamp?: bigint) {
  if (!timestamp) return "On-chain";
  return new Date(Number(timestamp) * 1000).toLocaleString();
}

function cardTypeLabel(value: number) {
  return value === 1 ? "Physical Card" : "Virtual Card";
}

function rewardTypeLabel(value: number) {
  return (
    [
      "Signup Reward",
      "Referral Reward",
      "Virtual Card Reward",
      "Physical Card Reward",
      "Promotion Reward",
      "Manual Reward",
    ][value] ?? "KPAY Reward"
  );
}

export function ActivityTimeline() {
  const { address, isConnected } = useAccount();

  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [items, setItems] = useState<ChainActivity[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return items;
    return items.filter((item) => item.type === activeFilter);
  }, [items, activeFilter]);

  async function loadActivity() {
    if (!address) return;

    setLoading(true);

    try {
      const client = getPublicClient(config);
      if (!client) throw new Error("Public client not found");

      const latestBlock = await client.getBlockNumber();
      const fromBlock = latestBlock > 9_000n ? latestBlock - 9_000n : 0n;

      const [
        purchases,
        reloads,
        withdrawals,
        rewardsAdded,
        rewardsClaimed,
      ] = await Promise.all([
        client.getLogs({
          address: KRYPTPAY_CONTRACTS.cardMarketplace,
          event: parseAbiItem(
            "event CardPurchased(uint256 indexed purchaseId,address indexed buyer,uint8 indexed cardType,uint8 paymentToken,uint256 originalPriceUsd,uint256 finalPriceUsd,uint256 paidAmount,uint256 couponId,uint256 timestamp)",
          ),
          args: { buyer: address },
          fromBlock,
          toBlock: "latest",
        }),

        client.getLogs({
          address: KRYPTPAY_CONTRACTS.vault,
          event: parseAbiItem(
            "event CardReloaded(uint256 indexed cardId,address indexed user,uint8 indexed paymentToken,uint256 usdAmount,uint256 paidAmount,uint256 timestamp)",
          ),
          args: { user: address },
          fromBlock,
          toBlock: "latest",
        }),

        client.getLogs({
          address: KRYPTPAY_CONTRACTS.vault,
          event: parseAbiItem(
            "event CardWithdrawn(uint256 indexed cardId,address indexed user,uint8 indexed paymentToken,uint256 usdAmount,uint256 receivedAmount,uint256 timestamp)",
          ),
          args: { user: address },
          fromBlock,
          toBlock: "latest",
        }),

        client.getLogs({
          address: KRYPTPAY_CONTRACTS.rewardClaim,
          event: parseAbiItem(
            "event RewardAdded(uint256 indexed rewardId,address indexed user,uint256 amount,uint8 rewardType,uint256 createdAt)",
          ),
          args: { user: address },
          fromBlock,
          toBlock: "latest",
        }),

        client.getLogs({
          address: KRYPTPAY_CONTRACTS.rewardClaim,
          event: parseAbiItem(
            "event RewardClaimed(uint256 indexed rewardId,address indexed user,uint256 amount,bool instantClaim)",
          ),
          args: { user: address },
          fromBlock,
          toBlock: "latest",
        }),
      ]);

      const mapped: ChainActivity[] = [
        ...purchases.map((log) => ({
          id: `${log.transactionHash}-${log.logIndex}`,
          type: "purchase" as const,
          title: `${cardTypeLabel(Number(log.args.cardType))} Purchased`,
          detail: `Purchase #${log.args.purchaseId?.toString()}`,
          amount: formatUsd(log.args.finalPriceUsd ?? 0n),
          time: formatTime(log.args.timestamp),
          blockNumber: log.blockNumber ?? 0n,
          icon: ShoppingBag,
        })),

        ...reloads.map((log) => ({
          id: `${log.transactionHash}-${log.logIndex}`,
          type: "reload" as const,
          title: "Card Reloaded",
          detail: `Card #${log.args.cardId?.toString()}`,
          amount: formatUsd(log.args.usdAmount ?? 0n),
          time: formatTime(log.args.timestamp),
          blockNumber: log.blockNumber ?? 0n,
          icon: RefreshCw,
        })),

        ...withdrawals.map((log) => ({
          id: `${log.transactionHash}-${log.logIndex}`,
          type: "withdraw" as const,
          title: "Card Withdrawn",
          detail: `Card #${log.args.cardId?.toString()}`,
          amount: formatUsd(log.args.usdAmount ?? 0n),
          time: formatTime(log.args.timestamp),
          blockNumber: log.blockNumber ?? 0n,
          icon: Upload,
        })),

        ...rewardsAdded.map((log) => ({
          id: `${log.transactionHash}-${log.logIndex}`,
          type: "reward" as const,
          title: rewardTypeLabel(Number(log.args.rewardType)),
          detail: `Reward #${log.args.rewardId?.toString()} added`,
          amount: `+${formatKpay(log.args.amount ?? 0n)}`,
          time: formatTime(log.args.createdAt),
          blockNumber: log.blockNumber ?? 0n,
          icon: Gift,
        })),

        ...rewardsClaimed.map((log) => ({
          id: `${log.transactionHash}-${log.logIndex}`,
          type: "reward" as const,
          title: "Reward Claimed",
          detail: log.args.instantClaim ? "Instant claim" : "Free claim",
          amount: formatKpay(log.args.amount ?? 0n),
          time: "On-chain",
          blockNumber: log.blockNumber ?? 0n,
          icon: Gift,
        })),
      ];

      mapped.sort((a, b) => Number(b.blockNumber - a.blockNumber));
      setItems(mapped);
    } catch (error) {
  console.error("Activity Error:", error);

  appToast.error(
    error instanceof Error
      ? error.message
      : "Failed to load activity.",
  );
} finally {
  setLoading(false);
}
  }

  useEffect(() => {
    loadActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Activity"
        title="Wallet activity timeline."
        description="Track card purchases, reloads, withdrawals and rewards directly from your KryptPay smart contracts."
      />

      {!isConnected ? (
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-4 flex items-center gap-3">
            <Wallet className="h-6 w-6 text-emerald-300" />
            <div>
              <h2 className="text-xl font-semibold">Connect wallet</h2>
              <p className="text-sm text-zinc-400">
                Connect your wallet to view on-chain activity.
              </p>
            </div>
          </div>
          <ConnectWalletButton />
        </section>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                    isActive
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 text-zinc-400 hover:bg-white/10"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}

            <button
              onClick={loadActivity}
              disabled={loading}
              className="whitespace-nowrap rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-400 hover:bg-white/10 disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            {loading ? (
              <div className="rounded-3xl border border-white/10 bg-black/25 p-10 text-center text-zinc-400">
                Loading on-chain activity...
              </div>
            ) : filteredItems.length ? (
              <div className="space-y-3">
                {filteredItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/25 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                          <Icon className="h-5 w-5 text-emerald-300" />
                        </div>

                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-sm text-zinc-500">{item.detail}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">{item.amount}</p>
                        <p className="text-sm text-zinc-500">{item.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-black/25 p-10 text-center text-zinc-400">
                No on-chain activity found for this wallet yet.
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}