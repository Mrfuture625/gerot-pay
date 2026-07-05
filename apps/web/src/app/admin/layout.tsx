"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AdminGuard } from "@/features/admin/components/AdminGuard";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/rewards", label: "Rewards" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AdminGuard>
      <main className="min-h-screen bg-[#05060a] text-white">
        <div className="flex min-h-screen">
          <aside className="hidden w-72 border-r border-white/10 bg-white/[0.04] p-5 lg:block">
            <AdminSidebar />
          </aside>

          {menuOpen && (
            <div className="fixed inset-0 z-50 bg-black/70 lg:hidden">
              <aside className="h-full w-72 border-r border-white/10 bg-[#08090d] p-5">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-xl font-bold">KryptPay Admin</p>
                  <button onClick={() => setMenuOpen(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <AdminSidebar onClick={() => setMenuOpen(false)} />
              </aside>
            </div>
          )}

          <section className="min-w-0 flex-1">
            <header className="flex items-center justify-between border-b border-white/10 bg-black/30 px-5 py-4">
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
                Admin
              </p>

              <button
                onClick={() => setMenuOpen(true)}
                className="rounded-xl border border-white/10 p-2 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </header>

            <div className="p-5 lg:p-8">{children}</div>
          </section>
        </div>
      </main>
    </AdminGuard>
  );
}

function AdminSidebar({ onClick }: { onClick?: () => void }) {
  return (
    <>
      <div className="mb-8">
        <p className="text-2xl font-bold">KryptPay Admin</p>
        <p className="text-sm text-emerald-300">Operations Console</p>
      </div>

      <nav className="space-y-2">
        {adminLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className="block rounded-2xl px-4 py-3 text-sm text-zinc-300 hover:bg-white/10 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}