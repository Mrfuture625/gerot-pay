"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/server/users/getCurrentUser";
import { generateUserCard } from "@/server/cards/generateUserCard";

type CreateOrderInput = {
  cardProductId: string;
  cardholderName: string;
  customerEmail: string;
  walletAddress: string;
  priceEth: number;
  txHash: string;
  cardType: "virtual" | "physical";
  shippingAddress?: {
    country: string;
    state: string;
    city: string;
    postalCode: string;
    addressLine1: string;
    addressLine2?: string;
  };
};

export async function createOrder(input: CreateOrderInput) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "You must be logged in to create an order." };
  }

  const orderResult = await supabaseAdmin
    .from("orders")
    .insert({
      user_id: user.id,
      card_product_id: input.cardProductId,
      cardholder_name: input.cardholderName,
      customer_email: input.customerEmail,
      wallet_address: input.walletAddress,
      price_eth: input.priceEth,
      payment_tx_hash: input.txHash,
      status: "paid",
      network: "sepolia",
      payment_provider: "wallet",
    })
    .select(`
  id,
  card_product_id,
  card_products (
    name,
    card_type
  )
`)
    .single();

  if (orderResult.error || !orderResult.data) {
    return { error: orderResult.error?.message || "Could not create order." };
  }

  const order = orderResult.data as any;

const cardResult = await generateUserCard({
  userId: user.id,
  orderId: order.id,
  cardProductId: order.card_product_id,
  cardholderName: input.cardholderName,
  cardName: order.card_products?.name ?? "GerotPay Card",
  cardType: order.card_products?.card_type ?? input.cardType,
});

if ("error" in cardResult) {
  return { error: cardResult.error };
}

  if (input.cardType === "physical" && input.shippingAddress) {
    const shippingResult = await supabaseAdmin
      .from("shipping_addresses")
      .insert({
        order_id: orderResult.data.id,
        country: input.shippingAddress.country,
        state: input.shippingAddress.state,
        city: input.shippingAddress.city,
        postal_code: input.shippingAddress.postalCode,
        address_line1: input.shippingAddress.addressLine1,
        address_line2: input.shippingAddress.addressLine2 ?? null,
      });

    if (shippingResult.error) {
      return { error: shippingResult.error.message };
    }
  }

  return {
  orderId: order.id,
};
}