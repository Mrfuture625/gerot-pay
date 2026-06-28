"use client";

import { useState } from "react";
import {
  Copy,
  Gift,
  Link as LinkIcon,
  QrCode,
  Share2,
  Users,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type {
  ReferralHistoryItem,
  ReferralStats,
} from "@/types/referral";

export function ReferralDashboard({
  stats,
  history,
}: {
  stats: ReferralStats;
  history: ReferralHistoryItem[];
}) {
  const [copied, setCopied] = useState(false);

  async function copyReferralLink() {
    await navigator.clipboard.writeText(stats.referralLink);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Referral"
        title="Invite friends and earn GP rewards."
        description="Share your KryptPay referral link. When someone connects their wallet through your link, you earn GP rewards and they receive a joining bonus."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard icon={Users} label="Friends Joined" value={stats.friendsJoined} />
        <StatCard icon={Gift} label="GP Earned" value={`${stats.gpEarned} GP`} />
        <StatCard
          icon={Wallet}
          label="Pending Rewards"
          value={`${stats.pendingRewards} GP`}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3">
              <LinkIcon className="h-5 w-5 text-emerald-300" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold">Your Referral Link</h2>
              <p className="text-sm text-zinc-400">
                Share this link with new users.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Referral Code
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">
              {stats.referralCode}
            </p>
          </div>

          <div className="mt-4 rounded-3xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Referral Link
            </p>
            <p className="mt-2 break-all text-sm text-zinc-300">
              {stats.referralLink}
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              onClick={copyReferralLink}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-4 font-semibold text-black hover:bg-emerald-300"
            >
              <Copy className="h-5 w-5" />
              {copied ? "Copied" : "Copy Link"}
            </button>

            <button
              onClick={() => alert("Share feature will be connected later.")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-4 font-semibold text-zinc-300 hover:bg-white/10"
            >
              <Share2 className="h-5 w-5" />
              Share
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3">
              <QrCode className="h-5 w-5 text-cyan-300" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold">Referral QR</h2>
              <p className="text-sm text-zinc-400">
                QR placeholder for mobile sharing.
              </p>
            </div>
          </div>

          <div className="flex aspect-square items-center justify-center rounded-[2rem] border border-white/10 bg-black/30">
            <div className="grid h-44 w-44 grid-cols-5 gap-2 rounded-2xl bg-white p-4">
              {Array.from({ length: 25 }).map((_, index) => (
                <div
                  key={index}
                  className={`rounded-sm ${
                    index % 2 === 0 || index % 7 === 0
                      ? "bg-black"
                      : "bg-zinc-200"
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-zinc-500">
            Real QR generation will be connected later.
          </p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
        <div className="mb-5">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
            Referral History
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Recent invited wallets</h2>
        </div>

        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/25 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                  <Wallet className="h-5 w-5 text-emerald-300" />
                </div>

                <div>
                  <p className="font-semibold">{item.wallet}</p>
                  <p className="text-sm text-zinc-500">
                    Joined {item.joinedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <p className="font-semibold text-emerald-300">{item.reward}</p>
                <StatusBadge status={item.status} />
              </div>
            </div>
          ))}
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