type CreateReloadInput = {
  walletAddress: string;
  vaultCardId: string;
  amountUsd: string;
  txHash: string;
};

export async function saveReload(input: CreateReloadInput) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return null;

  const response = await fetch(`${apiUrl}/reloads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to save reload history");
  }

  return response.json();
}