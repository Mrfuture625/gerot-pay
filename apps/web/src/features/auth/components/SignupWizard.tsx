"use client";

import { useState } from "react";
import { createTelegramSignupTokenAction } from "@/actions/auth/createTelegramSignupToken";
import { SignupStepOne } from "./SignupStepOne";
import { TelegramVerificationStep } from "./TelegramVerificationStep";
import { OtpStep } from "./OtpStep";
import { SignupProgress } from "./SignupProgress";
import type { SignupFormState, SignupStep } from "../types";

export function SignupWizard() {
  const [step, setStep] = useState<SignupStep>(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<SignupFormState>({
    name: "",
    password: "",
    confirmPassword: "",
    signupToken: "",
    otp: "",
    botUrl: "",
  });

  async function handleVerifyTelegram() {
  const result = await createTelegramSignupTokenAction();

  if ("error" in result) {
    alert(result.error);
    return;
  }

  setForm((current) => ({
    ...current,
    signupToken: result.signupToken,
    botUrl: result.botUrl,
  }));

  window.open(result.botUrl, "_blank");
}

  async function handleCompleteSignup() {
  setLoading(true);

  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        password: form.password,
        confirmPassword: form.confirmPassword,
        signupToken: form.signupToken,
        otp: form.otp,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error ?? "Signup failed.");
      return;
    }

    window.location.href = "/dashboard";
  } catch (error) {
    console.error(error);
    alert("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
}

  return (
    <div>
      <SignupProgress step={step} />

      {step === 1 && (
        <SignupStepOne
          name={form.name}
          password={form.password}
          confirmPassword={form.confirmPassword}
          onNameChange={(value) => setForm({ ...form, name: value })}
          onPasswordChange={(value) => setForm({ ...form, password: value })}
          onConfirmPasswordChange={(value) =>
            setForm({ ...form, confirmPassword: value })
          }
          onContinue={() => {
            if (!form.name.trim()) {
              alert("Name is required.");
              return;
            }

            if (form.password.length < 8) {
              alert("Password must be at least 8 characters.");
              return;
            }

            if (form.password !== form.confirmPassword) {
              alert("Passwords do not match.");
              return;
            }

            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <TelegramVerificationStep
          botUrl={form.botUrl}
          onVerifyTelegram={handleVerifyTelegram}
          onContinue={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <OtpStep
          otp={form.otp}
          loading={loading}
          onOtpChange={(value) => setForm({ ...form, otp: value })}
          onComplete={handleCompleteSignup}
        />
      )}
    </div>
  );
}