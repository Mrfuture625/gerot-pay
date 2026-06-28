type BonusStatus = "Locked" | "Active";

export function getBonusStatus({
  currentStatus,
  reloadAmount,
  unlockReload,
}: {
  currentStatus: BonusStatus;
  reloadAmount: number;
  unlockReload: number;
}) {
  if (currentStatus === "Active") return "Active";
  return reloadAmount >= unlockReload ? "Active" : "Locked";
}

export function willUnlockBonus({
  currentStatus,
  reloadAmount,
  unlockReload,
}: {
  currentStatus: BonusStatus;
  reloadAmount: number;
  unlockReload: number;
}) {
  return currentStatus === "Locked" && reloadAmount >= unlockReload;
}