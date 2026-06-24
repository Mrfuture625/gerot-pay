import Link from "next/link";
import {
  Home,
  CreditCard,
  Activity,
  RefreshCw,
  Upload,
  Gift,
  Headphones,
  User,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "My Card", href: "/cards", icon: CreditCard },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Reload", href: "/reload", icon: RefreshCw },
  { label: "Withdraw", href: "/withdraw", icon: Upload },
  { label: "Referral", href: "/referrals", icon: Gift },
  { label: "Support", href: "/support", icon: Headphones },
  { label: "Account", href: "/account", icon: User },
];

 export function DashboardShell({
  children,
  title = "GerotPay Dashboard",
  subtitle = "Welcome to",
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <main className="min-h-screen bg-[#07080b] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-white/[0.03] p-5 md:block">
          <div className="mb-10">
            <p className="text-2xl font-semibold tracking-tight">GerotPay</p>
            <p className="text-xs text-emerald-300">Sepolia testnet</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="flex-1">
          <header className="flex min-h-16 flex-col items-start gap-3 border-b border-white/10 px-4 py-4 sm:min-h-20 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
            <div>
              <p className="text-xs text-zinc-500 sm:text-sm">{subtitle}</p>
<h1 className="text-lg font-semibold sm:text-xl">{title}</h1>
            </div>

            <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300 sm:px-4 sm:py-2 sm:text-sm">
             Wallet coming soon
            </div>
          </header>

          <div className="p-6">{children}</div>
        </section>
      </div>
    </main>
  );
}