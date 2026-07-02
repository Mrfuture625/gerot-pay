"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Copy,
  Gift,
  Link as LinkIcon,
  QrCode,
  Share2,
  Users,
  Wallet,
} from "lucide-react";
import { formatUnits } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import { PageHeader } from "@/components/shared/PageHeader";
import { REWARD_CLAIM_ABI } from "@kryptpay/contracts";
import { KRYPTPAY_CONTRACTS } from "@kryptpay/contracts";
import { getTelegramStatus } from "@/lib/services/telegramService";

export function ReferralDashboard() {
  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState({
  telegramCompleted: false,
  signupRewardEligible: false,
  telegramUsername: null as string | null,
});

  const rewardContract = {
    address: KRYPTPAY_CONTRACTS.rewardClaim,
    abi: REWARD_CLAIM_ABI,
  } as const;

  const { data, isLoading } = useReadContracts({
    contracts: address
      ? [
          {
            ...rewardContract,
            functionName: "referralCount",
            args: [address],
          },
          {
            ...rewardContract,
            functionName: "totalEarned",
            args: [address],
          },
          {
            ...rewardContract,
            functionName: "getTotalPendingAmount",
            args: [address],
          },
          {
            ...rewardContract,
            functionName: "referralRewardAmount",
          },
        ]
      : [],
    query: {
      enabled: Boolean(address),
    },
  });

  const friendsJoined = data?.[0]?.result ? Number(data[0].result) : 0;
  const totalEarned = data?.[1]?.result ? formatUnits(data[1].result, 18) : "0";
  const pendingRewards = data?.[2]?.result
    ? formatUnits(data[2].result, 18)
    : "0";
  const referralReward = data?.[3]?.result
    ? formatUnits(data[3].result, 18)
    : "0";

  const referralCode = useMemo(() => {
    if (!address) return "CONNECT-WALLET";
    return `KPAY-${address.slice(2, 8).toUpperCase()}`;
  }, [address]);

  const referralLink = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/?ref=${address}`;
  }, [referralCode]);

  useEffect(() => {
  async function loadTelegramStatus() {
    if (!address) return;

    const status = await getTelegramStatus(address);
    setTelegramStatus(status);
  }

  loadTelegramStatus();
}, [address]);

  async function copyReferralLink() {
    if (!isConnected || !referralLink) return;

    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function shareReferralLink() {
    if (!isConnected || !referralLink) return;

    if (navigator.share) {
      await navigator.share({
        title: "Join KryptPay",
        text: "Use my KryptPay referral link.",
        url: referralLink,
      });
    } else {
      await copyReferralLink();
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Referral"
        title="Invite friends and earn GP rewards."
        description="Share your KryptPay referral link. Referral rewards are read directly from the reward contract."
      />

      {!isConnected && (
        <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-5 text-sm text-yellow-200">
          Connect your wallet to view your real referral rewards.
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Users}
          label="Friends Joined"
          value={isLoading ? "Loading..." : friendsJoined}
        />
        <StatCard
          icon={Gift}
          label="Total GP Earned"
          value={isLoading ? "Loading..." : `${Number(totalEarned).toLocaleString()} GP`}
        />
        <StatCard
          icon={Wallet}
          label="Pending Rewards"
          value={isLoading ? "Loading..." : `${Number(pendingRewards).toLocaleString()} GP`}
        />
      </section>

      <section className="grid gap-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3">
              <LinkIcon className="h-5 w-5 text-emerald-300" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold">Your Referral Link</h2>
              <p className="text-sm text-zinc-400">
                Current reward per referral: {Number(referralReward).toLocaleString()} GP
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Referral Code
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">
              {referralCode}
            </p>
          </div>

          <div className="mt-4 rounded-3xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Referral Link
            </p>
            <p className="mt-2 break-all text-sm text-zinc-300">
              {isConnected ? referralLink : "Connect wallet to generate link"}
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              onClick={copyReferralLink}
              disabled={!isConnected}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-4 font-semibold text-black hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Copy className="h-5 w-5" />
              {copied ? "Copied" : "Copy Link"}
            </button>

            <button
              onClick={shareReferralLink}
              disabled={!isConnected}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-4 font-semibold text-zinc-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Share2 className="h-5 w-5" />
              Share
            </button>
          </div>
        </div>

        
      </section>

<section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
  <div className="mb-4">
    <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
      Telegram Task
    </p>
    <h2 className="mt-2 text-2xl font-semibold">Signup reward eligibility</h2>

    <button
  type="button"
  onClick={async () => {
    if (!address) return;
    const status = await getTelegramStatus(address);
    setTelegramStatus(status);
  }}
  className="mt-4 rounded-2xl border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/10"
>
  Refresh Telegram Status
</button>

  </div>

  <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
    {telegramStatus.telegramCompleted ? (
      <div>
        <p className="font-semibold text-emerald-300">
          Telegram task completed ✅
        </p>
        <p className="mt-2 text-sm text-zinc-400">
          Username: @{telegramStatus.telegramUsername ?? "linked"}
        </p>
      </div>
    ) : (
      <div>
        <p className="font-semibold text-amber-300">
          Telegram task not completed
        </p>
        <p className="mt-2 text-sm text-zinc-400">
          Complete the Telegram task to become eligible for the signup KPAY reward.
        </p>
      </div>
    )}
  </div>
</section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
        <div className="mb-5">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
            Referral History
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Recent invited wallets</h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/25 p-5 text-sm text-zinc-500">
          Referral count is now read from the contract. Individual referred
          wallet history will require backend event indexing later.
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gift;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-6 w-fit rounded-2xl border border-white/10 bg-black/30 p-3">
        <Icon className="h-5 w-5 text-emerald-300" />
      </div>

      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}