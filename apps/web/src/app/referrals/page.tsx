import { DashboardShell } from "@/components/layout/DashboardShell";
import { ReferralDashboard } from "@/features/referral/components/ReferralDashboard";
import { getReferralDashboard } from "@/server/referral/referralRepository";

export default async function ReferralsPage() {
  const { stats, history } = await getReferralDashboard();

  return (
    <DashboardShell title="Referral" subtitle="Invite friends and earn GP">
      <ReferralDashboard stats={stats} history={history} />
    </DashboardShell>
  );
}