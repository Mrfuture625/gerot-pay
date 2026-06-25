import Link from "next/link";
import { Package } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";

export function EmptyOrders() {
  return (
    <GlassPanel className="text-center">
      <Package className="mx-auto h-10 w-10 text-emerald-300" />

      <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>

      <p className="mt-2 text-sm text-zinc-400">
        Purchase your first GerotPay card to see it here.
      </p>

      <Link
        href="/cards"
        className="mt-5 inline-flex rounded-full bg-emerald-400 px-5 py-2 text-sm font-medium text-black transition hover:bg-emerald-300"
      >
        Browse Cards
      </Link>
    </GlassPanel>
  );
}