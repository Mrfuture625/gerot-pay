type SaveRewardInput = {
  walletAddress: string;
  rewardType: "SIGNUP" | "PURCHASE" | "REFERRAL";
  amount: string;
  contractRewardId?: string;
  createdAtOnchain?: string;
};

export async function saveReward(input: SaveRewardInput) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return null;

  const response = await fetch(`${apiUrl}/rewards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to save reward");
  }

  return response.json();
}