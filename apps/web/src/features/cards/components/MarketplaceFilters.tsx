import Link from "next/link";

const filters = [
  { label: "All", href: "/cards" },
  { label: "Virtual", href: "/cards?type=virtual" },
  { label: "Physical", href: "/cards?type=physical" },
];

export function MarketplaceFilters() {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {filters.map((filter) => (
        <Link
          key={filter.href}
          href={filter.href}
          className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-zinc-300 transition hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
        >
          {filter.label}
        </Link>
      ))}
    </div>
  );
}