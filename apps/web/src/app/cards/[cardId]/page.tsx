"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import {
  ArrowLeft,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  Upload,
  Wallet,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { KryptPayCard } from "@/features/cards/components/KryptPayCard";
import { getCard } from "@/lib/services/vaultService";
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

export default function CardDetailsPage() {
  const params = useParams();
  const cardId = BigInt(String(params.cardId));

  const [card, setCard] = useState<VaultCard | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadCard() {
    setLoading(true);

    try {
      const result = (await getCard(cardId)) as unknown as VaultCard;
      setCard(result);
    } catch (error) {
      console.error(error);
      appToast.error("Failed to load card from Vault.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.cardId]);

  if (loading || !card) {
    return (
      <DashboardShell title="Loading Card" subtitle="Please wait">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 text-zinc-400">
          Loading live card details from Vault...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title={cardName(card.cardType)}
      subtitle="Live card details from KryptPay Vault"
    >
      <div className="space-y-6">
        <Link
          href="/cards"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cards
        </Link>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <KryptPayCard variant={cardVariant(card.cardType)} />

            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Status</p>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      card.frozen ? "bg-amber-400" : "bg-emerald-400"
                    }`}
                  />
                  <p
                    className={`font-semibold ${
                      card.frozen ? "text-amber-300" : "text-emerald-300"
                    }`}
                  >
                    {card.frozen ? "Frozen" : "Active"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-zinc-500">Card Type</p>
                <p className="mt-1 font-semibold">
                  {card.cardType === 1 ? "Physical" : "Virtual"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoPanel
              icon={Wallet}
              label="Available Balance"
              value={`$${formatUsd(card.balanceUsd)}`}
              note="Spendable Vault card funds"
            />

            <InfoPanel
              icon={RefreshCw}
              label="Total Reloaded"
              value={`$${formatUsd(card.totalReloadedUsd)}`}
              note="Lifetime reload volume"
            />

            <InfoPanel
              icon={Upload}
              label="Total Withdrawn"
              value={`$${formatUsd(card.totalWithdrawnUsd)}`}
              note="Lifetime withdrawals"
            />

            <InfoPanel
              icon={ShieldCheck}
              label="Card ID"
              value={`#${card.cardId.toString()}`}
              note={`Created ${formatDate(card.createdAt)}`}
            />
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/reload"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-4 font-semibold text-black hover:bg-emerald-300"
          >
            <RefreshCw className="h-5 w-5" />
            Reload This Card
          </Link>

          <Link
            href="/withdraw"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-4 font-semibold text-zinc-300 hover:bg-white/10"
          >
            <Upload className="h-5 w-5" />
            Withdraw From Card
          </Link>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
              Vault Details
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Live on-chain card metadata
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              This card is loaded directly from the KryptPay Vault contract.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <DetailRow label="Owner" value={card.owner} />
            <DetailRow label="Active" value={card.active ? "Yes" : "No"} />
            <DetailRow label="Frozen" value={card.frozen ? "Yes" : "No"} />
            <DetailRow label="Last Activity" value={formatDate(card.lastActivityAt)} />
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function InfoPanel({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof CreditCard;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-5 w-fit rounded-2xl border border-white/10 bg-black/30 p-3">
        <Icon className="h-5 w-5 text-emerald-300" />
      </div>

      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 break-all text-2xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{note}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 break-all font-semibold">{value}</p>
    </div>
  );
}