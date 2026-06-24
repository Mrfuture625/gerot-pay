import Link from "next/link";

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#07080b] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
          <Link href="/" className="mb-8 block">
            <p className="text-2xl font-semibold">GerotPay</p>
            <p className="text-xs text-emerald-300">Sepolia testnet platform</p>
          </Link>

          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-zinc-400">{description}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
}