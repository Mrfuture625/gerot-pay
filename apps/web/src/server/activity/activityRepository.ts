import { mockActivity } from "@/mock/activity";

export async function getActivityTimeline() {
  return mockActivity;
}

export async function getCardActivity(cardId: string) {
  return mockActivity
    .filter((activity) =>
      ["purchase", "reload", "withdraw", "reward", "coupon"].includes(
        activity.type,
      ),
    )
    .map((activity) => ({
      ...activity,
      cardId,
    }));
}