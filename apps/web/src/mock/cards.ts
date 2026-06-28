import { APP_CONFIG } from "@/config/app";

export const mockCards = [
  {
    id: "virtual-card",
    type: "virtual" as const,
    name: APP_CONFIG.cards.virtual.name,
    status: "Active",
    balance: 34.2,
    bonus: APP_CONFIG.cards.virtual.bonus,
    bonusStatus: "Locked",
    unlockReload: APP_CONFIG.cards.virtual.unlockReload,
    cardNumber: "4892 •••• •••• 0928",
    expiry: "12/30",
    lastActivity: "Reloaded yesterday",
  },
  {
    id: "physical-card",
    type: "physical" as const,
    name: APP_CONFIG.cards.physical.name,
    status: "Active",
    balance: 102.5,
    bonus: APP_CONFIG.cards.physical.bonus,
    bonusStatus: "Active",
    unlockReload: APP_CONFIG.cards.physical.unlockReload,
    cardNumber: "5391 •••• •••• 7742",
    expiry: "12/30",
    lastActivity: "Purchased 2 days ago",
  },
];

export type MockCard = (typeof mockCards)[number];