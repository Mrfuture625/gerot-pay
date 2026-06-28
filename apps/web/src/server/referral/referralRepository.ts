import {
  mockReferralHistory,
  mockReferralStats,
} from "@/mock/referral";

export async function getReferralDashboard() {
  return {
    stats: mockReferralStats,
    history: mockReferralHistory,
  };
}