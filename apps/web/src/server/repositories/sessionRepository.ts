import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createSessionRecord({
  userId,
  tokenHash,
  expiresAt,
}: {
  userId: string;
  tokenHash: string;
  expiresAt: string;
}) {
  return supabaseAdmin.from("sessions").insert({
    user_id: userId,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });
}

export async function getSessionByTokenHash(tokenHash: string) {
  return supabaseAdmin
    .from("sessions")
    .select("id, user_id, expires_at, users(*)")
    .eq("token_hash", tokenHash)
    .single();
}

export async function deleteSessionByTokenHash(tokenHash: string) {
  return supabaseAdmin.from("sessions").delete().eq("token_hash", tokenHash);
}