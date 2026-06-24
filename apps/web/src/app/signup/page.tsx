import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupWizard } from "@/features/auth/components/SignupWizard";

export default function SignupPage() {
  return (
    <AuthShell
      title="Create account"
      description="Verify your Telegram and create your GerotPay account."
    >
      <SignupWizard />

      <p className="mt-6 text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-300 hover:text-emerald-200">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}