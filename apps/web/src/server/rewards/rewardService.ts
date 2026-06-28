import { APP_CONFIG } from "@/config/app";

export function getCardPurchaseReward(cardType: "virtual" | "physical") {
  return cardType === "virtual"
    ? APP_CONFIG.cards.virtual.reward
    : APP_CONFIG.cards.physical.reward;
}

export function getReferralRewards() {
  return {
    referrerReward: APP_CONFIG.referral.referrerReward,
    refereeReward: APP_CONFIG.referral.refereeReward,
  };
}