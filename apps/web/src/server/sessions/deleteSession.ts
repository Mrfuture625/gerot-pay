import crypto from "crypto";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gerotpay_session")?.value;

  if (token) {
    const tokenHash = hashToken(token);

    await supabaseAdmin
      .from("sessions")
      .delete()
      .eq("token_hash", tokenHash);
  }

  cookieStore.delete("gerotpay_session");
}