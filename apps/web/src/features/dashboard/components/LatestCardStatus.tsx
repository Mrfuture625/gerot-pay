import Link from "next/link";
import { CreditCard } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";

type Props = {
  cardName: string;
  price: number;
  status: string;
};

export function LatestCardStatus({
  cardName,
  price,
  status,
}: Props) {
  return (
    <GlassPanel>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">
            Latest Card
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            {cardName}
          </h2>
        </div>

        <CreditCard className="h-8 w-8 text-emerald-300" />
      </div>

      <div className="mt-6">
        <p className="text-sm text-zinc-500">
          Purchase Amount
        </p>

        <p className="mt-1 text-3xl font-bold">
          {price} ETH
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300">
          {status}
        </span>

        <Link
          href="/orders"
          className="text-sm text-emerald-300 hover:underline"
        >
          View Orders →
        </Link>
      </div>
    </GlassPanel>
  );
}