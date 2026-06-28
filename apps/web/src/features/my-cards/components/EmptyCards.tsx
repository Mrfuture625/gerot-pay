import Link from "next/link";
import { CreditCard } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";

export function EmptyCards() {
  return (
    <GlassPanel className="text-center">
      <CreditCard className="mx-auto h-10 w-10 text-emerald-300" />

      <h2 className="mt-4 text-xl font-semibold">
        No cards yet
      </h2>

      <p className="mt-2 text-sm text-zinc-400">
        Purchase your first KryptPay card from the marketplace.
      </p>

      <Link
        href="/marketplace"
        className="mt-5 inline-flex rounded-full bg-emerald-400 px-5 py-2 text-sm font-medium text-black hover:bg-emerald-300"
      >
        Browse Marketplace
      </Link>
    </GlassPanel>
  );
}