"use client";

import { useMemo, useState } from "react";
import {
  BadgePercent,
  CreditCard,
  Gift,
  RefreshCw,
  Upload,
  Wallet,
} from "lucide-react";
import type { ActivityIcon, ActivityType } from "@/types/activity";
import {
  ACTIVITY_FILTERS,
  filterActivity,
  groupActivityByDate,
} from "@/server/activity/activityService";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { ActivityItem } from "@/types/activity";

const icons: Record<ActivityIcon, typeof CreditCard> = {
  "credit-card": CreditCard,
  gift: Gift,
  refresh: RefreshCw,
  upload: Upload,
  wallet: Wallet,
  coupon: BadgePercent,
};

export function ActivityTimeline({ activity }: { activity: ActivityItem[] }) {
  const [activeFilter, setActiveFilter] = useState<"all" | ActivityType>("all");

  const filteredActivity = useMemo(() => {
    return filterActivity(activity, activeFilter);
  }, [activity, activeFilter]);

  const groupedActivity = useMemo(() => {
    return groupActivityByDate(filteredActivity);
  }, [filteredActivity]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Activity"
        title="Wallet activity timeline."
        description="Track card purchases, reloads, withdrawals, coupons, rewards and referrals from one premium activity timeline."
      />

      <div className="flex gap-2 overflow-x-auto pb-2">
        {ACTIVITY_FILTERS.map((filter) => {
          const isActive = activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                isActive
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                  : "border-white/10 text-zinc-400 hover:bg-white/10"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
        {Object.keys(groupedActivity).length ? (
          <div className="space-y-8">
            {Object.entries(groupedActivity).map(([group, items]) => (
              <div key={group}>
                <p className="mb-4 text-sm uppercase tracking-[0.25em] text-emerald-300">
                  {group}
                </p>

                <div className="space-y-3">
                  {items.map((item) => {
                    const Icon = icons[item.icon];

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/25 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                            <Icon className="h-5 w-5 text-emerald-300" />
                          </div>

                          <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-zinc-500">
                              {item.detail}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                          <p className="font-semibold">{item.amount}</p>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={item.status} />
                            <span className="text-xs text-zinc-500">
                              {item.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-black/25 p-10 text-center text-zinc-400">
            No activity found for this filter.
          </div>
        )}
      </section>
    </div>
  );
}