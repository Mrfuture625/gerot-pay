import { supabaseAdmin } from "@/lib/supabase/admin";

export async function getActiveCardProducts(
  type?: "virtual" | "physical"
) {
  let query = supabaseAdmin
    .from("card_products")
    .select("*")
    .eq("is_active", true);

  if (type) {
    query = query.eq("card_type", type);
  }

  return query.order("price_eth", {
    ascending: true,
  });
}