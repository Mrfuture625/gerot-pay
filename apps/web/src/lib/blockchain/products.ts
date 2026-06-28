import { KryptPay_PRODUCT_IDS } from "@/lib/contracts/gerotpay";

export function getProductIdFromCardType(cardType: string) {
  if (cardType === "physical") {
    return KryptPay_PRODUCT_IDS.physical;
  }

  return KryptPay_PRODUCT_IDS.virtual;
}