export type TelegramVerification = {
  id: string;
  signup_token: string;
  telegram_id: number | null;
  telegram_username: string | null;
  otp_hash: string | null;
  status: string;
  used: boolean;
  expires_at: string;
  created_at: string;
  verified_at: string | null;
};