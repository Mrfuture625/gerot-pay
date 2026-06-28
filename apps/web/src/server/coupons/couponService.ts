export type CouponResult =
  | {
      valid: true;
      code: string;
      name: string;
      details: string;
      discountPercent: number;
    }
  | {
      valid: false;
      error: string;
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
  GEROT25: {
    name: "Gerot Community Coupon",
    details: "25% discount for early GerotPay users.",
    discountPercent: 25,
  },
};

export function validateCoupon(code: string): CouponResult {
  const normalized = code.trim().toUpperCase();

  if (!normalized) {
    return {
      valid: false,
      error: "Enter a coupon code first.",
    };
  }

  const coupon = demoCoupons[normalized];

  if (!coupon) {
    return {
      valid: false,
      error: "Invalid or expired coupon.",
    };
  }

  return {
    valid: true,
    code: normalized,
    ...coupon,
  };
}

export function calculateDiscountedPrice({
  price,
  discountPercent,
}: {
  price: number;
  discountPercent: number;
}) {
  const discount = price * (discountPercent / 100);
  return Math.max(price - discount, 0);
}