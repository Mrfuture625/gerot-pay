import { GlassPanel } from "@/components/shared/GlassPanel";
import { Order } from "../types";

export function OrderSummary({ orders }: { orders: Order[] }) {
  const totalOrders = orders.length;

  const totalEth = orders.reduce(
    (sum, order) => sum + Number(order.price_eth ?? 0),
    0
  );

  const paidOrders = orders.filter(
    (order) =>
      order.status === "paid" ||
      order.status === "confirmed"
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <GlassPanel>
        <p className="text-sm text-zinc-400">
          Total Orders
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {totalOrders}
        </h2>
      </GlassPanel>

      <GlassPanel>
        <p className="text-sm text-zinc-400">
          ETH Spent
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {totalEth.toFixed(4)} ETH
        </h2>
      </GlassPanel>

      <GlassPanel>
        <p className="text-sm text-zinc-400">
          Successful Payments
        </p>

        <h2 className="mt-2 text-3xl font-bold text-emerald-300">
          {paidOrders}
        </h2>
      </GlassPanel>
    </div>
);
}