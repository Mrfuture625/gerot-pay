import { APP_CONFIG } from "@/config/app";

export async function getPlatformSettings() {
  return {
    paymentToken: APP_CONFIG.payment.defaultToken,

    cards: {
      virtual: APP_CONFIG.cards.virtual,
      physical: APP_CONFIG.cards.physical,
    },

    referral: APP_CONFIG.referral,
  };
}