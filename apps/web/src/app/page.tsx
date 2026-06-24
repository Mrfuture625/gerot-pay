import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#07080b] text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <nav className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold">GerotPay</p>
            <p className="text-xs text-emerald-300">Sepolia testnet platform</p>
          </div>

          <div className="flex gap-3">
            <Link href="/login" className="rounded-full border border-white/10 px-5 py-2 text-sm text-zinc-300">
              Login
            </Link>
            <Link href="/signup" className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-medium text-black">
              Sign Up
            </Link>
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-20 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
              Crypto card access powered by Sepolia ETH
            </div>

            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
              Buy, reload, and manage cards with crypto.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-zinc-400">
              GerotPay lets users purchase virtual or physical test cards, receive access through Telegram, and manage reloads and withdrawals through smart contracts.
            </p>

            <div className="mt-8 flex gap-4">
              <Link href="/signup" className="rounded-full bg-emerald-400 px-6 py-3 font-medium text-black">
                Get Started
              </Link>
              <Link href="/dashboard" className="rounded-full border border-white/10 px-6 py-3 text-zinc-300">
                View Demo
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-emerald-400/20 via-cyan-400/10 to-violet-500/20 p-6">
              <div className="flex justify-between">
                <p className="text-lg font-semibold">GerotPay</p>
                <p className="rounded-full bg-white/10 px-3 py-1 text-xs">Virtual</p>
              </div>

              <div className="mt-20">
                <p className="text-sm text-zinc-400">Card Balance</p>
                <p className="mt-2 text-4xl font-semibold">0.0001 ETH</p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-500">Holder</p>
                  <p>Telegram User</p>
                </div>
                <div>
                  <p className="text-zinc-500">Network</p>
                  <p>Sepolia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}