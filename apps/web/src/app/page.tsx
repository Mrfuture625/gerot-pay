"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Gift,
  Lock,
  Menu,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Wallet,
  X,
  Send,
  Zap,
} from "lucide-react";
import { ConnectWalletButton } from "@/features/wallet/components/ConnectWalletButton";
import { navItems } from "@/config/navigation";
import { saveReferrer } from "@/features/referral/referralStorage";

function SocialIcon({ name }: { name: "x" | "telegram" | "farcaster" }) {
  if (name === "telegram") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M21.9 4.1 18.7 19c-.2 1-.8 1.2-1.6.8l-4.5-3.3-2.2 2.1c-.2.2-.4.4-.9.4l.3-4.6 8.4-7.6c.4-.3-.1-.5-.6-.2L7.2 13.2 2.8 11.8c-1-.3-1-1 0-1.4L20 3.8c.8-.3 1.5.2 1.9.3Z" />
      </svg>
    );
  }

  if (name === "farcaster") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M6 3h12v18h-3v-5.2h-.03c-.33-1.9-1.5-2.85-2.97-2.85s-2.64.95-2.97 2.85H9V21H6V3Zm3 3v5.6c.78-.9 1.78-1.35 3-1.35s2.22.45 3 1.35V6H9Zm-5 4h2v7H4v-7Zm14 0h2v7h-2v-7Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="m14.2 10.2 7.3-8.5h-1.7l-6.4 7.4-5.1-7.4H2.5l7.7 11.2-7.7 9h1.7l6.8-7.9 5.5 7.9h5.8l-8.1-11.7Zm-2.4 2.8-.8-1.1-6.2-8.8h2.7l5 7.1.8 1.1 6.5 9.2h-2.7l-5.3-7.5Z" />
    </svg>
  );
}

function PremiumCardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative rounded-[2rem] border border-white/15 bg-gradient-to-br from-zinc-950 via-emerald-950/70 to-black p-6 shadow-2xl shadow-emerald-950/40">
        <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_20%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.32),transparent_25%),radial-gradient(circle_at_70%_85%,rgba(34,211,238,0.2),transparent_30%)]" />

        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xl font-semibold tracking-tight">KryptPay</p>
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">
                Premium
              </p>
            </div>

            <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold">
              KP CARD
            </div>
          </div>

          <div className="mt-10 flex justify-end text-3xl text-white/70">
            )))
          </div>

          <div className="mt-8 text-xl tracking-[0.22em] text-zinc-100 sm:text-2xl sm:tracking-[0.32em]">
            •••• •••• •••• 4732
          </div>

          <div className="mt-8 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Card Holder
              </p>
              <p className="mt-1 truncate font-medium">Wallet User</p>
            </div>

            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Valid
              </p>
              <p className="mt-1 font-medium">09/28</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { isConnected, address } = useAccount();
  const [open, setOpen] = useState(false);

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const referrer = params.get("ref");

  if (referrer) {
    saveReferrer(referrer);
  }
}, []);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

const telegramBotUrl = process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL;
const telegramTaskUrl =
  telegramBotUrl && address ? `${telegramBotUrl}?start=${address}` : null;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#05060a] text-white">
      <section className="mx-auto max-w-7xl px-6 py-8">
       <nav className="flex items-center justify-between">
  <Link href="/">
    <p className="text-2xl font-semibold">KryptPay</p>
    <p className="text-xs text-emerald-300">
      Crypto cards powered by wallets
    </p>
  </Link>

  <div className="flex items-center gap-3">
    <ConnectWalletButton />

    {isConnected && (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
      >
        <Menu className="h-5 w-5" />
      </button>
    )}
  </div>
