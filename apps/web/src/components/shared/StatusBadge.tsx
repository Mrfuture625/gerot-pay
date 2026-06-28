type StatusBadgeProps = {
  status: "Active" | "Locked" | "Pending" | "Failed" | "Completed";
};

const styles = {
  Active: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  Completed: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  Locked: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Pending: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  Failed: "border-red-400/20 bg-red-400/10 text-red-300",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}