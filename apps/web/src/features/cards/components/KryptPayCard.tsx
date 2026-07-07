"use client";

import { Wifi } from "lucide-react";

type KryptPayCardProps = {
  variant?: "virtual" | "physical";
  className?: string;
  cardNumber?: string;
  last4?: string;
  holderName?: string;
  expiry?: string;
  masked?: boolean;
};

function formatCardNumber(cardNumber: string, masked: boolean) {
  const clean = cardNumber.replace(/\s/g, "");

  if (masked) {
    return `•••• •••• •••• ${clean.slice(-4)}`;
  }

  return clean.replace(/(.{4})/g, "$1 ").trim();
}

function KryptPayLogo() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/30 bg-black/60 shadow-lg shadow-emerald-500/20">
      <span className="bg-gradient-to-br from-emerald-200 to-cyan-200 bg-clip-text text-sm font-black tracking-tight text-transparent">
        KP
      </span>
    </div>
  );
}

export function KryptPayCard({
  variant = "virtual",
  className = "",
  cardNumber,
last4 = "4732",
  holderName = "Wallet User",
  expiry = "12/29",
  masked = true,
}: KryptPayCardProps) {
  const isPhysical = variant === "physical";

  return (
    <div
      className={`group relative aspect-[1.58/1] w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-white/15 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-4 shadow-2xl shadow-emerald-950/30 transition duration-500 hover:-translate-y-1 sm:max-w-[460px] sm:rounded-[2rem] sm:p-6 ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_22%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.32),transparent_28%),radial-gradient(circle_at_75%_90%,rgba(34,211,238,0.2),transparent_30%)]" />
      <div className="absolute -left-20 top-0 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xl font-semibold tracking-tight">KryptPay</p>
            <p className="mt-1 text-xs uppercase tracking-[0.35em] text-emerald-300">
              {isPhysical ? "Physical" : "Virtual"} Card
            </p>
          </div>

          <KryptPayLogo />
        </div>

        <div className="flex justify-end">
          <Wifi className="h-6 w-6 rotate-90 text-white/70" />
        </div>

        <div>
          <p className="truncate text-lg tracking-[0.18em] text-white sm:text-xl sm:tracking-[0.24em] lg:text-2xl lg:tracking-[0.28em]">
            {formatCardNumber(
  cardNumber ?? `000000000000${last4}`,
  masked,
)}
          </p>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                Card Holder
              </p>
              <p className="mt-1 truncate text-sm font-medium uppercase">
                {holderName}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                Valid
              </p>
              <p className="mt-1 text-sm font-medium">{expiry}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}