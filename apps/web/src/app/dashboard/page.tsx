"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import {
  Activity,
  ArrowRight,
  Copy,
  CreditCard,
  Gift,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Upload,
  Wallet,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GerotCard } from "@/features/cards/components/GerotCard";
import { ConnectWalletButton } from "@/features/wallet/components/ConnectWalletButton";
import { NetworkWarning } from "@/features/wallet/components/NetworkWarning";

const dashboardData = {
  cards: 2,
  rewards: 230,
  bonusBalance: 20,
  totalReloaded: 150,
};

const recentActivity = [
  {
    title: "Virtual Card Purchased",
    detail: "10 GP reward added",
    time: "Today",
    icon: CreditCard,
  },
  {
    title: "Coupon Applied",
    detail: "WELCOME50 discount used",
    time: "Today",
    icon: Gift,
  },
  {
    title: "Card Reloaded",
    detail: "$25 added to Virtual Card",
    time: "Yesterday",
    icon: RefreshCw,
  },
  {
    title: "Referral Reward",
    detail: "+10 GP from invited wallet",
    time: "2 days ago",
    icon: Gift,
  },
];

function shortAddress(address?: `0x${string}`) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();

  async function copyWallet() {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    alert("Wallet address copied.");
  }

  return (
    <DashboardShell title="Dashboard" subtitle="KryptPay wallet overview">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.035] to-emerald-400/[0.08] p-6">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
                Welcome Back
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Manage your KryptPay cards from one wallet dashboard.
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
                Track cards, rewards, bonus balances, reloads, withdrawals and
                recent activity from a clean wallet-connected fintech dashboard.
              </p>

              <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-4">
                {!isConnected ? (
                  <div>
                    <p className="mb-3 text-sm text-zinc-400">
                      Connect your wallet to view your KryptPay account.
                    </p>
                    <ConnectWalletButton />
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3">
                        <Wallet className="h-5 w-5 text-emerald-300" />
                      </div>

                      <div>
                        <p className="text-sm text-zinc-500">
                          Connected Wallet
                        </p>
                        <p className="font-semibold">{shortAddress(address)}</p>
                      </div>
                    </div>

                    <button
                      onClick={copyWallet}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-zinc-300 hover:bg-white/10"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </button>
                  </div>
                )}
              </div>
            </div>

            <GerotCard variant="virtual" />
          </div>
        </section>

        <NetworkWarning />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            icon={CreditCard}
            label="Cards"
            value={dashboardData.cards}
            note="Virtual & Physical"
          />

          <OverviewCard
            icon={Gift}
            label="GP Rewards"
            value={`${dashboardData.rewards} GP`}
            note="Total earned"
          />

          <OverviewCard
            icon={ShieldCheck}
            label="Bonus Balance"
            value={`$${dashboardData.bonusBalance}`}
            note="Locked + active"
          />

          <OverviewCard
            icon={RefreshCw}
            label="Total Reloaded"
            value={`$${dashboardData.totalReloaded}`}
            note="Across all cards"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
                  Quick Actions
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Move faster</h2>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <QuickAction
                href="/marketplace"
                icon={ShoppingBag}
                title="Marketplace"
                text="Buy card"
              />

              <QuickAction
                href="/reload"
                icon={RefreshCw}
                title="Reload"
                text="Add funds"
              />

              <QuickAction
                href="/withdraw"
                icon={Upload}
                title="Withdraw"
                text="Move funds"
              />

              <QuickAction
                href="/referrals"
                icon={Gift}
                title="Referral"
                text="Earn GP"
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
                  Your Cards
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Active KryptPay cards
                </h2>
              </div>

              <Link
                href="/cards"
                className="text-sm text-emerald-300 hover:text-emerald-200"
              >
                View all
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <UserCardSummary
                type="Virtual Card"
                balance="$34.20"
                bonus="$5 Locked"
                href="/cards"
              />

              <UserCardSummary
                type="Physical Card"
                balance="$102.50"
                bonus="$15 Active"
                href="/cards"
              />
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
                Recent Activity
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Latest updates</h2>
            </div>

            <Link
              href="/activity"
              className="text-sm text-emerald-300 hover:text-emerald-200"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivity.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-black/25 p-4"
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

                  <p className="text-sm text-zinc-500">{item.time}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function OverviewCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof CreditCard;
  label: string;
  value: string | number;
  note: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-emerald-400/30">
      <div className="mb-6 flex items-center justify-between">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
          <Icon className="h-5 w-5 text-emerald-300" />
        </div>
      </div>

      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{note}</p>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  text,
}: {
  href: string;
  icon: typeof CreditCard;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-white/10 bg-black/25 p-5 transition hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-emerald-400/10"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
          <Icon className="h-5 w-5 text-emerald-300" />
        </div>

        <ArrowRight className="h-4 w-4 text-zinc-500 transition group-hover:translate-x-1 group-hover:text-emerald-300" />
      </div>

      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-zinc-500">{text}</p>
    </Link>
  );
}

function UserCardSummary({
  type,
  balance,
  bonus,
  href,
}: {
  type: string;
  balance: string;
  bonus: string;
  href: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
      <GerotCard
        variant={type.toLowerCase().includes("physical") ? "physical" : "virtual"}
        className="rounded-[1.5rem]"
      />

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="font-semibold">{type}</p>
          <p className="mt-1 text-sm text-zinc-500">Balance {balance}</p>
          <p className="text-sm text-zinc-500">Bonus {bonus}</p>
        </div>

        <Link
          href={href}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-emerald-300 hover:bg-white/10"
        >
          View
        </Link>
      </div>
    </div>
  );
}