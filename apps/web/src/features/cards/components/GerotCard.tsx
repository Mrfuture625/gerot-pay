"use client";

import { Wifi } from "lucide-react";

type GerotCardProps = {
  variant?: "virtual" | "physical";
  className?: string;
};

function KryptPayLogo() {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/30 bg-gradient-to-br from-emerald-300 via-cyan-300 to-emerald-500 shadow-lg shadow-emerald-500/20">
      <div className="absolute inset-[3px] rounded-[0.85rem] bg-black/80" />
      <span className="relative bg-gradient-to-br from-emerald-200 to-cyan-200 bg-clip-text text-sm font-black tracking-tight text-transparent">
        GP
      </span>
    </div>
  );
}

export function GerotCard({
  variant = "virtual",
  className = "",
}: GerotCardProps) {
  const isPhysical = variant === "physical";

  return (
    <div
      className={`group relative mx-auto aspect-[1.58/1] w-full max-w-[460px] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-white/15 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6 shadow-2xl shadow-emerald-950/30 transition duration-500 hover:-translate-y-2 hover:rotate-1 ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_22%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.35),transparent_28%),radial-gradient(circle_at_75%_90%,rgba(34,211,238,0.22),transparent_30%)]" />

      <div className="absolute -left-20 top-0 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="absolute inset-x-[-40%] top-[-60%] h-32 rotate-12 bg-white/10 blur-2xl transition duration-700 group-hover:top-[120%]" />

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

        <div className="flex items-center justify-between">
          <div className="h-11 w-14 rounded-xl border border-yellow-200/40 bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-900 shadow-lg" />
          <Wifi className="h-6 w-6 rotate-90 text-white/70" />
        </div>

        <div>
          <p className="truncate text-base tracking-[0.22em] text-white sm:text-xl sm:tracking-[0.28em] lg:text-2xl lg:tracking-[0.32em]">
            4892 •••• •••• 0928
          </p>

          <div className="mt-6 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                Card Holder
              </p>
              <p className="mt-1 text-sm font-medium">Wallet User</p>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                Valid
              </p>
              <p className="mt-1 text-sm font-medium">12/30</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}