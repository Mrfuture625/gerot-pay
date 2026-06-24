import { GlassPanel } from "@/components/shared/GlassPanel";

export function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <GlassPanel>
      <p className="text-sm text-zinc-400">{label}</p>
      <h2 className="mt-3 break-words text-3xl font-semibold sm:text-4xl lg:text-5xl">
        {value}
      </h2>
      <p className="mt-2 text-sm text-zinc-500">{note}</p>
    </GlassPanel>
  );
}