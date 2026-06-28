import { DashboardShell } from "@/components/layout/DashboardShell";
import { WithdrawFlow } from "@/features/withdraw/components/WithdrawFlow";

export default function WithdrawPage() {
  return (
    <DashboardShell
      title="Withdraw Funds"
      subtitle="Move funds from your GerotPay card"
    >
      <WithdrawFlow />
    </DashboardShell>
  );
}