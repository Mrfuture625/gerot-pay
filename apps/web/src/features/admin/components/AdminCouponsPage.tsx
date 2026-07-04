"use client";

import { useEffect, useState } from "react";
import {
  getAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
deleteAdminCoupon,
} from "@/lib/services/adminService";

type Coupon = {
  id: string;
  code: string;
  active: boolean;
  discountType: "PERCENT" | "FIXED";
  discountValue: string;
  appliesTo: "ALL" | "VIRTUAL_CARD" | "PHYSICAL_CARD";
  minimumOrderAmount: string | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  createdAt: string;
};

export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
const [form, setForm] = useState({
  code: "",
  discountType: "PERCENT",
  discountValue: "",
  appliesTo: "ALL",
  minimumOrderAmount: "",
  maxUses: "",
  expiresAt: "",
  active: true,
});

  useEffect(() => {
    loadCoupons();
  }, []);

  async function loadCoupons() {
    setLoading(true);

    try {
const data = await getAdminCoupons();
setCoupons(data.coupons);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCoupon() {
  await createAdminCoupon({
    ...form,
    minimumOrderAmount: form.minimumOrderAmount || null,
    maxUses: form.maxUses || null,
    expiresAt: form.expiresAt || null,
  });

  setShowForm(false);
  await loadCoupons();
}

async function handleToggleCoupon(coupon: Coupon) {
  await updateAdminCoupon(coupon.id, {
    active: !coupon.active,
  });

  await loadCoupons();
}

async function handleDeleteCoupon(id: string) {
  if (!confirm("Delete this coupon?")) return;

  await deleteAdminCoupon(id);
  await loadCoupons();
}

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
            Coupons
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Coupon Management
          </h1>

          <p className="mt-2 text-zinc-400">
            Create and manage promotional coupon codes.
          </p>
        </div>

        <button
  onClick={() => setShowForm(true)}
  className="rounded-2xl bg-emerald-400 px-5 py-3 font-semibold text-black"
>
  + New Coupon
</button>

      </div>

      <div className="grid gap-4 md:grid-cols-4">

        <StatCard
          label="Coupons"
          value={String(coupons.length)}
        />

        <StatCard
          label="Active"
          value={String(coupons.filter(c => c.active).length)}
        />

        <StatCard
          label="Inactive"
          value={String(coupons.filter(c => !c.active).length)}
        />

        <StatCard
          label="Total Uses"
          value={String(
            coupons.reduce((sum, c) => sum + c.usedCount, 0)
          )}
        />

      </div>

{showForm && (
  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
    <h2 className="mb-4 text-xl font-semibold">Create Coupon</h2>

    <div className="grid gap-3 md:grid-cols-2">
      <input
        placeholder="Code"
        value={form.code}
        onChange={(e) => setForm({ ...form, code: e.target.value })}
        className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
      />

      <input
        placeholder="Discount Value"
        value={form.discountValue}
        onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
        className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
      />

      <select
        value={form.discountType}
        onChange={(e) => setForm({ ...form, discountType: e.target.value })}
        className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
      >
        <option value="PERCENT">Percent</option>
        <option value="FIXED">Fixed</option>
      </select>

      <select
        value={form.appliesTo}
        onChange={(e) => setForm({ ...form, appliesTo: e.target.value })}
        className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
      >
        <option value="ALL">All</option>
        <option value="VIRTUAL_CARD">Virtual Card</option>
        <option value="PHYSICAL_CARD">Physical Card</option>
      </select>

      <input
        placeholder="Minimum Order Amount"
        value={form.minimumOrderAmount}
        onChange={(e) =>
          setForm({ ...form, minimumOrderAmount: e.target.value })
        }
        className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
      />

      <input
        placeholder="Max Uses"
        value={form.maxUses}
        onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
        className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
      />

      <input
        type="date"
        value={form.expiresAt}
        onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
        className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
      />
    </div>

    <div className="mt-4 flex gap-3">
      <button
        onClick={handleCreateCoupon}
        className="rounded-2xl bg-emerald-400 px-5 py-3 font-semibold text-black"
      >
        Create
      </button>

      <button
        onClick={() => setShowForm(false)}
        className="rounded-2xl border border-white/10 px-5 py-3"
      >
        Cancel
      </button>
    </div>
  </div>
)}

      <div className="rounded-3xl border border-white/10 bg-white/[0.04]">

        {loading ? (

          <div className="p-10 text-center text-zinc-400">
            Loading coupons...
          </div>

        ) : coupons.length === 0 ? (

          <div className="p-10 text-center text-zinc-400">
            No coupons created yet.
          </div>

        ) : (

          <table className="w-full">

            <thead>

              <tr className="border-b border-white/10 text-left">

                <th className="p-4">Code</th>
                <th>Discount</th>
                <th>Applies To</th>
                <th>Status</th>
                <th>Uses</th>
                <th></th>

              </tr>

            </thead>

            <tbody>

              {coupons.map((coupon) => (

                <tr
                  key={coupon.id}
                  className="border-b border-white/5"
                >

                  <td className="p-4 font-semibold">
                    {coupon.code}
                  </td>

                  <td>
                    {coupon.discountType === "PERCENT"
                      ? `${coupon.discountValue}%`
                      : `$${coupon.discountValue}`}
                  </td>

                  <td>{coupon.appliesTo}</td>

                  <td>

                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        coupon.active
                          ? "bg-emerald-400/20 text-emerald-300"
                          : "bg-red-400/20 text-red-300"
                      }`}
                    >
                      {coupon.active ? "Active" : "Disabled"}
                    </span>

                  </td>

                  <td>
                    {coupon.usedCount}
                    {coupon.maxUses
                      ? ` / ${coupon.maxUses}`
                      : ""}
                  </td>

                 <td className="space-x-3">
  <button
    onClick={() => handleToggleCoupon(coupon)}
    className="text-emerald-300"
  >
    {coupon.active ? "Disable" : "Enable"}
  </button>

  <button
    onClick={() => handleDeleteCoupon(coupon.id)}
    className="text-red-300"
  >
    Delete
  </button>
</td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">

      <p className="text-sm text-zinc-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

    </div>
  );
}