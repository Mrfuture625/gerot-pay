import type { ActivityItem, ActivityType } from "@/types/activity";

export const ACTIVITY_FILTERS: {
  label: string;
  value: "all" | ActivityType;
}[] = [
  { label: "All", value: "all" },
  { label: "Purchases", value: "purchase" },
  { label: "Reloads", value: "reload" },
  { label: "Withdrawals", value: "withdraw" },
  { label: "Rewards", value: "reward" },
  { label: "Referrals", value: "referral" },
];

export function filterActivity(
  activity: ActivityItem[],
  filter: "all" | ActivityType,
) {
  if (filter === "all") return activity;
  return activity.filter((item) => item.type === filter);
}

export function groupActivityByDate(activity: ActivityItem[]) {
  return activity.reduce<Record<string, ActivityItem[]>>((groups, item) => {
    if (!groups[item.dateGroup]) {
      groups[item.dateGroup] = [];
    }

    groups[item.dateGroup].push(item);
    return groups;
  }, {});
}