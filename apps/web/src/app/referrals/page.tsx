import { DashboardShell } from "@/components/layout/DashboardShell";
import { ReferralDashboard } from "@/features/referral/components/ReferralDashboard";

export default function ReferralsPage() {
  return (
    <DashboardShell title="Referral" subtitle="Invite friends and earn $KPAY">
      <ReferralDashboard />
    </DashboardShell>
  );
}