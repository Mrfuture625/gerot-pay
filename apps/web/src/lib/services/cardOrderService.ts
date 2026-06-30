type CreateCardOrderInput = {
  walletAddress: string;
  productName: string;
  cardType: "VIRTUAL" | "PHYSICAL";
  paymentToken: "ETH" | "USDC" | "USDT";
  txHash: string;
  vaultCardId?: string;
  couponCode?: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

export async function createCardOrder(input: CreateCardOrderInput) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  const response = await fetch(`${baseUrl}/card-orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Failed to create card order");
  }

  return response.json();
}