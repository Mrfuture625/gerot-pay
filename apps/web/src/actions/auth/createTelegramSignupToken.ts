"use server";

import crypto from "crypto";
import { createTelegramVerification } from "@/server/repositories/telegramRepository";

export async function createTelegramSignupTokenAction() {
  const signupToken = `signup_${crypto.randomBytes(24).toString("hex")}`;

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);

  const result = await createTelegramVerification({
    signupToken,
    expiresAt: expiresAt.toISOString(),
  });

  if (result.error) {
    return { error: result.error.message };
  }

  return {
    signupToken,
    botUrl: `https://t.me/${process.env.TELEGRAM_BOT_USERNAME}?start=${signupToken}`,
  };
}