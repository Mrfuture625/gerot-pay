export async function getTelegramStatus(walletAddress: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return {
      telegramCompleted: false,
      signupRewardEligible: false,
      telegramUsername: null,
    };
  }

  const response = await fetch(
    `${apiUrl}/telegram/status/${walletAddress.toLowerCase()}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to load Telegram status");
  }

  const result = await response.json();

  return {
    telegramCompleted: Boolean(result.telegramCompleted),
    signupRewardEligible: Boolean(result.signupRewardEligible),
    telegramUsername: result.telegramUsername as string | null,
  };
}