"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, setAdminToken } from "@/lib/services/adminService";

export function AdminLoginForm() {
  const router = useRouter();
  const [adminKey, setAdminKey] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    try {
      const result = await adminLogin(adminKey);
      setAdminToken(result.token);
      router.push("/admin");
    } catch {
      alert("Invalid admin key");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#05060a] p-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <h1 className="text-2xl font-bold">KryptPay Admin Login</h1>

        <input
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          placeholder="Enter admin key"
          type="password"
          className="mt-6 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
        />

        <button
          onClick={handleLogin}
          disabled={!adminKey || loading}
          className="mt-4 w-full rounded-2xl bg-emerald-400 px-5 py-3 font-semibold text-black disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </main>
  );
}