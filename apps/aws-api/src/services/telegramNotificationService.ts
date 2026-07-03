import "dotenv/config";
import { prisma } from "../config/prisma.js";

const botToken = process.env.TELEGRAM_BOT_TOKEN;

export async function sendTelegramMessage(
  telegramId: string | null | undefined,
  text: string,
) {
  if (!botToken || !telegramId) return;

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: telegramId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
}

async function getUserByWallet(walletAddress: string) {
  return prisma.user.findUnique({
    where: { walletAddress: walletAddress.toLowerCase() },
  });
}

export const notify = {
  async signupReward(walletAddress: string, amount?: string | null) {
    const user = await getUserByWallet(walletAddress);

    await sendTelegramMessage(
      user?.telegramId,
      `🎉 <b>Signup Reward Added</b>

You completed the KryptPay Telegram task.

Reward: <b>${amount ?? "KPAY"} KPAY</b>

Open KryptPay → Claim Rewards to view your countdown or claim instantly.`,
    );
  },

  async referralReward(input: {
    walletAddress: string;
    rewardAmount: string;
    referralCount?: number;
  }) {
    const user = await getUserByWallet(input.walletAddress);

    await sendTelegramMessage(
      user?.telegramId,
      `👥 <b>Referral Reward Earned</b>

Your referral count increased${input.referralCount ? ` to <b>${input.referralCount}</b>` : ""}.

Reward: <b>${input.rewardAmount} KPAY</b>

Keep inviting friends and earning KPAY.`,
    );
  },

  async rewardClaimed(input: {
    walletAddress: string;
    amount: string;
    instant?: boolean;
  }) {
    const user = await getUserByWallet(input.walletAddress);

    await sendTelegramMessage(
      user?.telegramId,
      `✅ <b>KPAY Reward Claimed</b>

Amount: <b>${input.amount} KPAY</b>
Claim Type: <b>${input.instant ? "Instant" : "Free"}</b>`,
    );
  },
};