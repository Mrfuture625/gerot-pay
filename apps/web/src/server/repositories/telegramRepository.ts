import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createTelegramVerification({
  signupToken,
  expiresAt,
}: {
  signupToken: string;
  expiresAt: string;
}) {
  return supabaseAdmin.from("telegram_verifications").insert({
    signup_token: signupToken,
    expires_at: expiresAt,
    status: "pending",
  });
}

export async function updateTelegramVerificationFromBot({
  signupToken,
  telegramId,
  telegramUsername,
  otpHash,
}: {
  signupToken: string;
  telegramId: number;
  telegramUsername: string;
  otpHash: string;
}) {
  return supabaseAdmin
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
}

export async function getTelegramVerificationByToken(signupToken: string) {
  return supabaseAdmin
    .from("telegram_verifications")
    .select("*")
    .eq("signup_token", signupToken)
    .single();
}

export async function markTelegramVerificationUsed(id: string) {
  return supabaseAdmin
    .from("telegram_verifications")
    .update({ used: true })
    .eq("id", id);
}