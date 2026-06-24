import { supabaseAdmin } from "@/lib/supabase/admin";

export async function getUserByTelegramUsername(username: string) {
  return supabaseAdmin
    .from("users")
    .select("*")
    .eq("telegram_username", username.toLowerCase())
    .single();
}

export async function getUserByTelegramId(telegramId: number) {
  return supabaseAdmin
    .from("users")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();
}

export async function getUserById(userId: string) {
  return supabaseAdmin.from("users").select("*").eq("id", userId).single();
}

export async function createUserRecord({
  name,
  telegramId,
  telegramUsername,
  passwordHash,
  referralCode,
  referredBy,
}: {
  name: string;
  telegramId: number;
  telegramUsername: string;
  passwordHash: string;
  referralCode: string;
  referredBy?: string | null;
}) {
  return supabaseAdmin.from("users").insert({
    name,
    telegram_id: telegramId,
    telegram_username: telegramUsername.toLowerCase(),
    password_hash: passwordHash,
    referral_code: referralCode,
    referred_by: referredBy ?? null,
    is_verified: true,
  }).select("*").single();
}

export async function updateUserLastLogin(userId: string) {
  return supabaseAdmin
    .from("users")
    .update({ last_login: new Date().toISOString() })
    .eq("id", userId);
}