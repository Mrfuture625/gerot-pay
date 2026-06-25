import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { Order } from "../types";
import { StatusBadge } from "./StatusBadge";

function shortText(value?: string | null) {
  if (!value) return "N/A";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function OrderCard({ order }: { order: Order }) {
  return (
    <GlassPanel>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            {order.card_products?.name ?? "GerotPay Card"}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            {order.card_products?.card_type ?? "Card"}
          </p>
        </div>

        <StatusBadge status={order.status} />
      </div>

      <div className="mt-5 grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
        <p><span className="text-zinc-500">Amount:</span> {order.price_eth} ETH</p>
        <p><span className="text-zinc-500">Network:</span> {order.network ?? "Sepolia"}</p>
        <p><span className="text-zinc-500">Wallet:</span> {shortText(order.wallet_address)}</p>
        <p><span className="text-zinc-500">Payment:</span> {order.payment_provider ?? "wallet"}</p>
      </div>

      {order.payment_tx_hash && (
        <Link
          href={`https://sepolia.etherscan.io/tx/${order.payment_tx_hash}`}
          target="_blank"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-300 hover:text-emerald-200"
        >
          View transaction <ExternalLink className="h-4 w-4" />
        </Link>
      )}
    </GlassPanel>
  );
}