"use client";

import { useChainId, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import { Button } from "@/components/ui/button";

export function NetworkWarning() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  // Correct network → render nothing
  if (chainId === sepolia.id) {
    return null;
  }

  return (
    <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-amber-300">
            Wrong Network Detected
          </h3>

          <p className="mt-1 text-sm text-amber-200/80">
            GerotPay currently supports the <strong>Sepolia Testnet</strong>.
            Please switch your wallet network to continue.
          </p>
        </div>

        <Button
          type="button"
          disabled={isPending}
          onClick={() => switchChain({ chainId: sepolia.id })}
          className="bg-amber-400 text-black hover:bg-amber-300"
        >
          {isPending ? "Switching..." : "Switch to Sepolia"}
        </Button>
      </div>
    </div>
  );
}