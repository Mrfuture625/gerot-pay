import crypto from "crypto";
import { createSession } from "@/server/sessions/createSession";
import { hashPassword, verifyPassword } from "@/server/auth/hash";
import { getTelegramVerificationByToken, markTelegramVerificationUsed } from "@/server/repositories/telegramRepository";
import type { LoginInput, SignupInput } from "@/server/types/auth";
import {
  createUserRecord,
  getUserByTelegramId,
  getUserByTelegramUsername,
  updateUserLastLogin,
} from "@/server/repositories/userRepository";

function createReferralCode(username: string) {
  return `${username.toLowerCase()}-${crypto.randomBytes(3).toString("hex")}`;
}

export async function signup(input: SignupInput) {
  const verificationResult = await getTelegramVerificationByToken(input.signupToken);
  const verification = verificationResult.data;

  if (!verification || verificationResult.error) {
    throw new Error("Telegram verification not found.");
  }

  if (verification.used) {
    throw new Error("This verification has already been used.");
  }

  if (verification.status !== "verified") {
    throw new Error("Telegram is not verified yet.");
  }

  if (new Date(verification.expires_at) < new Date()) {
    throw new Error("Telegram verification has expired.");
  }

  if (!verification.otp_hash || !verification.telegram_id || !verification.telegram_username) {
    throw new Error("Telegram verification is incomplete.");
  }
  const existingUserResult = await getUserByTelegramId(verification.telegram_id);

if (existingUserResult.data) {
  throw new Error("This Telegram account is already linked to an existing KryptPay account.");
}

  const otpValid = await verifyPassword(input.otp, verification.otp_hash);

  if (!otpValid) {
    throw new Error("Invalid Telegram OTP.");
  }

  const passwordHash = await hashPassword(input.password);
  const referralCode = createReferralCode(verification.telegram_username);

  const userResult = await createUserRecord({
    name: input.name,
    telegramId: verification.telegram_id,
    telegramUsername: verification.telegram_username,
    passwordHash,
    referralCode,
    referredBy: input.referredBy ?? null,
  });

  if (userResult.error || !userResult.data) {
    throw new Error(userResult.error?.message || "Could not create user.");
  }

  await markTelegramVerificationUsed(verification.id);
  await createSession(userResult.data.id);

  return userResult.data;
}

export async function login(input: LoginInput) {
  const userResult = await getUserByTelegramUsername(input.telegramUsername);
  const user = userResult.data;

  if (!user || userResult.error) {
    throw new Error("Invalid username or password.");
  }

  const valid = await verifyPassword(input.password, user.password_hash);

  if (!valid) {
    throw new Error("Invalid username or password.");
  }

  await updateUserLastLogin(user.id);
  await createSession(user.id);

  return user;
}