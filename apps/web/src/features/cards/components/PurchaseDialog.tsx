"use client";

import { useMemo, useState } from "react";
import {
  BadgePercent,
  Check,
  CreditCard,
  Gift,
  Lock,
  Package,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppAlert } from "@/components/app/AppAlert";
import { useAccount } from "wagmi";
import { ConnectWalletButton } from "@/features/wallet/components/ConnectWalletButton";

type Props = {
  children: React.ReactNode;
  product: {
    id: string;
    name: string;
    cardType: string;
    priceEth: number;
  };
};

const demoCoupons: Record<
  string,
  {
    name: string;
    details: string;
    discountPercent: number;
  }
> = {
  WELCOME50: {
    name: "Welcome Offer",
    details: "50% discount on your card purchase.",
    discountPercent: 50,
  },
  KryptPay25: {
    name: "KryptPay Community Coupon",
    details: "25% discount for early KryptPay users.",
    discountPercent: 25,
  },
};

export function PurchaseDialog({ children, product }: Props) {
  const { isConnected } = useAccount();

  const isPhysical = product.cardType === "physical";
  const rewardAmount = isPhysical ? 100 : 10;
  const bonusBalance = isPhysical ? 15 : 5;
  const unlockReload = isPhysical ? 2 : 1;

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<
    null | (typeof demoCoupons)[string]
  >(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const finalPrice = useMemo(() => {
    if (!appliedCoupon) return product.priceEth;

    const discount = product.priceEth * (appliedCoupon.discountPercent / 100);
    return Math.max(product.priceEth - discount, 0);
  }, [product.priceEth, appliedCoupon]);

  const savedAmount = product.priceEth - finalPrice;

  function showAlert(message: string) {
    setAlertMessage(message);
    setAlertOpen(true);
  }

  function applyCoupon() {
    const normalized = couponCode.trim().toUpperCase();

    if (!normalized) {
      setCouponError("Enter a coupon code first.");
      setAppliedCoupon(null);
      return;
    }

    const coupon = demoCoupons[normalized];

    if (!coupon) {
      setCouponError("Invalid or expired coupon.");
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponError("");
  }

  function removeCoupon() {
    setCouponCode("");
    setCouponError("");
    setAppliedCoupon(null);
  }

  function handlePurchase() {
    if (!isConnected) {
      showAlert("Please connect your wallet before purchasing.");
      return;
    }

    showAlert(
      "Frontend checkout is ready. Smart contract purchase will be connected later.",
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-h-[92vh] overflow-y-auto border-white/10 bg-[#08090d] p-0 text-white sm:max-w-lg">
        <div className="p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Purchase {product.name}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-5 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold italic">KryptPay</p>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-emerald-300">
                  {isPhysical ? "Physical Card" : "Virtual Card"}
                </p>
              </div>

              {isPhysical ? (
                <Package className="h-6 w-6 text-amber-300" />
              ) : (
                <CreditCard className="h-6 w-6 text-emerald-300" />
              )}
            </div>

            <div className="mt-10 text-lg tracking-[0.35em]">
              4892 •••• •••• 0928
            </div>

            <div className="mt-8 flex items-end justify-between text-xs text-zinc-400">
              <div>
                <p>CARD HOLDER</p>
                <p className="mt-1 text-sm text-white">Wallet User</p>
              </div>

              <div className="text-right">
                <p>TYPE</p>
                <p className="mt-1 text-sm text-white">
                  {isPhysical ? "Physical" : "Virtual"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Card</span>
              <span>{product.name}</span>
            </div>

            <div className="mt-3 flex justify-between text-sm">
              <span className="text-zinc-400">Base Price</span>
              <span>{product.priceEth.toFixed(2)} USDC</span>
            </div>

            <div className="mt-3 flex justify-between text-sm">
              <span className="text-zinc-400">Payment Token</span>
              <span>USDC</span>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-3 flex items-center gap-2">
              <BadgePercent className="h-5 w-5 text-emerald-300" />
              <p className="font-semibold">Apply Coupon Optional</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={couponCode}
                onChange={(event) => {
                  setCouponCode(event.target.value);
                  setCouponError("");
                }}
                placeholder="WELCOME50"
                className="border-white/10 bg-black/30"
              />

              <Button
                type="button"
                onClick={applyCoupon}
                className="bg-emerald-400 text-black hover:bg-emerald-300"
              >
                Apply
              </Button>
            </div>

            {couponError && (
              <p className="mt-3 text-sm text-red-300">{couponError}</p>
            )}

            {appliedCoupon && (
              <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-300" />
                      <p className="font-semibold text-emerald-300">
                        {appliedCoupon.name}
                      </p>
                    </div>

                    <p className="mt-1 text-sm text-zinc-300">
                      {appliedCoupon.details}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="rounded-full border border-white/10 p-1 text-zinc-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-3 text-sm text-emerald-300">
                  You saved {savedAmount.toFixed(2)} USDC
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <Gift className="mb-3 h-5 w-5 text-emerald-300" />
              <p className="text-sm font-semibold">{rewardAmount} GP</p>
              <p className="text-xs text-zinc-500">Reward</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <Lock className="mb-3 h-5 w-5 text-amber-300" />
              <p className="text-sm font-semibold">${bonusBalance}</p>
              <p className="text-xs text-zinc-500">Locked Bonus</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <ShieldCheck className="mb-3 h-5 w-5 text-cyan-300" />
              <p className="text-sm font-semibold">${unlockReload}</p>
              <p className="text-xs text-zinc-500">Unlock Reload</p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-emerald-300">Final Price</p>
                <p className="mt-1 text-3xl font-bold">
                  {finalPrice.toFixed(2)} USDC
                </p>
              </div>

              {appliedCoupon && (
                <p className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold text-black">
                  -{appliedCoupon.discountPercent}%
                </p>
              )}
            </div>
          </div>

          <div className="mt-5">
            {!isConnected ? (
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <p className="mb-3 text-sm text-zinc-400">
                  Connect your wallet to continue.
                </p>
                <ConnectWalletButton />
              </div>
            ) : (
              <Button
                type="button"
                onClick={handlePurchase}
                className="w-full bg-emerald-400 py-6 text-base font-semibold text-black hover:bg-emerald-300"
              >
                Purchase Card
              </Button>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-zinc-500">
            Contract payment will be connected later. This is the premium
            checkout UI only.
          </p>
        </div>

        <AppAlert
          open={alertOpen}
          title="KryptPay Notice"
          message={alertMessage}
          onClose={() => setAlertOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}