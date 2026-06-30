"use client";

import { useEffect, useMemo, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useAccount } from "wagmi";
import { Check, CreditCard, Download, Wallet } from "lucide-react";
import { config } from "@/features/wallet/providers/WalletProvider";
import { KryptPayCard } from "@/features/cards/components/KryptPayCard";
import { ConnectWalletButton } from "@/features/wallet/components/ConnectWalletButton";
import {
  getCard,
  getEthAmountForReload,
  getUserCardIds,
  withdrawFromCardOnchain,
} from "@/lib/services/vaultService";
import { appToast } from "@/lib/toast";

type PaymentChoice = "eth" | "usdc" | "usdt";

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

const PAYMENT_TOKEN_VALUE = {
  eth: 0,
  usdc: 1,
  usdt: 2,
} as const;

function formatUsd(value: bigint) {
  return Number(formatUnits(value, 18)).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

function cardName(cardType: number) {
  return cardType === 1 ? "KryptPay Physical Card" : "KryptPay Virtual Card";
}

function cardVariant(cardType: number): "virtual" | "physical" {
  return cardType === 1 ? "physical" : "virtual";
}

export function WithdrawFlow() {
  const { address, isConnected } = useAccount();

  const [cards, setCards] = useState<VaultCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<bigint | null>(null);
  const [amount, setAmount] = useState("");
  const [paymentChoice, setPaymentChoice] = useState<PaymentChoice>("usdc");
  const [loading, setLoading] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const selectedCard = useMemo(() => {
    return cards.find((card) => card.cardId === selectedCardId) ?? cards[0];
  }, [cards, selectedCardId]);

  const numericAmount = Number(amount || 0);
  const amountUsd = amount ? parseUnits(amount, 18) : 0n;

  const totalBalance = useMemo(() => {
    return cards.reduce((sum, card) => sum + card.balanceUsd, 0n);
  }, [cards]);

  const totalReloaded = useMemo(() => {
    return cards.reduce((sum, card) => sum + card.totalReloadedUsd, 0n);
  }, [cards]);

  const totalWithdrawn = useMemo(() => {
    return cards.reduce((sum, card) => sum + card.totalWithdrawnUsd, 0n);
  }, [cards]);

  const exceedsBalance =
    !!selectedCard && amountUsd > 0n && amountUsd > selectedCard.balanceUsd;

  const withdrawAllowed =
    isConnected &&
    !!selectedCard &&
    amountUsd > 0n &&
    !exceedsBalance &&
    !withdrawing;

  async function loadCards() {
    if (!address) return;

    setLoading(true);

    try {
      const ids = (await getUserCardIds(address)) as bigint[];

      const loadedCards = await Promise.all(
        ids.map(async (id) => {
          return (await getCard(id)) as unknown as VaultCard;
        }),
      );

      setCards(loadedCards);

      if (loadedCards.length && !selectedCardId) {
        setSelectedCardId(loadedCards[0].cardId);
      }
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

  async function handleWithdraw() {
    if (!selectedCard) {
    appToast.error("No Vault card found for this wallet.");
      return;
    }

    if (!amount || numericAmount <= 0) {
      appToast.error("Enter a valid withdrawal amount.");
      return;
    }

    if (amountUsd > selectedCard.balanceUsd) {
      appToast.error("Withdrawal amount exceeds selected card balance.");
      return;
    }

    setWithdrawing(true);

    appToast.loading("Waiting for wallet confirmation...", "withdraw");

    try {
      const paymentToken = PAYMENT_TOKEN_VALUE[paymentChoice];

      const hash = await withdrawFromCardOnchain({
        cardId: selectedCard.cardId,
        paymentToken,
        usdAmount: amountUsd,
      });

      await waitForTransactionReceipt(config, { hash });

      appToast.success("Withdrawal successful.", "withdraw");
      setAmount("");
      await loadCards();
    } catch (error) {
  console.error(error);

  appToast.error(
    "Withdraw failed or rejected. Make sure the Vault has enough ETH/USDC/USDT available for payouts.",
    "withdraw",
  );
} finally {
  setWithdrawing(false);
}
     
  }
  async function previewEthAmount() {
    if (!amountUsd || paymentChoice !== "eth") return;

    try {
      const ethAmount = (await getEthAmountForReload(amountUsd)) as bigint;
      appToast.info(`You will receive approximately ${formatUnits(ethAmount, 18)} ETH.`);
    } catch {
      appToast.error("Could not calculate ETH amount.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.035] to-emerald-400/[0.08] p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
          Withdraw
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Withdraw funds from your KryptPay card.
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
          Select a Vault card, choose the amount, and withdraw your balance as
          ETH, USDC, or USDT.
        </p>
      </section>

      {!isConnected ? (
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-4 flex items-center gap-3">
            <Wallet className="h-6 w-6 text-emerald-300" />
            <div>
              <h2 className="text-xl font-semibold">Connect wallet</h2>
              <p className="text-sm text-zinc-400">
                Connect your wallet to load your Vault cards.
              </p>
            </div>
          </div>
          <ConnectWalletButton />
        </section>
      ) : loading ? (
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center text-zinc-400">
          Loading Vault cards...
        </section>
      ) : cards.length === 0 ? (
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center text-zinc-400">
          No Vault cards found for this wallet yet.
        </section>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <VaultStat label="Total Balance" value={`$${formatUsd(totalBalance)}`} />
            <VaultStat label="Total Reloaded" value={`$${formatUsd(totalReloaded)}`} />
            <VaultStat label="Total Withdrawn" value={`$${formatUsd(totalWithdrawn)}`} />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="mb-5 text-sm uppercase tracking-[0.25em] text-emerald-300">
                  Choose Card
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  {cards.map((card) => {
                    const selected = selectedCard?.cardId === card.cardId;

                    return (
                      <button
                        key={card.cardId.toString()}
                        onClick={() => setSelectedCardId(card.cardId)}
                        className={`rounded-[2rem] border p-4 text-left transition ${
                          selected
                            ? "border-emerald-400/40 bg-emerald-400/10"
                            : "border-white/10 bg-black/25 hover:border-white/20"
                        }`}
                      >
                        <KryptPayCard
                          variant={cardVariant(card.cardType)}
                          className="max-w-[280px] rounded-[1.5rem] sm:max-w-[360px]"
                        />

                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <p className="font-semibold">
                              {cardName(card.cardType)}
                            </p>
                            <p className="mt-1 text-sm text-zinc-500">
                              Balance ${formatUsd(card.balanceUsd)}
                            </p>
                            <p className="mt-1 text-xs text-zinc-600">
                              {card.frozen ? "Frozen" : "Active"}
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
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
                    Withdraw Amount
                  </p>

                  {selectedCard && (
                    <button
                      type="button"
                      onClick={() =>
                        setAmount(formatUnits(selectedCard.balanceUsd, 18))
                      }
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300 hover:bg-white/10"
                    >
                      MAX
                    </button>
                  )}
                </div>

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
                      USD
                    </div>
                  </div>
                </div>

                {exceedsBalance && (
                  <p className="mt-3 text-sm text-red-300">
                    Amount exceeds selected card balance.
                  </p>
                )}

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

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="mb-3 font-semibold">Receive As</p>

                <div className="grid gap-2 sm:grid-cols-3">
                  {(["eth", "usdc", "usdt"] as PaymentChoice[]).map((token) => (
                    <button
                      key={token}
                      type="button"
                      onClick={() => setPaymentChoice(token)}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold uppercase transition ${
                        paymentChoice === token
                          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                          : "border-white/10 text-zinc-400 hover:bg-white/10"
                      }`}
                    >
                      {token}
                    </button>
                  ))}
                </div>

                {paymentChoice === "eth" && (
                  <button
                    type="button"
                    onClick={previewEthAmount}
                    className="mt-3 text-sm text-emerald-300 hover:underline"
                  >
                    Preview ETH amount
                  </button>
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
                  Summary
                </p>

                <div className="mt-5 space-y-4">
                  <SummaryRow
                    icon={CreditCard}
                    label="Card"
                    value={selectedCard ? cardName(selectedCard.cardType) : "N/A"}
                  />
                  <SummaryRow
                    icon={Wallet}
                    label="Available"
                    value={
                      selectedCard ? `$${formatUsd(selectedCard.balanceUsd)}` : "$0"
                    }
                  />
                  <SummaryRow
                    icon={Download}
                    label="Withdraw Amount"
                    value={`$${numericAmount.toFixed(2)}`}
                  />
                  <SummaryRow
                    icon={Wallet}
                    label="Receive Token"
                    value={paymentChoice.toUpperCase()}
                  />
                </div>

                <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <p className="text-sm text-emerald-300">You Receive</p>
                  <p className="mt-1 text-3xl font-bold">
                    {numericAmount.toFixed(2)} {paymentChoice.toUpperCase()}
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleWithdraw}
                    disabled={!withdrawAllowed}
                    className="w-full rounded-2xl bg-emerald-400 px-5 py-4 font-semibold text-black hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {withdrawing ? "Withdrawing..." : "Withdraw Funds"}
                  </button>
                </div>
              </div>
            </aside>
          </section>
        </>
      )}
    </div>
  );
}

function VaultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
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