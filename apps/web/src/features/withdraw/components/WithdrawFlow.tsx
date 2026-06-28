"use client";

import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { Check, CreditCard, Upload, Wallet } from "lucide-react";
import { GerotCard } from "@/features/cards/components/GerotCard";
import { ConnectWalletButton } from "@/features/wallet/components/ConnectWalletButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { mockCards } from "@/mock/cards";
import { canWithdraw, getRemainingBalance } from "@/server/withdraw/withdrawService";

export function WithdrawFlow() {
  const { isConnected, address } = useAccount();

  const [selectedCardId, setSelectedCardId] = useState("virtual-card");
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");

  const selectedCard =
    mockCards.find((card) => card.id === selectedCardId) ?? mockCards[0];

  const numericAmount = Number(amount || 0);
  const availableBalance = selectedCard.balance;

  const exceedsBalance = numericAmount > availableBalance;
  const destinationValue = destination || address || "";

  const withdrawAllowed = canWithdraw({
  isConnected,
  amount: numericAmount,
  balance: availableBalance,
  destination: destinationValue,
});

const remainingBalance = useMemo(() => {
  return getRemainingBalance({
    balance: availableBalance,
    amount: numericAmount,
  });
}, [availableBalance, numericAmount]);
  function handleWithdraw() {
    if (!numericAmount || numericAmount <= 0) {
      alert("Enter a valid withdrawal amount.");
      return;
    }

    if (exceedsBalance) {
      alert("Withdrawal amount is greater than the card balance.");
      return;
    }

    if (!destinationValue) {
      alert("Enter a destination wallet address.");
      return;
    }

    alert("Withdraw UI is ready. Smart contract withdraw will be connected later.");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Withdraw"
        title="Move funds from your KryptPay card."
        description="Choose a card, enter the withdrawal amount, review the destination wallet and confirm the transfer."
      />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="mb-5 text-sm uppercase tracking-[0.25em] text-emerald-300">
              Choose Card
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {mockCards.map((card) => {
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
                          Available ${card.balance.toFixed(2)}
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
              Withdraw Amount
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

              {exceedsBalance && (
                <p className="mt-3 text-sm text-red-300">
                  Amount exceeds available card balance.
                </p>
              )}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-4">
              {[5, 10, 25, 50].map((value) => (
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

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="mb-5 text-sm uppercase tracking-[0.25em] text-emerald-300">
              Destination Wallet
            </p>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <label className="text-sm text-zinc-400">
                Wallet Address
              </label>

              <input
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                placeholder={address || "0x..."}
                className="mt-3 w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
              />

              <p className="mt-3 text-xs text-zinc-500">
                Leave empty to withdraw to your connected wallet.
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
              Balance Preview
            </p>

            <div className="mt-5 rounded-3xl border border-white/10 bg-black/30 p-5">
              <p className="text-sm text-zinc-500">Available Balance</p>
              <p className="mt-1 text-4xl font-semibold">
                ${availableBalance.toFixed(2)}
              </p>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min((remainingBalance / availableBalance) * 100, 100),
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-sm text-zinc-400">
                Remaining after withdrawal: ${remainingBalance.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
              Summary
            </p>

            <div className="mt-5 space-y-4">
              <SummaryRow icon={CreditCard} label="Card" value={selectedCard.name} />
              <SummaryRow
                icon={Upload}
                label="Withdraw Amount"
                value={`$${numericAmount.toFixed(2)}`}
              />
              <SummaryRow icon={Wallet} label="Token" value="USDC" />
              <SummaryRow
                icon={Wallet}
                label="Destination"
                value={
                  destinationValue
                    ? `${destinationValue.slice(0, 6)}...${destinationValue.slice(-4)}`
                    : "Not set"
                }
              />
            </div>

            <div className="mt-6">
              {!isConnected ? (
                <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
                  <p className="mb-3 text-sm text-zinc-400">
                    Connect your wallet to withdraw.
                  </p>
                  <ConnectWalletButton />
                </div>
              ) : (
                <button
                  onClick={handleWithdraw}
                  disabled={!withdrawAllowed}
                  className="w-full rounded-2xl bg-emerald-400 px-5 py-4 font-semibold text-black hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Withdraw Funds
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