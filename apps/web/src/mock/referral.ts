import type { ReferralHistoryItem, ReferralStats } from "@/types/referral";

export const mockReferralStats: ReferralStats = {
  referralCode: "KryptPay-9F2A",
  referralLink: "https://KryptPay.com?ref=KryptPay-9F2A",
  friendsJoined: 12,
  gpEarned: 120,
  pendingRewards: 15,
};

export const mockReferralHistory: ReferralHistoryItem[] = [
  {
    id: "ref-1",
    wallet: "0x92a4...18fd",
    joinedAt: "Today",
    reward: "+10 GP",
    status: "Completed",
  },
  {
    id: "ref-2",
    wallet: "0x7cd1...a02b",
    joinedAt: "Yesterday",
    reward: "+10 GP",
    status: "Completed",
  },
  {
    id: "ref-3",
    wallet: "0x4ab8...91cc",
    joinedAt: "Earlier",
    reward: "+10 GP",
    status: "Pending",
  },
];