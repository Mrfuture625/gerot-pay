import type { Address, Hash } from "viem";

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
  cardId?: string;
  activityId?: string;
  error?: string;
}

export async function purchaseCard(
  input: PurchaseInput,
): Promise<PurchaseResult> {
  try {
    const cardId = `${input.cardType}-card`;
    const activityId = `activity-${Date.now()}`;

    console.log("GerotPay purchase placeholder", {
      cardProductId: input.cardProductId,
      cardholderName: input.cardholderName,
      email: input.email,
      walletAddress: input.walletAddress,
      priceEth: input.priceEth,
      txHash: input.txHash,
      cardType: input.cardType,
      shippingAddress: input.shippingAddress,
      cardId,
      activityId,
    });

    return {
      success: true,
      cardId,
      activityId,
    };
  } catch {
    return {
      success: false,
      error: "Purchase failed.",
    };
  }
}