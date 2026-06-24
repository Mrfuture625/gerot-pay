export type SignupInput = {
  name: string;
  password: string;
  signupToken: string;
  otp: string;
  referredBy?: string | null;
};

export type LoginInput = {
  telegramUsername: string;
  password: string;
};