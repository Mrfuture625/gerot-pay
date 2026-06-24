import { ShoppingBag } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { PurchaseDialog } from "@/features/cards/components/PurchaseDialog";

type Props = {
  name: string;
  cardType: string;
  priceEth: number;
  stock: number;
  description: string | null;
};

export function CardProductCard({ name, cardType, priceEth, stock }: Props) {
  const isPhysical = cardType === "physical";

  return (
    <GlassPanel className="h-full">
      <div
        className={`flex h-full flex-col overflow-hidden rounded-3xl border p-5 ${
          isPhysical
            ? "border-amber-400/25 bg-amber-400/[0.04]"
            : "border-emerald-400/25 bg-emerald-400/[0.04]"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              isPhysical
                ? "bg-amber-400/15 text-amber-300"
                : "bg-emerald-400/15 text-emerald-300"
            }`}
          >
            {isPhysical ? "PHYSICAL" : "VIRTUAL"}
          </span>

          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
            Stock {stock}
          </span>
        </div>

        <h2 className="mt-5 text-2xl font-bold">{name}</h2>

        <div
          className={`mx-auto mt-6 aspect-[1.58/1] w-full max-w-[280px] rounded-2xl border p-5 shadow-2xl ${
            isPhysical
              ? "border-amber-300/40 bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950/60"
              : "border-emerald-300/40 bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/60"
          }`}
        >
          <div className="flex justify-between">
            <p className="font-bold italic">GerotPay</p>
            <p>)))</p>
          </div>

          <div className="mt-12 text-sm tracking-[0.2em] text-white/90">
            •••• •••• •••• 4242
          </div>

          <div className="mt-6 flex justify-between text-xs text-zinc-300">
            <span>{isPhysical ? "PHYSICAL" : "VIRTUAL"}</span>
            <span className="font-black italic text-white">VISA</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-3xl font-bold">{priceEth} ETH</p>
            <p className="text-xs text-zinc-500">Sepolia testnet</p>
          </div>

          <PurchaseDialog
  product={{
    id: "",
    name,
    cardType,
    priceEth,
  }}
>
  <button
    disabled={stock <= 0}
    className={`rounded-2xl px-6 py-3 text-sm font-semibold text-black ${
      isPhysical ? "bg-amber-400" : "bg-emerald-400"
    }`}
  >
    <span className="flex items-center justify-center gap-2">
      <ShoppingBag className="h-4 w-4" />
      Buy Now
    </span>
  </button>
</PurchaseDialog>
        </div>
      </div>
    </GlassPanel>
  );
}