</nav>

        {open && isConnected && (
          <div className="fixed inset-0 z-50">
            <button
              className="absolute inset-0 bg-black/70"
              onClick={() => setOpen(false)}
            />

            <aside className="absolute right-0 top-0 h-full w-80 border-l border-white/10 bg-[#08090d] p-6">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-xl font-semibold">KryptPay Menu</p>
                  <p className="text-xs text-emerald-300">{shortAddress}</p>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-white/10 p-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems
                  .filter((item) => item.href !== "/")
                  .map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-zinc-300 hover:bg-white/10"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}

                  {telegramTaskUrl && (
  <a
    href={telegramTaskUrl}
    target="_blank"
    rel="noreferrer"
    onClick={() => setOpen(false)}
    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-emerald-300 hover:bg-emerald-400/10"
  >
    <Send className="h-4 w-4" />
    Telegram Task
  </a>
)}

              </nav>
            </aside>
          </div>
        )}

        <div className="grid min-h-[82vh] items-center gap-16 py-20 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs sm:px-4 sm:text-sm text-emerald-300">
              <Sparkles className="h-4 w-4" />
              <span className="whitespace-normal break-words">
  Wallet-connected crypto card platform
</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight md:text-7xl">
              Spend, reload and manage crypto cards from one premium wallet app.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              KryptPay lets users connect their wallet, purchase Virtual or
              Physical cards, apply coupon discounts, earn $KPAY token rewards,
              unlock bonus balances, track card transactions and manage reloads
              from a secure Web3 dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-3 font-semibold text-black"
              >
                Explore Cards <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-zinc-300"
              >
                Open Dashboard
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ["Virtual Card", "$1 initial price"],
                ["Physical Card", "$2 initial price"],
                ["KPAY Rewards", "10 / 100 $KPAY"],
              ].map(([title, value]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <p className="text-sm text-zinc-500">{title}</p>
                  <p className="mt-1 font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <PremiumCardPreview />
        </div>

        <section className="grid gap-5 py-16 md:grid-cols-3">
          {[
            {
              icon: Wallet,
              title: "Wallet-only access",
              text: "No email login, no signup form and no password system. Users enter the platform by connecting their wallet.",
            },
            {
              icon: CreditCard,
              title: "Virtual & Physical cards",
              text: "Users can purchase either a Virtual Card or Physical Card from the marketplace and manage each card separately.",
            },
            {
              icon: BadgeCheck,
              title: "On-chain coupon logic",
              text: "Coupons can be controlled by the owner and applied during purchase to reduce the final card price.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <Icon className="mb-5 h-7 w-7 text-emerald-300" />
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 leading-7 text-zinc-400">{item.text}</p>
              </div>
            );
          })}
        </section>

        

        <section className="grid gap-5 pt-6 pb-16 md:grid-cols-4">
          {[
            {
              icon: RefreshCw,
              title: "Reload",
              text: "Add supported tokens to card balance.",
            },
            {
              icon: Zap,
              title: "Withdraw",
              text: "Withdraw available card funds when needed.",
            },
            {
              icon: Gift,
              title: "Referrals",
              text: "Invite users and earn $KPAY token rewards.",
            },
            {
              icon: ShieldCheck,
              title: "Secure activity",
              text: "Track all purchases, reloads and withdrawals.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <Icon className="mb-5 h-6 w-6 text-emerald-300" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {item.text}
                </p>
              </div>
            );
          })}
        </section>

        <section className="rounded-[2.5rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 via-white/[0.035] to-cyan-400/10 p-8 text-center lg:p-12">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            Marketplace Ready
          </p>
          <h2 className="mt-4 text-4xl font-semibold">
            Purchase cards, apply coupons and earn $KPAY rewards.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-zinc-400">
            The marketplace will support optional coupon codes during checkout,
            owner-managed prices, token rewards and configurable payment tokens.
          </p>

          <Link
            href="/marketplace"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-black"
          >
            Go to Marketplace <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <footer className="mt-16 flex flex-col gap-4 border-t border-white/10 py-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} KryptPay. All rights reserved.</p>

          <div className="flex gap-3 text-zinc-300">
            <Link
  href="https://x.com/YOUR_USERNAME"
  target="_blank"
  className="rounded-full border border-white/10 p-3"
>
              <SocialIcon name="x" />
            </Link>

            <Link
  href="https://t.me/YOUR_USERNAME"
  target="_blank"
  className="rounded-full border border-white/10 p-3"
>
              <SocialIcon name="telegram" />
            </Link>

          </div>
        </footer>
      </section>
    </main>
  );
}