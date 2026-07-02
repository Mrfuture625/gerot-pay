"use client";

import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { Clock, Gift, Lock, Rocket, ShieldCheck, Wallet } from "lucide-react";
import { useAccount } from "wagmi";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConnectWalletButton } from "@/features/wallet/components/ConnectWalletButton";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/features/wallet/providers/WalletProvider";
import {
  claimInstantReward,
  claimReward,
  getClaimableAmount,
  getLockedAmount,
  getTotalPendingAmount,
  getUserRewards,
  isRewardUnlocked,
  claimAllRewards,
claimAllInstantRewards,
getRewardUnlockTime,
} from "@/lib/services/rewardService";
import { appToast } from "@/lib/toast";

type RewardRecord = {
  id: bigint;
  user: string;
  amount: bigint;
  rewardType: number;
  createdAt: bigint;
  claimed: boolean;
  claimedInstantly: boolean;
};

const rewardTypeLabels = [
  "Signup Reward",
  "Referral Reward",
  "Virtual Card Reward",
  "Physical Card Reward",
  "Promotion Reward",
  "Manual Reward",
];

function formatKpay(value: bigint) {
  return Number(formatUnits(value, 18)).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

function formatUnlockTime(unlockTime: bigint | undefined, now: number) {
  if (!unlockTime) return "Unlock time unavailable";

  const diffMs = Number(unlockTime) * 1000 - now;

  if (diffMs <= 0) return "Available now";

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `Unlocks in ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function getRewardLabel(type: number) {
  return rewardTypeLabels[type] ?? "KPAY Reward";
}

export function ClaimRewards() {
  const { address, isConnected } = useAccount();

  const [rewards, setRewards] = useState<RewardRecord[]>([]);
  const [totalPending, setTotalPending] = useState<bigint>(0n);
  const [claimable, setClaimable] = useState<bigint>(0n);
  const [locked, setLocked] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);
  const [claimingId, setClaimingId] = useState<bigint | null>(null);
  const [unlockedRewardIds, setUnlockedRewardIds] = useState<Set<string>>(new Set());
  const [rewardUnlockTimes, setRewardUnlockTimes] = useState<Record<string, bigint>>({});
  const [claimingAll, setClaimingAll] = useState(false);
  const [now, setNow] = useState(Date.now());

  async function loadRewards() {
    if (!address) return;

    setLoading(true);

    try {
      const [rewardList, pendingAmount, claimableAmount, lockedAmount] =
        await Promise.all([
          getUserRewards(address),
          getTotalPendingAmount(address),
          getClaimableAmount(address),
          getLockedAmount(address),
        ]);

      const rewardArray = [...(rewardList as RewardRecord[])].reverse();

const rewardStatuses = await Promise.all(
  rewardArray.map(async (reward) => {
    const [unlocked, unlockTime] = await Promise.all([
      isRewardUnlocked(reward.id),
      getRewardUnlockTime(reward.id),
    ]);

    return {
      id: reward.id.toString(),
      unlocked: unlocked as boolean,
      unlockTime: unlockTime as bigint,
    };
  }),
);

setUnlockedRewardIds(
  new Set(
    rewardStatuses
      .filter((item) => item.unlocked)
      .map((item) => item.id),
  ),
);

setRewardUnlockTimes(
  Object.fromEntries(
    rewardStatuses.map((item) => [item.id, item.unlockTime]),
  ),
);

setRewards(rewardArray);
setTotalPending(pendingAmount as bigint);
setClaimable(claimableAmount as bigint);
setLocked(lockedAmount as bigint);
    } catch (error) {
      console.error(error);
      appToast.error("Failed to load rewards from contract.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRewards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
  const timer = setInterval(() => {
    setNow(Date.now());
  }, 1000);

  return () => clearInterval(timer);
}, []);

  async function handleClaim(id: bigint) {
    setClaimingId(id);

appToast.loading("Waiting for wallet confirmation...", "claim");

    try {
      const hash = await claimReward(id);
await waitForTransactionReceipt(config, { hash });
await loadRewards();

      appToast.success("Reward claimed successfully.", "claim");
    } catch (error) {
      console.error(error);
      appToast.error("Claim failed or transaction was rejected.", "claim");
    } finally {
      setClaimingId(null);
    }
  }

  async function handleInstantClaim(id: bigint) {
    setClaimingId(id);

appToast.loading("Waiting for wallet confirmation...", "claim");

    try {
     const hash = await claimInstantReward(id);
await waitForTransactionReceipt(config, { hash });
await loadRewards();

      appToast.success("Reward claimed instantly.", "claim");
    } catch (error) {
      console.error(error);
      appToast.error(
  "Instant claim failed or transaction was rejected.",
  "claim",
);
    } finally {
      setClaimingId(null);
    }
  }

  async function handleClaimAll() {
  setClaimingAll(true);

  appToast.loading("Waiting for wallet confirmation...", "claim-all");

  try {
    const hash = await claimAllRewards();
await waitForTransactionReceipt(config, { hash });
await loadRewards();

    appToast.success("All unlocked rewards claimed.", "claim-all");
  } catch (error) {
    console.error(error);

    appToast.error("Failed to claim rewards.", "claim-all");
  } finally {
    setClaimingAll(false);
  }
}

async function handleClaimAllInstant() {
  setClaimingAll(true);

  appToast.loading("Waiting for wallet confirmation...", "claim-all");

  try {
    const hash = await claimAllInstantRewards();
await waitForTransactionReceipt(config, { hash });
await loadRewards();

    appToast.success("All rewards claimed instantly.", "claim-all");
  } catch (error) {
    console.error(error);

    appToast.error("Instant claim failed.", "claim-all");
  } finally {
    setClaimingAll(false);
  }
}

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="KPAY Rewards"
        title="Claim your KryptPay rewards."
        description="Track signup rewards, referral rewards and card purchase rewards. Claim for free after the delay or claim early with the instant fee."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <RewardStat
          icon={Gift}
          label="Total Pending"
          value={`${formatKpay(totalPending)} KPAY`}
        />
        <RewardStat
          icon={ShieldCheck}
          label="Claimable Now"
          value={`${formatKpay(claimable)} KPAY`}
        />
        <RewardStat
          icon={Lock}
          label="Locked Rewards"
          value={`${formatKpay(locked)} KPAY`}
        />
      </section>

      {!isConnected ? (
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-4 flex items-center gap-3">
            <Wallet className="h-6 w-6 text-emerald-300" />
            <div>
              <h2 className="text-xl font-semibold">Connect wallet</h2>
              <p className="text-sm text-zinc-400">
                Connect your wallet to view and claim KPAY rewards.
              </p>
            </div>
          </div>
          <ConnectWalletButton />
        </section>
      ) : (
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
                Reward Records
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Your claim history</h2>
            </div>

            <button
              onClick={loadRewards}
              disabled={loading}
              className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/10 disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

<div className="flex gap-2">
  <button
    onClick={handleClaimAll}
    disabled={claimingAll}
    className="rounded-2xl bg-emerald-400 px-4 py-2 font-semibold text-black"
  >
    Claim All
  </button>

  <button
    onClick={handleClaimAllInstant}
    disabled={claimingAll}
    className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 font-semibold text-amber-300"
  >
    Instant Claim All
  </button>
</div>

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-black/25 p-10 text-center text-zinc-400">
              Loading rewards from contract...
            </div>
          ) : rewards.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-black/25 p-10 text-center text-zinc-400">
              No KPAY rewards found for this wallet yet.
            </div>
          ) : (
            <div className="space-y-3">
              {rewards.map((reward) => {
                const isClaimed = reward.claimed;
                const isClaimable =
  !isClaimed && unlockedRewardIds.has(reward.id.toString());
                const isLocked = !isClaimed && !isClaimable;

                return (
                  <div
                    key={reward.id.toString()}
                    className="rounded-3xl border border-white/10 bg-black/25 p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                          {isClaimed ? (
                            <ShieldCheck className="h-5 w-5 text-emerald-300" />
                          ) : isLocked ? (
                            <Clock className="h-5 w-5 text-amber-300" />
                          ) : (
                            <Gift className="h-5 w-5 text-emerald-300" />
                          )}
                        </div>

                        <div>
  <p className="font-semibold">
    {getRewardLabel(Number(reward.rewardType))}
  </p>

  <p className="text-sm text-zinc-500">
    {formatKpay(reward.amount)} KPAY •{" "}
    {isClaimed
      ? reward.claimedInstantly
        ? "Claimed instantly"
        : "Claimed"
      : isLocked
        ? "Locked"
        : "Ready to claim"}
  </p>

  {!isClaimed && (
    <p className="mt-1 text-xs text-zinc-500">
      {formatUnlockTime(rewardUnlockTimes[reward.id.toString()], now)}
    </p>
  )}
</div>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        {isClaimed ? (
                          <span className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-center font-semibold text-emerald-300">
                            Claimed
                          </span>
                        ) : isClaimable ? (
                          <button
                            onClick={() => handleClaim(reward.id)}
                            disabled={claimingId === reward.id}
                            className="rounded-2xl bg-emerald-400 px-5 py-3 font-semibold text-black hover:bg-emerald-300 disabled:opacity-60"
                          >
                            {claimingId === reward.id ? "Claiming..." : "Claim Free"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleInstantClaim(reward.id)}
                            disabled={claimingId === reward.id}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-3 font-semibold text-amber-300 hover:bg-amber-400/20 disabled:opacity-60"
                          >
                            <Rocket className="h-4 w-4" />
                            {claimingId === reward.id
                              ? "Claiming..."
                              : "Claim Instant $1"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function RewardStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gift;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-6 w-fit rounded-2xl border border-white/10 bg-black/30 p-3">
        <Icon className="h-5 w-5 text-emerald-300" />
      </div>
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}