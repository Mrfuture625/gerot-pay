"use client";

import { useEffect, useMemo, useState } from "react";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useAccount } from "wagmi";
import { config } from "@/features/wallet/providers/WalletProvider";
import { BadgePercent, Check, Gift, Lock, ShoppingBag, X } from "lucide-react";
import { KryptPayCard } from "@/features/cards/components/KryptPayCard";
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
import { getCardPurchaseReward } from "@/server/rewards/rewardService";
import {
  approveStableToken,
  buyCardOnchain,
  getEthAmountForUsd,
  getFinalCardPriceUsd,
  getStableAmountForUsd,
  getUsdcToken,
  getUsdtToken,
} from "@/lib/services/marketplaceService";
import { getSavedReferrer } from "@/features/referral/referralStorage";
import { appToast } from "@/lib/toast";
import { createOrder } from "@/lib/services/orderService";
import { getUserCardIds } from "@/lib/services/vaultService";
import { CardType, PaymentToken } from "@kryptpay/shared-types";

type CardProductCardProps = {
  id: string;
  name: string;
  cardType: "virtual" | "physical";
  priceEth: number;
  stock: number | null;
  description: string | null;
};

type PaymentChoice = "eth" | "usdc" | "usdt";

type CouponResult = {
  id: string;
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: string;
};

async function validateCouponApi(input: {
  code: string;
  cardType: "virtual" | "physical";
  orderAmount: number;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiUrl}/coupons/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: input.code,
      cardType: input.cardType.toUpperCase(),
      orderAmount: input.orderAmount,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Invalid coupon");
  }

  return result;
}

const CARD_TYPE_VALUE = {
  virtual: 0,
  physical: 1,
} as const;

