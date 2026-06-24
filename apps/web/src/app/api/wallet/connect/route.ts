import { NextResponse } from "next/server";
import { validateSession } from "@/server/sessions/validateSession";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const session = await validateSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const walletAddress = String(body.walletAddress || "").toLowerCase();

  if (!walletAddress || !walletAddress.startsWith("0x")) {
    return NextResponse.json(
      { error: "Invalid wallet address." },
      { status: 400 }
    );
  }

  const { data: existingWalletUser } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("wallet_address", walletAddress)
    .maybeSingle();

  if (existingWalletUser && existingWalletUser.id !== session.user_id) {
    return NextResponse.json(
      { error: "This wallet is already linked to another account." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("users")
    .update({ wallet_address: walletAddress })
    .eq("id", session.user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}