import type { Hash, Address } from "viem";

import { createOrder } from "@/server/orders/createOrder";

export interface PurchaseInput {
  productId: number;
  cardProductId: string;

  cardType: "virtual" | "physical";

  cardholderName: string;
  email: string;

  walletAddress: Address;

  txHash: Hash;

  priceEth: number;

  shippingAddress?: {
    country: string;
    state: string;
    city: string;
    postalCode: string;
    addressLine1: string;
    addressLine2?: string;
  };
}

export interface PurchaseResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

export async function purchaseCard(
  input: PurchaseInput
): Promise<PurchaseResult> {
  const result = await createOrder({
    cardProductId: input.cardProductId,
    cardholderName: input.cardholderName,
    customerEmail: input.email,
    walletAddress: input.walletAddress,
    priceEth: input.priceEth,
    txHash: input.txHash,
    cardType: input.cardType,
    shippingAddress: input.shippingAddress,
  });

  if ("error" in result) {
    return {
      success: false,
      error: result.error,
    };
  }

  return {
    success: true,
    orderId: result.orderId,
  };
}