import Link from "next/link";
import { CreditCard, Gift, RefreshCw, Upload } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";

const actions = [
  { label: "Buy Card", href: "/cards", icon: CreditCard },
  { label: "Reload", href: "/reload", icon: RefreshCw },
  { label: "Withdraw", href: "/withdraw", icon: Upload },
  { label: "Referral", href: "/referrals", icon: Gift },
];

export function QuickActions() {
  return (
    <GlassPanel>
      <p className="text-sm text-zinc-400">Quick Actions</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center transition hover:bg-white/10"
            >
              <Icon className="mx-auto h-5 w-5 text-emerald-300" />
              <p className="mt-2 text-sm">{action.label}</p>
            </Link>
          );
        })}
      </div>
    </GlassPanel>
  );
}