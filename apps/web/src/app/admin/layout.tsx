import Link from "next/link";
import { AdminGuard } from "@/features/admin/components/AdminGuard";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/rewards", label: "Rewards" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <main className="min-h-screen bg-[#05060a] text-white">
        <div className="flex min-h-screen">
          <aside className="hidden w-72 border-r border-white/10 bg-white/[0.04] p-5 lg:block">
            <div className="mb-8">
              <p className="text-2xl font-bold">KryptPay Admin</p>
              <p className="text-sm text-emerald-300">Operations Console</p>
            </div>

            <nav className="space-y-2">
              {adminLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-2xl px-4 py-3 text-sm text-zinc-300 hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          <section className="min-w-0 flex-1">
            <header className="border-b border-white/10 bg-black/30 px-5 py-4">
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
                Admin
              </p>
            </header>

            <div className="p-5 lg:p-8">{children}</div>
          </section>
        </div>
      </main>
    </AdminGuard>
  );
}