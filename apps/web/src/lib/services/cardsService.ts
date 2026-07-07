export type SavedVaultCard = {
  id: string;
  vaultCardId: string;
  cardType: "VIRTUAL" | "PHYSICAL";
  active: boolean;
  frozen: boolean;
  createdAt: string;
  orderId: string | null;
  txHash: string | null;
  cardHolderName: string | null;
  last4: string | null;
  expiryMonth: string | number | null;
  expiryYear: string | number | null;
};

export async function getCardsByWallet(walletAddress: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return [];
  }

  const response = await fetch(
    `${apiUrl}/cards/${walletAddress.toLowerCase()}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to load saved cards");
  }

  const result = await response.json();

  return result.cards as SavedVaultCard[];
}