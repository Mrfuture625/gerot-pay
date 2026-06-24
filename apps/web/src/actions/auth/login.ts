"use server";

import { redirect } from "next/navigation";
import { login } from "@/server/auth/authService";

export async function loginAction(formData: FormData): Promise<void> {
  const telegramUsername = String(formData.get("telegramUsername") || "").trim();
  const password = String(formData.get("password") || "");

  if (!telegramUsername || !password) {
    throw new Error("Username and password are required.");
  }

  await login({ telegramUsername, password });

  redirect("/dashboard");
}