const PAYMENT_TOKEN_VALUE = {
  eth: 0,
  usdc: 1,
  usdt: 2,
} as const;

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
      <KryptPayCard variant={cardType} />

      <div className="mt-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
          {cardType} card
        </p>

        <h3 className="mt-2 text-2xl font-semibold">{name}</h3>

        <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-400">
          {description || "Premium wallet-connected KryptPay crypto card."}
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

  const [paymentChoice, setPaymentChoice] = useState<PaymentChoice>("eth");
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<null | {
  coupon: CouponResult;
  discountAmount: number;
  finalAmount: number;
}>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [savedReferrer, setSavedReferrer] = useState<string | null>(null);
  const { address: walletAddress } = useAccount();

  useEffect(() => {
  setSavedReferrer(getSavedReferrer());
}, []);

  const finalPrice = appliedCoupon ? appliedCoupon.finalAmount : price;

  async function applyCoupon() {
  try {
    const result = await validateCouponApi({
      code: couponCode,
      cardType,
      orderAmount: price,
    });

    setAppliedCoupon({
      coupon: result.coupon,
      discountAmount: result.discountAmount,
      finalAmount: result.finalAmount,
    });

    setCouponError("");
  } catch (error) {
    setAppliedCoupon(null);
    setCouponError(error instanceof Error ? error.message : "Invalid coupon");
  }
}

  function removeCoupon() {
    setCouponCode("");
    setCouponError("");
    setAppliedCoupon(null);
  }

  async function handlePurchase() {
  if (!fullName.trim() || !email.trim()) {
    appToast.error("Please enter the card holder name and email.");
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
      appToast.error("Please complete all shipping details.");
      return;
    }
  }

  if (!walletAddress) {
    appToast.error("Wallet address not found.");
    return;
  }

  setIsPurchasing(true);
  appToast.loading("Waiting for wallet confirmation...", "purchase");

  try {
    const cardTypeValue = CARD_TYPE_VALUE[cardType];
    const paymentTokenValue = PAYMENT_TOKEN_VALUE[paymentChoice];
    const coupon = appliedCoupon ? couponCode.trim() : "";

    const finalPriceUsd = await getFinalCardPriceUsd(cardTypeValue, coupon);

    let txHash: `0x${string}`;

    if (paymentChoice === "eth") {
      const ethValue = await getEthAmountForUsd(finalPriceUsd as bigint);

      txHash = await buyCardOnchain({
        cardType: cardTypeValue,
        paymentToken: paymentTokenValue,
        couponCode: coupon,
        ethValue: ethValue as bigint,
      });

      await waitForTransactionReceipt(config, { hash: txHash });
    } else {
      const stableAmount = getStableAmountForUsd(finalPriceUsd as bigint);

      const stableToken =
        paymentChoice === "usdc" ? await getUsdcToken() : await getUsdtToken();

      const approvalHash = await approveStableToken(
        stableToken as `0x${string}`,
        stableAmount,
      );

      await waitForTransactionReceipt(config, { hash: approvalHash });

      txHash = await buyCardOnchain({
        cardType: cardTypeValue,
        paymentToken: paymentTokenValue,
        couponCode: coupon,
      });

      await waitForTransactionReceipt(config, { hash: txHash });
    }

    const cardIds = (await getUserCardIds(walletAddress)) as bigint[];
    const latestVaultCardId = cardIds.length
      ? cardIds[cardIds.length - 1].toString()
      : undefined;

    await createOrder({
      walletAddress,
      cardType: cardType === "physical" ? CardType.PHYSICAL : CardType.VIRTUAL,
paymentToken:
  paymentChoice === "eth"
    ? PaymentToken.ETH
    : paymentChoice === "usdc"
      ? PaymentToken.USDC
      : PaymentToken.USDT,
      txHash,
      vaultCardId: latestVaultCardId,
      couponCode: appliedCoupon ? appliedCoupon.coupon.code : undefined,
      cardHolderName: fullName,
      email,
      phone: phone || undefined,
      address: address || undefined,
      city: city || undefined,
      state: stateName || undefined,
      postalCode: postalCode || undefined,
      country: country || undefined,
    });

    appToast.success("🎉 Purchase successful! Order saved.", "purchase");
  } catch (error) {
    console.error(error);
    appToast.error("Purchase failed or transaction was rejected.", "purchase");
  } finally {
    setIsPurchasing(false);
  }
}



  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full rounded-2xl bg-emerald-400 px-5 py-3 font-semibold text-black transition hover:bg-emerald-300 sm:w-auto">
          Purchase
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] overflow-y-auto border-white/10 bg-[#08090d] p-0 text-white sm:max-w-xl">
        <div className="p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">Purchase {name}</DialogTitle>
          </DialogHeader>

          <div className="mt-5">
            <KryptPayCard variant={cardType} />
          </div>

          <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="mb-4 font-semibold">Card Holder Details</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Card Holder Name" className="border-white/10 bg-black/30" />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" type="email" className="border-white/10 bg-black/30" />
            </div>

            {isPhysical && (
              <div className="mt-4">
                <p className="mb-3 text-sm font-semibold text-zinc-300">
                  Shipping Details
                </p>

                <div className="grid gap-3">
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street Address" className="border-white/10 bg-black/30" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="border-white/10 bg-black/30" />
                    <Input value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="State / Region" className="border-white/10 bg-black/30" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal / ZIP Code" className="border-white/10 bg-black/30" />
                    <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="border-white/10 bg-black/30" />
                  </div>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="border-white/10 bg-black/30" />
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="mb-3 font-semibold">Payment Token</p>

            <div className="grid gap-2 sm:grid-cols-3">
              {(["eth", "usdc", "usdt"] as PaymentChoice[]).map((token) => (
                <button
                  key={token}
                  type="button"
                  onClick={() => setPaymentChoice(token)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold uppercase transition ${
                    paymentChoice === token
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 text-zinc-400 hover:bg-white/10"
                  }`}
                >
                  {token}
                </button>
              ))}
            </div>
          </div>

{savedReferrer && (
  <div className="mt-5 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
    <p className="text-sm font-semibold text-emerald-300">
      Referral detected
    </p>
    <p className="mt-2 break-all text-sm text-zinc-300">
      Referrer: {savedReferrer}
    </p>
    <p className="mt-2 text-xs text-zinc-500">
      Referral reward will be processed after purchase through backend indexing.
    </p>
  </div>
)}

          <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-3 flex items-center gap-2">
              <BadgePercent className="h-5 w-5 text-emerald-300" />
              <p className="font-semibold">Coupon Optional</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="WELCOME50" className="border-white/10 bg-black/30" />

              <Button type="button" onClick={applyCoupon} className="bg-emerald-400 text-black hover:bg-emerald-300">
                Apply
              </Button>
            </div>

            {couponError && <p className="mt-3 text-sm text-red-300">{couponError}</p>}

            {appliedCoupon && (
              <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-300" />
                     <p className="font-semibold text-emerald-300">{appliedCoupon.coupon.code}</p>
                    </div>
                    <p className="mt-1 text-sm text-zinc-300"> Discount: -${appliedCoupon.discountAmount.toFixed(2)}</p>
                  </div>

                  <button type="button" onClick={removeCoupon} className="rounded-full border border-white/10 p-1 text-zinc-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <Gift className="mb-3 h-5 w-5 text-emerald-300" />
              <p className="font-semibold">{rewardAmount} KPAY</p>
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
              ${finalPrice.toFixed(2)} {paymentChoice.toUpperCase()}
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
                disabled={isPurchasing}
                className="w-full bg-emerald-400 py-6 text-base font-semibold text-black hover:bg-emerald-300 disabled:opacity-60"
              >
                {isPurchasing ? "Processing..." : "Purchase Card"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}