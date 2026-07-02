import { RewardType } from "../enums";

export interface RewardDto {
  id: string;
  walletAddress: string;

  contractRewardId?: string;
  createdAtOnchain?: string;

  rewardType: RewardType;
  amount: string;

  claimed: boolean;
  claimedAt?: string | null;

  createdAt: string;
}