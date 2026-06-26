"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  CreditCard,
  Activity,
  RefreshCw,
  Upload,
  Gift,
  Headphones,
  User,
  Receipt,
  Menu,
  X,
  Store,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Marketplace", href: "/marketplace", icon: Store },
  { label: "My Card", href: "/cards", icon: CreditCard },
  { label: "Orders", href: "/orders", icon: Receipt },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Reload", href: "/reload", icon: RefreshCw },
  { label: "Withdraw", href: "/withdraw", icon: Upload },
  { label: "Referral", href: "/referrals", icon: Gift },
  { label: "Support", href: "/support", icon: Headphones },
  { label: "Account", href: "/account", icon: User },
];

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
              isActive
                ? "bg-emerald-500/15 text-emerald-300"
                : "text-zinc-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({
  children,
  title = "GerotPay Dashboard",
  subtitle = "Welcome to",
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#07080b] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-white/[0.03] p-5 md:block">
          <div className="mb-10">
            <p className="text-2xl font-semibold tracking-tight">GerotPay</p>
            <p className="text-xs text-emerald-300">Sepolia testnet</p>
          </div>

          <SidebarNav pathname={pathname} />
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/70"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu overlay"
            />

            <aside className="relative h-full w-72 border-r border-white/10 bg-[#07080b] p-5 shadow-2xl">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold tracking-tight">
                    GerotPay
                  </p>
                  <p className="text-xs text-emerald-300">Sepolia testnet</p>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-white/10 p-2 text-zinc-300 hover:bg-white/10"
                  aria-label="Close menu"
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

        <section className="flex-1">
          <header className="flex min-h-16 items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:min-h-20 sm:px-6 sm:py-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-xl border border-white/10 p-2 text-zinc-300 hover:bg-white/10 md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <p className="text-xs text-zinc-500 sm:text-sm">{subtitle}</p>
                <h1 className="text-lg font-semibold sm:text-xl">{title}</h1>
              </div>
            </div>

            <div className="hidden rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300 sm:block sm:px-4 sm:py-2 sm:text-sm">
              ETH Payment Enabled
            </div>
          </header>

          <div className="p-4 sm:p-6">{children}</div>
        </section>
      </div>
    </main>
  );
}