export function canWithdraw({
  isConnected,
  amount,
  balance,
  destination,
}: {
  isConnected: boolean;
  amount: number;
  balance: number;
  destination: string;
}) {
  return isConnected && amount > 0 && amount <= balance && destination.length > 0;
}

export function getRemainingBalance({
  balance,
  amount,
}: {
  balance: number;
  amount: number;
}) {
  return Math.max(balance - amount, 0);
}