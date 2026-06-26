import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { EmptyCards } from "@/features/my-cards/components/EmptyCards";
import { VirtualCard } from "@/features/my-cards/components/VirtualCard";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/server/users/getCurrentUser";

function shortAddress(address?: string | null) {
  if (!address) return "N/A";
  return `${address.slice(0, 5)}...${address.slice(-3)}`;
}

export default async function MyCardsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabaseAdmin
  .from("user_cards")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });

const cards = (data ?? []) as any[];

  return (
    <DashboardShell
      title="My Cards"
      subtitle="Manage your GerotPay cards"
    >
      {cards.length === 0 ? (
  <EmptyCards />
) : (
  <div className="space-y-6">
    {cards.map((card) => (
      <div
        key={card.id}
        className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
      >
        <VirtualCard
          cardName={card.card_name ?? "GerotPay Card"}
          cardholderName={card.cardholder_name ?? "GerotPay User"}
          status={card.status}
          maskedNumber={card.masked_number}
          expiryMonth={card.expiry_month}
          expiryYear={card.expiry_year}
        />

        <GlassPanel>
          <h2 className="text-xl font-semibold">Card Information</h2>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm text-zinc-500">Card Balance</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-300">
                {Number(card.balance_eth ?? 0).toFixed(2)} ETH
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Wallet Address</p>
              <p className="mt-1 text-sm">
                {shortAddress(card.wallet_address)}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Purchased On</p>
              <p className="mt-1">
                {new Date(card.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </GlassPanel>
      </div>
    ))}
  </div>
)}
    </DashboardShell>
  );
}