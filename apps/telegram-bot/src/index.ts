import "dotenv/config";
import { Markup, Telegraf } from "telegraf";

const botToken = process.env.BOT_TOKEN;
const channelUsername = process.env.CHANNEL_USERNAME;
const apiUrl = process.env.API_URL;

if (!botToken) throw new Error("BOT_TOKEN is required");
if (!channelUsername) throw new Error("CHANNEL_USERNAME is required");
if (!apiUrl) throw new Error("API_URL is required");

const bot = new Telegraf(botToken);

function normalizeWallet(wallet: string) {
  return wallet.toLowerCase();
}

function isValidWallet(wallet?: string) {
  return Boolean(wallet && wallet.startsWith("0x") && wallet.length === 42);
}

bot.start(async (ctx) => {
  const walletAddress = ctx.startPayload;

  if (!isValidWallet(walletAddress)) {
    await ctx.reply(
      "Welcome to KryptPay 🚀\n\nPlease open this bot from the KryptPay website so your wallet can be linked.",
    );
    return;
  }

  const normalizedWallet = normalizeWallet(walletAddress);

  await fetch(`${apiUrl}/telegram/link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      walletAddress: normalizedWallet,
      telegramId: String(ctx.from.id),
      telegramUsername: ctx.from.username ?? null,
    }),
  });

  await ctx.reply(
    `Welcome to KryptPay 🚀\n\nWallet linked:\n${normalizedWallet}\n\nJoin the KryptPay channel, then come back and tap Verify.`,
    Markup.inlineKeyboard([
      [
        Markup.button.url(
          "Join KryptPay Channel",
          `https://t.me/${channelUsername.replace("@", "")}`,
        ),
      ],
      [Markup.button.callback("Verify Join", "verify_join")],
    ]),
  );
});

bot.action("verify_join", async (ctx) => {
  try {
    const telegramId = String(ctx.from.id);

    const walletResponse = await fetch(`${apiUrl}/telegram/wallet/${telegramId}`);
    const walletData = await walletResponse.json();

    const walletAddress = walletData.walletAddress;

    if (!walletAddress) {
      await ctx.answerCbQuery("Wallet not linked.");
      await ctx.reply("Please open this bot from the KryptPay website.");
      return;
    }

    const member = await ctx.telegram.getChatMember(channelUsername, ctx.from.id);
    const allowedStatuses = ["creator", "administrator", "member"];
    const isMember = allowedStatuses.includes(member.status);

    if (!isMember) {
      await ctx.answerCbQuery("Join the channel first.");
      await ctx.reply("You have not joined the KryptPay channel yet.");
      return;
    }

    const verifyResponse = await fetch(`${apiUrl}/telegram/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress,
        telegramId,
        telegramUsername: ctx.from.username ?? null,
      }),
    });

    if (!verifyResponse.ok) {
      throw new Error("API verification failed");
    }

    await ctx.answerCbQuery("Verified!");
    await ctx.reply(
      "✅ Telegram task completed!\n\nYou are now eligible for the signup $KPAY reward.",
    );
  } catch (error) {
    console.error(error);
    await ctx.reply("Verification failed. Please try again later.");
  }
});

bot.launch(() => {
  console.log("✅ KryptPay Telegram bot running");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));