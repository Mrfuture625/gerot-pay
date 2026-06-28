import crypto from "crypto";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function validateSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("KryptPay_session")?.value;

  if (!token) return null;

  const tokenHash = hashToken(token);

  const { data, error } = await supabaseAdmin
    .from("sessions")
    .select("id, user_id, expires_at, users(*)")
    .eq("token_hash", tokenHash)
    .single();

  if (error || !data) return null;

  if (new Date(data.expires_at) < new Date()) {
    return null;
  }

  return data;
}