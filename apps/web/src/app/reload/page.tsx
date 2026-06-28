import { DashboardShell } from "@/components/layout/DashboardShell";
import { ReloadFlow } from "@/features/reload/components/ReloadFlow";

export default function ReloadPage() {
  return (
    <DashboardShell title="Reload Card" subtitle="Add funds to your KryptPay card">
      <ReloadFlow />
    </DashboardShell>
  );
}