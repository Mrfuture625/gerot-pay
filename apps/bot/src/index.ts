import { Telegraf } from "telegraf";
import { env } from "./config/env";
import { completeSignupVerification } from "./services/signupVerification";

const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);

bot.start(async (ctx) => {
  const signupToken = ctx.startPayload;
  const telegramUser = ctx.from;

  if (!signupToken) {
    await ctx.reply("Welcome to KryptPay.\n\nPlease start verification from the KryptPay website.");
    return;
  }

  if (!telegramUser.username) {
    await ctx.reply("Please set a Telegram username first, then try again.");
    return;
  }

  try {
    const otp = await completeSignupVerification({
      signupToken,
      telegramId: telegramUser.id,
      telegramUsername: telegramUser.username,
    });

    await ctx.reply(
      `✅ Telegram verified for KryptPay.\n\nYour verification code is:\n\n${otp}\n\nEnter this code on the KryptPay signup page.`
    );
  } catch {
    await ctx.reply("Verification failed. Please return to KryptPay and try again.");
  }
});

bot.launch();

console.log("KryptPay Telegram bot is running.");