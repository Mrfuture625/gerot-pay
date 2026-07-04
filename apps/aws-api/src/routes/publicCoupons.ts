import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { CouponTarget, DiscountType } from "../generated/prisma/client.js";

export const publicCouponsRouter = Router();

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

function targetForCardType(cardType: string) {
  return cardType === "PHYSICAL" ? CouponTarget.PHYSICAL_CARD : CouponTarget.VIRTUAL_CARD;
}

publicCouponsRouter.post("/validate", async (req, res) => {
  try {
    const { code, cardType, orderAmount } = req.body;

    if (!code || !cardType || !orderAmount) {
      return res.status(400).json({
        success: false,
        message: "code, cardType and orderAmount are required",
      });
    }

publicCouponsRouter.post("/redeem", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required.",
      });
    }

    const coupon = await prisma.coupon.update({
      where: {
        code: normalizeCode(code),
      },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });

    return res.json({
      success: true,
      coupon,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to redeem coupon.",
    });
  }
});

    const amount = Number(orderAmount);

    const coupon = await prisma.coupon.findUnique({
      where: { code: normalizeCode(code) },
    });

    if (!coupon || !coupon.active) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code.",
      });
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Coupon has expired.",
      });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({
        success: false,
        message: "Coupon usage limit reached.",
      });
    }

    const target = targetForCardType(String(cardType));

    if (coupon.appliesTo !== CouponTarget.ALL && coupon.appliesTo !== target) {
      return res.status(400).json({
        success: false,
        message: "Coupon does not apply to this card type.",
      });
    }

    const minimum = coupon.minimumOrderAmount
      ? Number(coupon.minimumOrderAmount)
      : 0;

    if (amount < minimum) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is $${minimum}.`,
      });
    }

    let discountAmount =
      coupon.discountType === DiscountType.PERCENT
        ? (amount * Number(coupon.discountValue)) / 100
        : Number(coupon.discountValue);

    discountAmount = Math.min(discountAmount, amount);

    const finalAmount = Math.max(amount - discountAmount, 0);

    return res.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue.toString(),
      },
      originalAmount: amount,
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to validate coupon.",
    });
  }
});