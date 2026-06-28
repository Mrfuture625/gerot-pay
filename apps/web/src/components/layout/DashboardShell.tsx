"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronRight, Menu, Sparkles, X } from "lucide-react";
import { navItems } from "@/config/navigation";
import { ConnectWalletButton } from "@/features/wallet/components/ConnectWalletButton";

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/30 bg-gradient-to-br from-emerald-300 via-cyan-300 to-emerald-500 shadow-lg shadow-emerald-500/20">
        <div className="absolute inset-[3px] rounded-[0.85rem] bg-black/85" />
        <span className="relative bg-gradient-to-br from-emerald-200 to-cyan-200 bg-clip-text text-sm font-black tracking-tight text-transparent">
          GP
        </span>
      </div>

      <div>
        <p className="text-xl font-semibold tracking-tight">GerotPay</p>
        <p className="text-xs text-emerald-300">Premium wallet banking</p>
      </div>
    </div>
  );
}

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1.5">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${
              isActive
                ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-200 shadow-lg shadow-emerald-950/20"
                : "border border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <span
                className={`rounded-xl p-2 transition ${
                  isActive
                    ? "bg-emerald-400/15 text-emerald-300"
                    : "bg-white/[0.04] text-zinc-500 group-hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>

              {item.label}
            </span>

            {isActive && <ChevronRight className="h-4 w-4 text-emerald-300" />}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({
  children,
  title = "GerotPay Dashboard",
  subtitle = "Wallet-connected account",
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#05060a] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl xl:w-80 xl:p-5 lg:block">
          <div className="mb-8">
            <BrandMark />
          </div>

          <div className="mb-5 rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
            <div className="flex items-center gap-2 text-emerald-300">
              <Sparkles className="h-4 w-4" />
              <p className="text-sm font-medium">Wallet-first account</p>
            </div>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Connect wallet, purchase cards, reload, withdraw and earn GP
              rewards.
            </p>
          </div>

          <div className="pb-10">
  <SidebarNav pathname={pathname} />
</div>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            <aside className="relative h-full w-[86%] max-w-80 border-r border-white/10 bg-[#07080d] p-5 shadow-2xl">
              <div className="mb-8 flex items-center justify-between">
                <BrandMark />

                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <SidebarNav
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </aside>
          </div>
        )}

        <section className="min-w-0 flex-1 overflow-x-hidden">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05060a]/80 px-4 py-4 backdrop-blur-xl sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <div className="min-w-0">
                  <p className="truncate text-xs uppercase tracking-[0.25em] text-emerald-300">
                    {subtitle}
                  </p>
                  <h1 className="truncate text-xl font-semibold sm:text-2xl">
                    {title}
                  </h1>
                </div>
              </div>

              <div className="shrink-0">
                <ConnectWalletButton />
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-7xl overflow-x-hidden p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}