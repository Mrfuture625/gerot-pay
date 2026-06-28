import { DashboardShell } from "@/components/layout/DashboardShell";
import { ActivityTimeline } from "@/features/activity/components/ActivityTimeline";
import { getActivityTimeline } from "@/server/activity/activityRepository";

export default async function ActivityPage() {
  const activity = await getActivityTimeline();

  return (
    <DashboardShell title="Activity" subtitle="Track your KryptPay transactions">
      <ActivityTimeline activity={activity} />
    </DashboardShell>
  );
}