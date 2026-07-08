"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Gift, Send, X, CheckCircle } from "lucide-react";
import { getTelegramStatus } from "@/lib/services/telegramService";

const TELEGRAM_LINK = "https://t.me/kryptPibot";
const X_LINK = "https://x.com/binance";

export function TelegramTaskPopup() {
  const { address, isConnected } = useAccount();
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);

  async function checkStatus() {
    if (!address) return;

    setChecking(true);

    try {
      const status = await getTelegramStatus(address);

      if (!status.telegramCompleted) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    } catch (error) {
      console.error("Failed to check Telegram task status:", error);
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    if (!isConnected || !address) return;
    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  if (!open || !isConnected) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border border-emerald-400/20 bg-[#08090d] p-6 text-white shadow-2xl shadow-emerald-950/40">
        <button
          onClick={() => setOpen(false)}
          className="ml-auto flex rounded-full border border-white/10 p-2 text-zinc-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mt-2 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-400/10">
            <Gift className="h-8 w-8 text-emerald-300" />
          </div>

          <h2 className="mt-5 text-2xl font-bold">Unlock your Signup Reward</h2>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Complete the Telegram and X tasks to become eligible for your KPAY
            signup reward.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.08]"
          >
            <div className="flex items-center gap-3">
              <Send className="h-5 w-5 text-emerald-300" />
              <div>
                <p className="font-semibold">Join Telegram</p>
                <p className="text-xs text-zinc-500">Complete Telegram task</p>
              </div>
            </div>
            <CheckCircle className="h-5 w-5 text-zinc-600" />
          </a>

          <a
            href={X_LINK}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.08]"
          >
            <div className="flex items-center gap-3">
              <X className="h-5 w-5 text-emerald-300" />
              <div>
                <p className="font-semibold">Follow us on X</p>
                <p className="text-xs text-zinc-500">Follow KryptPay account</p>
              </div>
            </div>
            <CheckCircle className="h-5 w-5 text-zinc-600" />
          </a>
        </div>

        <button
          onClick={checkStatus}
          disabled={checking}
          className="mt-6 w-full rounded-2xl bg-emerald-400 px-5 py-4 font-semibold text-black hover:bg-emerald-300 disabled:opacity-60"
        >
          {checking ? "Checking..." : "I completed the tasks"}
        </button>

        <p className="mt-4 text-center text-xs text-zinc-500">
          This popup will not appear again after your task is completed.
        </p>
      </div>
    </div>
  );
}