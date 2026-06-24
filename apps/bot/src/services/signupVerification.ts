import argon2 from "argon2";
import { supabase } from "../lib/supabase";

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function completeSignupVerification({
  signupToken,
  telegramId,
  telegramUsername,
}: {
  signupToken: string;
  telegramId: number;
  telegramUsername: string;
}) {
  const otp = generateOtp();
  const otpHash = await argon2.hash(otp, {
    type: argon2.argon2id,
  });

  const { error } = await supabase
    .from("telegram_verifications")
    .update({
      telegram_id: telegramId,
      telegram_username: telegramUsername.toLowerCase(),
      otp_hash: otpHash,
      status: "verified",
      verified_at: new Date().toISOString(),
    })
    .eq("signup_token", signupToken)
    .eq("status", "pending");

  if (error) {
    throw new Error(error.message);
  }

  return otp;
}