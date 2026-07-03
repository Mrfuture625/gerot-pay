const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type SaveWithdrawalInput = {
  walletAddress: string;
  vaultCardId: string;
  amountUsd: string;
  txHash: string;
};

export async function saveWithdrawal(data: SaveWithdrawalInput) {
  const response = await fetch(`${apiUrl}/withdrawals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to save withdrawal history.");
  }

  return response.json();
}

export async function getWithdrawalHistory(walletAddress: string) {
  const response = await fetch(`${apiUrl}/withdrawals/${walletAddress}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load withdrawal history.");
  }

  return response.json();
}