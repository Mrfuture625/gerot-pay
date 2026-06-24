import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/actions/auth/login";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Login with your Telegram username and password."
    >
      <form action={loginAction} className="space-y-4">
        <Input name="telegramUsername" placeholder="Telegram Username" required />

        <Input name="password" type="password" placeholder="Password" required />

        <Button
          type="submit"
          className="w-full bg-emerald-400 text-black hover:bg-emerald-300"
        >
          Login
        </Button>

        <div className="flex justify-between text-sm text-zinc-400">
          <Link href="/forgot-password" className="hover:text-white">
            Forgot password?
          </Link>
          <Link href="/signup" className="hover:text-white">
            Create account
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}