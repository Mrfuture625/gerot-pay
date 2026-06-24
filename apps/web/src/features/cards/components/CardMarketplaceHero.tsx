import { Globe, Headphones, Send, ShieldCheck } from "lucide-react";

const items = [
  { title: "Instant Delivery", note: "Via Telegram", icon: Send },
  { title: "Secure & Encrypted", note: "Your data is protected", icon: ShieldCheck },
  { title: "Global Access", note: "Use anywhere", icon: Globe },
  { title: "24/7 Support", note: "We're here to help", icon: Headphones },
];

export function CardMarketplaceHero() {
  return (
    <div className="mb-8 rounded-3xl border border-emerald-400/30 bg-gradient-to-r from-emerald-500/15 via-white/[0.04] to-emerald-500/10 p-6 shadow-[0_0_60px_rgba(16,185,129,0.08)]">
      <p className="mb-5 text-sm font-medium text-white">
        All cards are secured by blockchain technology and delivered through Telegram.
      </p>

      <div className="grid gap-4 md:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-400/15 p-3 text-emerald-300">
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-zinc-400">{item.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}