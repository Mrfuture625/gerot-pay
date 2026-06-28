export type ReferralRewardStatus = "Completed" | "Pending";

export type ReferralHistoryItem = {
  id: string;
  wallet: string;
  joinedAt: string;
  reward: string;
  status: ReferralRewardStatus;
};

export type ReferralStats = {
  referralCode: string;
  referralLink: string;
  friendsJoined: number;
  gpEarned: number;
  pendingRewards: number;
};