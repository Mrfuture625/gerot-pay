export function StatusBadge({ status }: { status: string }) {
  const isPaid = status === "paid" || status === "confirmed";

  return (
    <span
      className={
        isPaid
          ? "rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300"
          : "rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-300"
      }
    >
      {status}
    </span>
  );
}