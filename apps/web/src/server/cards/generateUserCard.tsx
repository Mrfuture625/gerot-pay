import { supabaseAdmin } from "@/lib/supabase/admin";

function randomDigits(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

function generateCardNumber() {
  return `4242${randomDigits(12)}`;
}

function maskCardNumber(cardNumber: string) {
  return `${cardNumber.slice(0, 4)} •••• •••• ${cardNumber.slice(-4)}`;
}

function generateExpiry() {
  const now = new Date();
  const year = String(now.getFullYear() + 4).slice(-2);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");

  return { month, year };
}

function generateCvv() {
  return randomDigits(3);
}

export async function generateUserCard({
  userId,
  orderId,
  cardProductId,
  cardholderName,
  cardName,
  cardType,
}: {
  userId: string;
  orderId: string;
  cardProductId: string;
  cardholderName: string;
  cardName: string;
  cardType: string;
}) {
  const cardNumber = generateCardNumber();
  const { month, year } = generateExpiry();

  const { error } = await supabaseAdmin.from("user_cards").insert({
    user_id: userId,
    order_id: orderId,
    card_product_id: cardProductId,
    cardholder_name: cardholderName,
    card_name: cardName,
    card_type: cardType,
    card_number: cardNumber,
    masked_number: maskCardNumber(cardNumber),
    expiry_month: month,
    expiry_year: year,
    cvv: generateCvv(),
    balance_eth: 0,
    status: "active",
    source: "generated",
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}