"use server";

import { redirect } from "next/navigation";
import { signup } from "@/server/auth/authService";

export async function signupAction(input: {
  name: string;
  password: string;
  confirmPassword: string;
  signupToken: string;
  otp: string;
}) {
  if (!input.name.trim()) {
    return { error: "Name is required." };
  }

  if (input.password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (input.password !== input.confirmPassword) {
    return { error: "Passwords do not match." };
  }

  if (!input.signupToken) {
    return { error: "Telegram verification is missing." };
  }

  if (!input.otp || input.otp.length !== 6) {
    return { error: "Enter the 6-digit Telegram OTP." };
  }

  try {
    await signup({
      name: input.name,
      password: input.password,
      signupToken: input.signupToken,
      otp: input.otp,
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Signup failed.",
    };
  }

  redirect("/dashboard");
}