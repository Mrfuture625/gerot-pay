import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, CreditCard, ExternalLink, Wallet } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/server/users/getCurrentUser";

export default async function ActivityPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      price_eth,
      status,
      wallet_address,
      payment_tx_hash,
      network,
      created_at,
      card_products (
        name,
        card_type
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const activities = (data ?? []) as any[];

  return (
    <DashboardShell title="Activity" subtitle="Track your GerotPay timeline">
      <div className="space-y-6">
        <GlassPanel>
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-emerald-300" />
            <div>
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <p className="text-sm text-zinc-400">
                Blockchain payments, orders, and card activity.
              </p>
            </div>
          </div>
        </GlassPanel>

        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((item) => (
              <GlassPanel key={item.id}>
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20">
                    <CreditCard className="h-5 w-5 text-emerald-300" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-semibold">
                          Card Purchased
                        </h3>
                        <p className="mt-1 text-sm text-zinc-400">
                          {item.card_products?.name ?? "GerotPay Card"} •{" "}
                          {item.price_eth} ETH
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-zinc-400 sm:grid-cols-2">
                      <p>
                        <Wallet className="mr-2 inline h-4 w-4" />
                        {item.wallet_address?.slice(0, 6)}...
                        {item.wallet_address?.slice(-4)}
                      </p>

                      <p>{new Date(item.created_at).toLocaleString()}</p>
                    </div>

                    {item.payment_tx_hash && (
                      <Link
                        href={`https://sepolia.etherscan.io/tx/${item.payment_tx_hash}`}
                        target="_blank"
                        className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-300 hover:underline"
                      >
                        View transaction <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        ) : (
          <GlassPanel className="text-center">
            <Activity className="mx-auto h-10 w-10 text-zinc-500" />
            <h2 className="mt-4 text-xl font-semibold">No activity yet</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Your GerotPay activity will appear here after your first purchase.
            </p>
          </GlassPanel>
        )}
      </div>
    </DashboardShell>
  );
}