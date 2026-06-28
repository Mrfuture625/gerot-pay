"use client";

import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { BadgePercent, Check, Gift, Lock, ShoppingBag, X } from "lucide-react";
import { GerotCard } from "@/features/cards/components/GerotCard";
import { ConnectWalletButton } from "@/features/wallet/components/ConnectWalletButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PLATFORM } from "@/config/platform";
import {
  calculateDiscountedPrice,
  validateCoupon,
  type CouponResult,
} from "@/server/coupons/couponService";
import { getCardPurchaseReward } from "@/server/rewards/rewardService";

type CardProductCardProps = {
  id: string;
  name: string;
  cardType: "virtual" | "physical";
  priceEth: number;
  stock: number | null;
  description: string | null;
};


export function CardProductCard({
  name,
  cardType,
  priceEth,
  description,
}: CardProductCardProps) {
  const { isConnected } = useAccount();

  const isPhysical = cardType === "physical";
  const rewardAmount = getCardPurchaseReward(cardType);
  const bonusBalance = isPhysical ? 15 : 5;
  const unlockReload = isPhysical ? 2 : 1;

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
      <GerotCard variant={cardType} />

      <div className="mt-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
          {cardType} card
        </p>

        <h3 className="mt-2 text-2xl font-semibold">{name}</h3>

        <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-400">
          {description || "Premium wallet-connected GerotPay crypto card."}
        </p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-zinc-500">Starting Price</p>
            <p className="text-3xl font-bold">${priceEth}</p>
          </div>

          <PurchaseModal
            name={name}
            cardType={cardType}
            price={priceEth}
            rewardAmount={rewardAmount}
            bonusBalance={bonusBalance}
            unlockReload={unlockReload}
            isConnected={isConnected}
          />
        </div>
      </div>
    </div>
  );
}

function PurchaseModal({
  name,
  cardType,
  price,
  rewardAmount,
  bonusBalance,
  unlockReload,
  isConnected,
}: {
  name: string;
  cardType: "virtual" | "physical";
  price: number;
  rewardAmount: number;
  bonusBalance: number;
  unlockReload: number;
  isConnected: boolean;
}) {
  const isPhysical = cardType === "physical";

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<
  null | Extract<CouponResult, { valid: true }>
>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");

  const finalPrice = useMemo(() => {
  if (!appliedCoupon) return price;

  return calculateDiscountedPrice({
    price,
    discountPercent: appliedCoupon.discountPercent,
  });
}, [price, appliedCoupon]);

  function applyCoupon() {
  const result = validateCoupon(couponCode);

  if (!result.valid) {
    setCouponError(result.error);
    setAppliedCoupon(null);
    return;
  }

  setAppliedCoupon(result);
  setCouponError("");
}

  function removeCoupon() {
    setCouponCode("");
    setCouponError("");
    setAppliedCoupon(null);
  }

  function handlePurchase() {
    if (!fullName.trim() || !email.trim()) {
      alert("Please enter your name and email.");
      return;
    }

    if (isPhysical) {
      if (
        !address.trim() ||
        !city.trim() ||
        !stateName.trim() ||
        !postalCode.trim() ||
        !country.trim() ||
        !phone.trim()
      ) {
        alert("Please complete all shipping details.");
        return;
      }
    }

    alert("Details saved. Smart contract purchase will be connected later.");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full rounded-2xl bg-emerald-400 px-5 py-3 sm:w-auto font-semibold text-black transition hover:bg-emerald-300">
          Purchase
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] overflow-y-auto border-white/10 bg-[#08090d] p-0 text-white sm:max-w-xl">
        <div className="p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">Purchase {name}</DialogTitle>
          </DialogHeader>

          <div className="mt-5">
            <GerotCard variant={cardType} />
          </div>

          <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="mb-4 font-semibold">Your Details</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="border-white/10 bg-black/30"
              />

              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                type="email"
                className="border-white/10 bg-black/30"
              />
            </div>

            {isPhysical && (
              <div className="mt-4">
                <p className="mb-3 text-sm font-semibold text-zinc-300">
                  Shipping Details
                </p>

                <div className="grid gap-3">
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street Address"
                    className="border-white/10 bg-black/30"
                  />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="border-white/10 bg-black/30"
                    />

                    <Input
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="State / Region"
                      className="border-white/10 bg-black/30"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Postal / ZIP Code"
                      className="border-white/10 bg-black/30"
                    />

                    <Input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Country"
                      className="border-white/10 bg-black/30"
                    />
                  </div>

                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="border-white/10 bg-black/30"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-3 flex items-center gap-2">
              <BadgePercent className="h-5 w-5 text-emerald-300" />
              <p className="font-semibold">Coupon Optional</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
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
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <Gift className="mb-3 h-5 w-5 text-emerald-300" />
              <p className="font-semibold">{rewardAmount} GP</p>
              <p className="text-xs text-zinc-500">Reward</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <Lock className="mb-3 h-5 w-5 text-amber-300" />
              <p className="font-semibold">${bonusBalance}</p>
              <p className="text-xs text-zinc-500">Locked Bonus</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <ShoppingBag className="mb-3 h-5 w-5 text-cyan-300" />
              <p className="font-semibold">${unlockReload}</p>
              <p className="text-xs text-zinc-500">Reload Unlock</p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="text-sm text-emerald-300">Final Price</p>
            <p className="mt-1 text-4xl font-bold">
              ${finalPrice.toFixed(2)} {PLATFORM.paymentToken}
            </p>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}