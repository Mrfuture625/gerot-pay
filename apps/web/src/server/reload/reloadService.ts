import { willUnlockBonus } from "@/server/bonus/bonusService";

export function canReload({
  isConnected,
  amount,
}: {
  isConnected: boolean;
  amount: number;
}) {
  return isConnected && amount > 0;
}

export function getReloadBonusPreview({
  currentStatus,
  reloadAmount,
  unlockReload,
}: {
  currentStatus: "Locked" | "Active";
  reloadAmount: number;
  unlockReload: number;
}) {
  return {
    willUnlock: willUnlockBonus({
      currentStatus,
      reloadAmount,
      unlockReload,
    }),
  };
}