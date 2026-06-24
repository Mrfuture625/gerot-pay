export type CreateUserInput = {
  name: string;
  telegramId: number;
  telegramUsername: string;
  passwordHash: string;
  referralCode: string;
  referredBy?: string | null;
};