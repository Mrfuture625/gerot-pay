import { CreditCard } from "lucide-react";
import { CardStatusBadge } from "./CardStatusBadge";

type Props = {
  cardName: string;
  cardholderName: string;
  status: string;

maskedNumber?: string | null;
expiryMonth?: string | null;
expiryYear?: string | null;

};

export function VirtualCard({
  cardName,
  cardholderName,
  status,
   maskedNumber,
  expiryMonth,
  expiryYear,
  
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/20 via-zinc-900 to-black p-6 shadow-2xl">
      <div className="absolute right-[-60px] top-[-60px] h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-emerald-300">KryptPay</p>
          <h2 className="mt-1 text-xl font-semibold">{cardName}</h2>
        </div>

        <CreditCard className="h-8 w-8 text-emerald-300" />
      </div>

      <div className="relative mt-10">
        <p className="text-2xl font-semibold tracking-[0.25em]">
          {maskedNumber ?? "4242 •••• •••• 6250"}
        </p>
      </div>

      <div className="relative mt-8 flex items-end justify-between">
        <div>
          <p className="text-xs text-zinc-400">Cardholder</p>
          <p className="mt-1 text-sm font-medium uppercase">
            {cardholderName}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-zinc-400">Expires</p>
          <p className="mt-1 text-sm font-medium">{expiryMonth ?? "12"}/{expiryYear ?? "29"}</p>
        </div>
      </div>

      <div className="relative mt-6">
        <CardStatusBadge status={status} />
      </div>
    </div>
  );
}