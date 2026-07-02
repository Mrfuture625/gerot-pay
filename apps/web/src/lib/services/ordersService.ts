export type SavedOrder = {
  id: string;
  walletAddress: string;
  vaultCardId: string | null;
  txHash: string;
  cardType: "VIRTUAL" | "PHYSICAL";
  paymentToken: "ETH" | "USDC" | "USDT";
  cardHolderName: string;
  email: string;
  status: string;
  createdAt: string;
};

export async function getOrdersByWallet(walletAddress: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return [];
  }

  const response = await fetch(
    `${apiUrl}/orders/${walletAddress.toLowerCase()}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to load orders");
  }

  const result = await response.json();

  return result.orders as SavedOrder[];
}