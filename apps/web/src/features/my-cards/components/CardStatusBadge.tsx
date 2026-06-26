export function CardStatusBadge({
  status,
}: {
  status: string;
}) {
  const active =
    status === "paid" || status === "confirmed";

  return (
    <span
      className={
        active
          ? "rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300"
          : "rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-300"
      }
    >
      {active ? "Active" : status}
    </span>
  );
}