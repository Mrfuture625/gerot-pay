import { GEROTPAY_PRODUCT_IDS } from "@/lib/contracts/gerotpay";

export function getProductIdFromCardType(cardType: string) {
  if (cardType === "physical") {
    return GEROTPAY_PRODUCT_IDS.physical;
  }

  return GEROTPAY_PRODUCT_IDS.virtual;
}