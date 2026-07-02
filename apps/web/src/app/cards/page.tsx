"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import {
  ArrowRight,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  Upload,
  Wallet,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { KryptPayCard } from "@/features/cards/components/KryptPayCard";
import { ConnectWalletButton } from "@/features/wallet/components/ConnectWalletButton";
import { getCard } from "@/lib/services/vaultService";
import { getCardsByWallet } from "@/lib/services/cardsService";
import { appToast } from "@/lib/toast";
import { getOrdersByWallet, type SavedOrder } from "@/lib/services/ordersService";

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

function formatUsd(value: bigint) {
  return Number(formatUnits(value, 18)).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

function cardName(cardType: number) {
  return cardType === 1 ? "Krypt Physical Card" : "Krypt Virtual Card";
}

function cardVariant(cardType: number): "virtual" | "physical" {
  return cardType === 1 ? "physical" : "virtual";
}

function formatDate(timestamp: bigint) {
  return new Date(Number(timestamp) * 1000).toLocaleString();
}

export default function MyCardsPage() {
  const { address, isConnected } = useAccount();

  const [cards, setCards] = useState<VaultCard[]>([]);
  const [orders, setOrders] = useState<SavedOrder[]>([]);
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

  async function loadCards() {
    if (!address) return;

    setLoading(true);

    try {
      const savedCards = await getCardsByWallet(address);

const loadedCards = await Promise.all(
  savedCards.map(async (savedCard) => {
    return (await getCard(BigInt(savedCard.vaultCardId))) as unknown as VaultCard;
  }),
);

      const savedOrders = await getOrdersByWallet(address);

      setCards(loadedCards);
      setOrders(savedOrders);
    } catch (error) {
      console.error(error);
      appToast.error("Failed to load Vault cards.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <DashboardShell title="My Cards" subtitle="Manage your KryptPay cards">
      <div className="space-y-6">
        <section className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.035] to-emerald-400/[0.08] p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            Your Cards
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Manage your Virtual and Physical cards.
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
            View live Vault balances, reload history, withdrawal totals, and
            card status directly from your deployed KryptPay Vault contract.
          </p>
        </section>

        {!isConnected ? (
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-4 flex items-center gap-3">
              <Wallet className="h-6 w-6 text-emerald-300" />
              <div>
                <h2 className="text-xl font-semibold">Connect wallet</h2>
                <p className="text-sm text-zinc-400">
                  Connect your wallet to view your KryptPay cards.
                </p>
              </div>
            </div>
            <ConnectWalletButton />
          </section>
        ) : loading ? (
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center text-zinc-400">
            Loading your Vault cards...
          </section>
        ) : cards.length === 0 ? (
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center text-zinc-400">
            No Vault cards found for this wallet yet.
          </section>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-4">
              <StatBox label="Total Cards" value={String(cards.length || orders.length)} />
              <StatBox label="Total Balance" value={`$${formatUsd(totalBalance)}`} />
              <StatBox label="Reloaded" value={`$${formatUsd(totalReloaded)}`} />
              <StatBox label="Withdrawn" value={`$${formatUsd(totalWithdrawn)}`} />
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              {cards.map((card) => (
                <div
                  key={card.cardId.toString()}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5"
                >
                  <KryptPayCard variant={cardVariant(card.cardType)} />

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            card.frozen ? "bg-amber-400" : "bg-emerald-400"
                          }`}
                        />
                        <p
                          className={`text-sm ${
                            card.frozen ? "text-amber-300" : "text-emerald-300"
                          }`}
                        >
                          {card.frozen ? "Frozen" : "Active"}
                        </p>
                      </div>

                      <h2 className="text-2xl font-semibold">
                        {cardName(card.cardType)}
                      </h2>

                      <p className="mt-2 text-sm text-zinc-400">
                        Card #{card.cardId.toString()} • Last activity:{" "}
                        {formatDate(card.lastActivityAt)}
                      </p>
                    </div>

                    <Link
                      href={`/cards/${card.cardId.toString()}`}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-emerald-300 hover:bg-white/10"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <InfoBox
                      icon={CreditCard}
                      label="Balance"
                      value={`$${formatUsd(card.balanceUsd)}`}
                    />

                    <InfoBox
                      icon={RefreshCw}
                      label="Reloaded"
                      value={`$${formatUsd(card.totalReloadedUsd)}`}
                    />

                    <InfoBox
                      icon={Upload}
                      label="Withdrawn"
                      value={`$${formatUsd(card.totalWithdrawnUsd)}`}
                    />
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <Link
                      href="/reload"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-4 font-semibold text-black hover:bg-emerald-300"
                    >
                      <RefreshCw className="h-5 w-5" />
                      Reload
                    </Link>

                    <Link
                      href="/withdraw"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-4 font-semibold text-zinc-300 hover:bg-white/10"
                    >
                      <Upload className="h-5 w-5" />
                      Withdraw
                    </Link>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3">
              <ShieldCheck className="h-6 w-6 text-emerald-300" />
            </div>

            <div>
              <h3 className="text-xl font-semibold">Live Vault cards</h3>
              <p className="mt-2 leading-7 text-zinc-400">
                These cards are loaded directly from the KryptPay Vault contract.
                Reload and withdraw actions update these balances on-chain.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function InfoBox({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CreditCard;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <Icon className="mb-3 h-5 w-5 text-emerald-300" />
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}