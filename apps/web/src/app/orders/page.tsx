import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/server/users/getCurrentUser";
import { EmptyOrders } from "@/features/orders/components/EmptyOrders";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { OrderSummary } from "@/features/orders/components/OrderSummary";
import { Order } from "@/features/orders/types";

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      cardholder_name,
      customer_email,
      wallet_address,
      price_eth,
      payment_tx_hash,
      status,
      network,
      payment_provider,
      created_at,
      card_products (
        name,
        card_type
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as Order[];

  return (
    <DashboardShell
      title="My Orders"
      subtitle="Track your GerotPay purchases"
    >
      {error ? (
        <p className="text-red-400">Could not load orders.</p>
      ) : (
        <div className="space-y-6">
          <OrderSummary orders={orders} />

          {orders.length > 0 ? (
            <div className="grid gap-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <EmptyOrders />
          )}
        </div>
      )}
    </DashboardShell>
  );
}