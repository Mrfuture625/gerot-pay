import { LogoutButton } from "@/components/auth/LogoutButton";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ConnectWalletButton } from "@/features/wallet/components/ConnectWalletButton";
import { NetworkWarning } from "@/features/wallet/components/NetworkWarning";
import { WalletAutoLink } from "@/features/wallet/components/WalletAutoLink";
import { WalletSummaryCard } from "@/features/wallet/components/WalletSummaryCard";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { ProfileCard } from "@/features/dashboard/components/ProfileCard";
import { getCurrentUser } from "@/server/users/getCurrentUser";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { LatestCardStatus } from "@/features/dashboard/components/LatestCardStatus";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { data: latestOrder } = await supabaseAdmin
  .from("orders")
  .select(`
    price_eth,
    status,
    card_products (
      name
    )
  `)
  .eq("user_id", user.id)
  .order("created_at", { ascending: false })
  .limit(1)
  .single();

const order = latestOrder as any;

  return (
    <DashboardShell>
      <ProfileCard
 name={String(user.name)}
telegramUsername={String(user.telegram_username)}
/>

      <WalletAutoLink />
      
      <NetworkWarning />

      <div className="mb-6 mt-6 flex justify-end gap-3">
        <ConnectWalletButton />
        <LogoutButton />
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        <WalletSummaryCard />

        {order ? (
  <LatestCardStatus
    cardName={order.card_products?.name ?? "GerotPay Card"}
    price={Number(order.price_eth)}
    status={order.status}
  />
) : (
  <StatCard
    label="Card Status"
    value="No card yet"
    note="Purchase a virtual or physical card."
  />
)}

        <StatCard
          label="Referral"
          value="1% Reward"
          note="Earn from purchases and reloads."
        />
      </div>
      <div className="mt-6">
  <QuickActions />
</div>
    </DashboardShell>
  );
}