"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AppAlert } from "@/components/app/AppAlert";

type Step = "form" | "review";

type Props = {
  children: React.ReactNode;
  product: {
    id: string;
    name: string;
    cardType: string;
    priceEth: number;
  };
};

export function PurchaseDialog({ children, product }: Props) {
  const isPhysical = product.cardType === "physical";
  const [step, setStep] = useState<Step>("form");

  const [cardholderName, setCardholderName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
const [alertMessage, setAlertMessage] = useState("");

function showAlert(message: string) {
  setAlertMessage(message);
  setAlertOpen(true);
}

  function validateForm() {
    if (cardholderName.trim().length < 2) {
      showAlert("Cardholder name is required.");
      return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
      showAlert("Enter a valid email address.");
      return false;
    }

    if (isPhysical) {
      if (!country.trim() || !state.trim() || !city.trim() || !postalCode.trim() || !addressLine1.trim()) {
        showAlert("Please complete all required shipping fields.");
        return false;
      }
    }

    return true;
  }

  function continueToReview() {
    if (!validateForm()) return;
    setStep("review");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#090a0d] text-white sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {step === "form" ? `Purchase ${product.name}` : "Review Order"}
          </DialogTitle>
        </DialogHeader>

        {step === "form" && (
          <div className="space-y-4">
            <Input
              placeholder="Cardholder Name"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
            />

            <Input
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {isPhysical && (
              <>
                <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                <Input placeholder="State / Province" value={state} onChange={(e) => setState(e.target.value)} />
                <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                <Input placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                <Input placeholder="Street Address" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
                <Input placeholder="Apartment / Suite (Optional)" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
              </>
            )}

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-zinc-400">Price</p>
              <p className="mt-1 text-2xl font-bold">{product.priceEth} ETH</p>
            </div>

            <Button
              type="button"
              onClick={continueToReview}
              className="w-full bg-emerald-400 text-black hover:bg-emerald-300"
            >
              Continue to Review
            </Button>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-zinc-400">Product</p>
              <p className="mt-1 font-semibold">{product.name}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-zinc-400">Cardholder Name</p>
              <p className="mt-1 font-semibold">{cardholderName}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-zinc-400">Email</p>
              <p className="mt-1 font-semibold">{email}</p>
            </div>

            {isPhysical && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm text-zinc-400">Shipping Address</p>
                <p className="mt-1 font-semibold">{addressLine1}</p>
                {addressLine2 && <p>{addressLine2}</p>}
                <p>{city}, {state} {postalCode}</p>
                <p>{country}</p>
              </div>
            )}

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <p className="text-sm text-emerald-300">Total</p>
              <p className="mt-1 text-2xl font-bold">{product.priceEth} ETH</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("form")}
              >
                Back
              </Button>

              <Button
                type="button"
                className="bg-emerald-400 text-black hover:bg-emerald-300"
                onClick={() => showAlert("Wallet payment step is next.")}
              >
                Pay with Wallet
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
      <AppAlert
  open={alertOpen}
  title="GerotPay Notice"
  message={alertMessage}
  onClose={() => setAlertOpen(false)}
/>
    </Dialog>
  );
}