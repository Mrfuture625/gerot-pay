"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BadgePercent,
  CreditCard,
  Gift,
  Lock,
  RefreshCw,
  ShieldCheck,
  Upload,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GerotCard } from "@/features/cards/components/GerotCard";
import { getUserCardById } from "@/server/cards/userCardRepository";
import { getCardActivity } from "@/server/activity/activityRepository";



export default function CardDetailsPage() {
  const params = useParams();
  const cardId = String(params.cardId);

  const [card, setCard] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    async function loadCard() {
      const selectedCard = await getUserCardById(cardId);
      const selectedActivity = await getCardActivity(cardId);

      setCard(selectedCard);
      setActivity(selectedActivity);
    }

    loadCard();
  }, [cardId]);

  if (!card) {
    return (
      <DashboardShell title="Loading Card" subtitle="Please wait">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 text-zinc-400">
          Loading card details...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title={card.name} subtitle="Card details and transactions">
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
            <GerotCard variant={card.type} />

            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Status</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <p className="font-semibold text-emerald-300">
                    {card.status}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-zinc-500">Card Type</p>
                <p className="mt-1 font-semibold capitalize">{card.type}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoPanel
              icon={Wallet}
              label="Available Balance"
             value={`$${card.balance.toFixed(2)}`}
              note="Spendable card funds"
            />

            <InfoPanel
              icon={Gift}
              label="Bonus Balance"
              value={`$${card.bonus.toFixed(2)}`}
              note={`${card.bonusStatus} bonus`}
            />

            <InfoPanel
              icon={Lock}
              label="Unlock Requirement"
              value={`$${card.unlockReload}`}
              note="Minimum first reload"
            />

            <InfoPanel
              icon={ShieldCheck}
              label="Card Number"
              value={card.cardNumber}
              note={`Expiry ${card.expiry}`}
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
              Card Activity
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Transactions for this card
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              This section only shows activity connected to this selected card.
            </p>
          </div>

          <div className="space-y-3">
            {activity.map((item) => {
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

                  <div className="text-right">
                    <p className="font-semibold">{item.amount}</p>
                    <p className="text-sm text-zinc-500">{item.time}</p>
                  </div>
                </div>
              );
            })}
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
      <div className="mb-5 rounded-2xl border border-white/10 bg-black/30 p-3 w-fit">
        <Icon className="h-5 w-5 text-emerald-300" />
      </div>

      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{note}</p>
    </div>
  );
}