"use client";

import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  Gift,
  Lock,
  RefreshCw,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GerotCard } from "@/features/cards/components/GerotCard";
import { mockCards } from "@/mock/cards";

export default function MyCardsPage() {
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
            View card balances, bonus balance status, reload requirements and
            card-specific activity from one premium card wallet.
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          {mockCards.map((card) => (
            <div
              key={card.id}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5"
            >
              <GerotCard variant={card.type} />

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <p className="text-sm text-emerald-300">{card.status}</p>
                  </div>

                  <h2 className="text-2xl font-semibold">{card.name}</h2>

                  <p className="mt-2 text-sm text-zinc-400">
                    {card.lastActivity}
                  </p>
                </div>

                <Link
                  href={`/cards/${card.id}`}
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
                  value={`$${card.balance.toFixed(2)}`}
                />

                <InfoBox icon={Gift} label="Bonus" value={`$${card.bonus} ${card.bonusStatus}`} />

                <InfoBox
                  icon={Lock}
                  label="Unlock Reload"
                  value={`$${card.unlockReload}`}
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

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3">
              <ShieldCheck className="h-6 w-6 text-emerald-300" />
            </div>

            <div>
              <h3 className="text-xl font-semibold">Card transaction rule</h3>
              <p className="mt-2 leading-7 text-zinc-400">
                The main Activity page will show all wallet activity. Each card
                details page will show only transactions related to that specific
                card.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
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