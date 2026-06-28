import { mockDashboardData } from "@/mock/dashboard";
import { mockCards } from "@/mock/cards";
import { mockCardTransactions } from "@/mock/transactions";

export async function getDashboardOverview() {
  return {
    overview: mockDashboardData,
    cards: mockCards,
    recentActivity: mockCardTransactions.slice(0, 4),
  };
}