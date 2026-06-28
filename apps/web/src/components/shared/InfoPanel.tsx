import { CreditCard } from "lucide-react";

type InfoPanelProps = {
  icon: typeof CreditCard;
  label: string;
  value: string;
  note?: string;
};

export function InfoPanel({ icon: Icon, label, value, note }: InfoPanelProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-5 w-fit rounded-2xl border border-white/10 bg-black/30 p-3">
        <Icon className="h-5 w-5 text-emerald-300" />
      </div>

      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>

      {note ? <p className="mt-2 text-sm text-zinc-500">{note}</p> : null}
    </div>
  );
}