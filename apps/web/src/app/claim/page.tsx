import { DashboardShell } from "@/components/layout/DashboardShell";
import { ClaimRewards } from "@/features/claim/components/ClaimRewards";

export default function ClaimPage() {
  return (
    <DashboardShell title="Claim Rewards" subtitle="">
      <ClaimRewards />
    </DashboardShell>
  );
}