export type ActivityType =
  | "purchase"
  | "reload"
  | "withdraw"
  | "reward"
  | "coupon"
  | "referral"
  | "wallet";

export type ActivityStatus = "Completed" | "Pending" | "Failed";

export type ActivityIcon =
  | "credit-card"
  | "gift"
  | "refresh"
  | "upload"
  | "wallet"
  | "coupon";

export type ActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  detail: string;
  amount: string;
  time: string;
  dateGroup: "Today" | "Yesterday" | "Earlier";
  status: ActivityStatus;
  icon: ActivityIcon;
};