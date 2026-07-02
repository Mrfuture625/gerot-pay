export interface UserDto {
  id: string;
  walletAddress: string;

  email?: string | null;

  telegramId?: string | null;
  telegramUsername?: string | null;

  telegramCompleted: boolean;

  signupRewardEligible: boolean;
  signupRewardClaimed: boolean;

  createdAt: string;
  updatedAt: string;
}