"use client";

import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { Check, CreditCard, Gift, RefreshCw, Wallet } from "lucide-react";
import { GerotCard } from "@/features/cards/components/GerotCard";
import { ConnectWalletButton } from "@/features/wallet/components/ConnectWalletButton";
import { canReload, getReloadBonusPreview } from "@/server/reload/reloadService";

const cards = [
  {
    id: "virtual",
    name: "Krypt Virtual Card",
    type: "virtual" as const,
    balance: 34.2,
    bonus: 5,
    unlockAmount: 1,
    bonusStatus: "Locked",
  },
  {
    id: "physical",
    name: "Krypt Physical Card",
    type: "physical" as const,
    balance: 102.5,
    bonus: 15,
    unlockAmount: 2,
    bonusStatus: "Locked",
  },
];

export function ReloadFlow() {
  const { isConnected } = useAccount();
  const [selectedCardId, setSelectedCardId] = useState("virtual");
  const [amount, setAmount] = useState("");

  const selectedCard = cards.find((card) => card.id === selectedCardId)!;
  const numericAmount = Number(amount || 0);

  const bonusPreview = getReloadBonusPreview({
  currentStatus: selectedCard.bonusStatus as "Locked" | "Active",
  reloadAmount: numericAmount,
  unlockReload: selectedCard.unlockAmount,
});

const willUnlockBonus = bonusPreview.willUnlock;

const reloadAllowed = canReload({
  isConnected,
  amount: numericAmount,
});

  const progress = useMemo(() => {
    return Math.min((numericAmount / selectedCard.unlockAmount) * 100, 100);
  }, [numericAmount, selectedCard.unlockAmount]);

  function handleReload() {
    if (!amount || numericAmount <= 0) {
      alert("Enter a valid reload amount.");
      return;
    }

    alert("Reload UI is ready. Smart contract reload will be connected later.");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.035] to-emerald-400/[0.08] p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
          Reload
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Add funds to your KryptPay card.
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
          Choose your card, enter the reload amount and unlock your promotional
          bonus balance after meeting the first reload requirement.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="mb-5 text-sm uppercase tracking-[0.25em] text-emerald-300">
              Choose Card
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {cards.map((card) => {
                const selected = selectedCard.id === card.id;

                return (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCardId(card.id)}
                    className={`rounded-[2rem] border p-4 text-left transition ${
                      selected
                        ? "border-emerald-400/40 bg-emerald-400/10"
                        : "border-white/10 bg-black/25 hover:border-white/20"
                    }`}
                  >
                    <GerotCard
  variant={card.type}
  className="max-w-[280px] rounded-[1.5rem] sm:max-w-[360px]"
/>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{card.name}</p>
                        <p className="mt-1 text-sm text-zinc-500">
                          Balance ${card.balance.toFixed(2)}
                        </p>
                      </div>

                      {selected && (
                        <div className="rounded-full bg-emerald-400 p-2 text-black">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="mb-5 text-sm uppercase tracking-[0.25em] text-emerald-300">
              Reload Amount
            </p>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <label className="text-sm text-zinc-400">Amount</label>

              <div className="mt-3 flex items-center gap-3">
                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0.00"
                  type="number"
                  min="0"
                  className="min-w-0 flex-1 bg-transparent text-4xl font-semibold outline-none placeholder:text-zinc-700"
                />

                <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 font-semibold">
                  USDC
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-4">
              {[1, 10, 25, 50].map((value) => (
                <button
                  key={value}
                  onClick={() => setAmount(String(value))}
                  className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-zinc-300 hover:bg-white/10"
                >
                  ${value}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
              Bonus Progress
            </p>

            <div className="mt-5 rounded-3xl border border-white/10 bg-black/30 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Bonus Balance</p>
                  <p className="mt-1 text-3xl font-semibold">
                    ${selectedCard.bonus}
                  </p>
                </div>

                <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
                  {willUnlockBonus ? "Will Activate" : selectedCard.bonusStatus}
                </div>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-3 text-sm text-zinc-400">
                Reload ${selectedCard.unlockAmount} to activate the bonus.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
              Summary
            </p>

            <div className="mt-5 space-y-4">
              <SummaryRow icon={CreditCard} label="Card" value={selectedCard.name} />
              <SummaryRow icon={Wallet} label="Payment Token" value="USDC" />
              <SummaryRow
                icon={RefreshCw}
                label="Reload Amount"
                value={`$${numericAmount.toFixed(2)}`}
              />
              <SummaryRow
                icon={Gift}
                label="Bonus Status"
                value={willUnlockBonus ? "Will Activate" : selectedCard.bonusStatus}
              />
            </div>

            <div className="mt-6">
              {!isConnected ? (
                <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
                  <p className="mb-3 text-sm text-zinc-400">
                    Connect your wallet to reload.
                  </p>
                  <ConnectWalletButton />
                </div>
              ) : (
                <button
  onClick={handleReload}
  disabled={!reloadAllowed}
  className="w-full rounded-2xl bg-emerald-400 px-5 py-4 font-semibold text-black hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
>
  Reload Card
</button>
              )}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CreditCard;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.05] p-2">
          <Icon className="h-4 w-4 text-emerald-300" />
        </div>
        <p className="text-sm text-zinc-400">{label}</p>
      </div>

      <p className="text-right text-sm font-semibold">{value}</p>
    </div>
  );
}