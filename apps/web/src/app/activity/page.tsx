import { DashboardShell } from "@/components/layout/DashboardShell";
import { ActivityTimeline } from "@/features/activity/components/ActivityTimeline";

export default function ActivityPage() {
  return (
    <DashboardShell title="Activity" subtitle="">
      <ActivityTimeline />
    </DashboardShell>
  );
}