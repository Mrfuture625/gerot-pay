"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import {
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
import { KryptPayCard } from "@/features/cards/components/KryptPayCard";
import { ConnectWalletButton } from "@/features/wallet/components/ConnectWalletButton";
import { NetworkWarning } from "@/features/wallet/components/NetworkWarning";
import { getCard, getUserCardIds } from "@/lib/services/vaultService";
import {
  getClaimableAmount,
  getLockedAmount,
  getTotalPendingAmount,
} from "@/lib/services/rewardService";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { appToast } from "@/lib/toast";

type VaultCard = {
  cardId: bigint;
  owner: string;
  cardType: number;
  balanceUsd: bigint;
  totalReloadedUsd: bigint;
  totalWithdrawnUsd: bigint;
  active: boolean;
  frozen: boolean;
  createdAt: bigint;
  lastActivityAt: bigint;
};

function shortAddress(address?: `0x${string}`) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatUsd(value: bigint) {
  return Number(formatUnits(value, 18)).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

function formatKpay(value: bigint) {
  return Number(formatUnits(value, 18)).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

function cardName(cardType: number) {
  return cardType === 1 ? "Physical Card" : "Virtual Card";
}

function cardVariant(cardType: number): "virtual" | "physical" {
  return cardType === 1 ? "physical" : "virtual";
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  

  const [cards, setCards] = useState<VaultCard[]>([]);
  const [pendingRewards, setPendingRewards] = useState<bigint>(0n);
  const [claimableRewards, setClaimableRewards] = useState<bigint>(0n);
  const [lockedRewards, setLockedRewards] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);

  const totalBalance = useMemo(
    () => cards.reduce((sum, card) => sum + card.balanceUsd, 0n),
    [cards],
  );

  const totalReloaded = useMemo(
    () => cards.reduce((sum, card) => sum + card.totalReloadedUsd, 0n),
    [cards],
  );

  const totalWithdrawn = useMemo(
    () => cards.reduce((sum, card) => sum + card.totalWithdrawnUsd, 0n),
    [cards],
  );

  const latestCards = cards.slice(0, 2);

  async function loadDashboard() {
    if (!address) return;

    setLoading(true);

    try {
      const [ids, pending, claimable, locked] = await Promise.all([
        getUserCardIds(address),
        getTotalPendingAmount(address),
        getClaimableAmount(address),
        getLockedAmount(address),
      ]);

      const loadedCards = await Promise.all(
        (ids as bigint[]).map(async (id) => {
          return (await getCard(id)) as unknown as VaultCard;
        }),
      );

      setCards(loadedCards);
      setPendingRewards(pending as bigint);
      setClaimableRewards(claimable as bigint);
      setLockedRewards(locked as bigint);
    } catch (error) {
      console.error(error);
      appToast.error("Failed to load dashboard data from contracts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  async function copyWallet() {
    if (!address) return;
    await navigator.clipboard.writeText(address);
   appToast.success("Wallet address copied.");
  }

  return (
    <DashboardShell title="Dashboard" subtitle="">
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
                Track live Vault balances, KPAY rewards, reloads, withdrawals
                and cards directly from your deployed smart contracts.
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

            <KryptPayCard variant="virtual" />
          </div>
        </section>

        <NetworkWarning />

        {isConnected && loading && (
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 text-zinc-400">
            Loading live dashboard data...
          </section>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            icon={CreditCard}
            label="Cards"
            value={isConnected ? cards.length : 0}
            note="Vault cards owned"
          />

          <OverviewCard
            icon={Wallet}
            label="Vault Balance"
            value={`$${formatUsd(totalBalance)}`}
            note="Across all cards"
          />

          <OverviewCard
            icon={Gift}
            label="Pending KPAY"
            value={`${formatKpay(pendingRewards)} KPAY`}
            note="Reward contract"
          />

          <OverviewCard
            icon={ShieldCheck}
            label="Claimable"
            value={`${formatKpay(claimableRewards)} KPAY`}
            note={`${formatKpay(lockedRewards)} KPAY locked`}
          />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            icon={RefreshCw}
            label="Total Reloaded"
            value={`$${formatUsd(totalReloaded)}`}
            note="Lifetime reload volume"
          />

          <OverviewCard
            icon={Upload}
            label="Total Withdrawn"
            value={`$${formatUsd(totalWithdrawn)}`}
            note="Lifetime withdrawal volume"
          />

          <OverviewCard
            icon={CreditCard}
            label="Active Cards"
            value={cards.filter((card) => !card.frozen && card.active).length}
            note="Not frozen"
          />

          <OverviewCard
            icon={ShieldCheck}
            label="Frozen Cards"
            value={cards.filter((card) => card.frozen).length}
            note="Requires support"
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
                href="/claim"
                icon={Gift}
                title="Claim"
                text="Claim KPAY"
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

            {!isConnected ? (
              <div className="rounded-3xl border border-white/10 bg-black/25 p-5 text-zinc-400">
                Connect your wallet to view cards.
              </div>
            ) : latestCards.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-black/25 p-5 text-zinc-400">
                No Vault cards found yet.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {latestCards.map((card) => (
                  <UserCardSummary
                    key={card.cardId.toString()}
                    cardId={card.cardId}
                    type={cardName(card.cardType)}
                    variant={cardVariant(card.cardType)}
                    balance={`$${formatUsd(card.balanceUsd)}`}
                    status={card.frozen ? "Frozen" : "Active"}
                    href={`/cards/${card.cardId.toString()}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
                Live Summary
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Contract-backed account overview
              </h2>
            </div>

            <Link
              href="/activity"
              className="text-sm text-emerald-300 hover:text-emerald-200"
            >
              View activity
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/25 p-5 text-sm leading-7 text-zinc-400">
            This dashboard is now reading card balances from the KryptPay Vault
            contract and KPAY reward balances from the Reward Claim contract.
            The Activity page will be connected next to display on-chain events.
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
  cardId,
  type,
  variant,
  balance,
  status,
  href,
}: {
  cardId: bigint;
  type: string;
  variant: "virtual" | "physical";
  balance: string;
  status: string;
  href: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
      <KryptPayCard variant={variant} className="rounded-[1.5rem]" />

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="font-semibold">{type}</p>
          <p className="mt-1 text-sm text-zinc-500">Card #{cardId.toString()}</p>
          <p className="text-sm text-zinc-500">Balance {balance}</p>
          <p className="text-sm text-zinc-500">Status {status}</p>
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