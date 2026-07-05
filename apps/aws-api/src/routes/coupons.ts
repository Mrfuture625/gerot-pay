import { Router } from "express";
import { prisma } from "../config/prisma.js";
import {
  CouponTarget,
  DiscountType,
} from "../generated/prisma/client.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import {
  createCouponOnchain,
  setCouponActiveOnchain,
  updateCouponOnchain,
} from "../services/marketplaceCouponContractService.js";

export const couponsRouter = Router();

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

function normalizeAppliesTo(appliesTo: string) {
  if (appliesTo === "VIRTUAL_CARD") return CouponTarget.VIRTUAL_CARD;
  if (appliesTo === "PHYSICAL_CARD") return CouponTarget.PHYSICAL_CARD;
  return CouponTarget.ALL;
}

couponsRouter.get("/", requireAdmin, async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, coupons });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load coupons",
    });
  }
});

couponsRouter.post("/", requireAdmin, async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      appliesTo,
      minimumOrderAmount,
      maxUses,
      expiresAt,
      active,
    } = req.body;

    if (!code || !discountType || !discountValue) {
      return res.status(400).json({
        success: false,
        message: "code, discountType and discountValue are required",
      });
    }

    if (discountType === "FIXED") {
      return res.status(400).json({
        success: false,
        message: "Fixed coupons are not supported on-chain. Use percent coupons.",
      });
    }

    const normalizedCode = normalizeCode(code);
    const normalizedAppliesTo = normalizeAppliesTo(appliesTo);
    const discountPercent = Number(discountValue);

    const onchain = await createCouponOnchain({
      code: normalizedCode,
      discountPercent,
      maxUses: maxUses ? Number(maxUses) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      appliesTo: normalizedAppliesTo,
    });

    if (!onchain.couponId) {
      return res.status(500).json({
        success: false,
        message: "Coupon created on-chain but coupon id was not found.",
        txHash: onchain.txHash,
      });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: normalizedCode,
        discountType: DiscountType.PERCENT,
        discountValue,
        appliesTo: normalizedAppliesTo,
        minimumOrderAmount: minimumOrderAmount || null,
        maxUses: maxUses ? Number(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        onChainCouponId: onchain.couponId,
        onChainTxHash: onchain.txHash,
        active: active ?? true,
      },
    });

    return res.json({ success: true, coupon });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create coupon",
    });
  }
});

couponsRouter.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const id = String(req.params.id);

    const current = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!current) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    if (req.body.discountType === "FIXED") {
      return res.status(400).json({
        success: false,
        message: "Fixed coupons are not supported on-chain. Use percent coupons.",
      });
    }

    const nextDiscountValue =
      req.body.discountValue !== undefined
        ? Number(req.body.discountValue)
        : Number(current.discountValue);

    const nextMaxUses =
      req.body.maxUses !== undefined
        ? req.body.maxUses
          ? Number(req.body.maxUses)
          : null
        : current.maxUses;

    const nextExpiresAt =
      req.body.expiresAt !== undefined
        ? req.body.expiresAt
          ? new Date(req.body.expiresAt)
          : null
        : current.expiresAt;

    const nextActive =
      req.body.active !== undefined ? Boolean(req.body.active) : current.active;

    const nextAppliesTo =
      req.body.appliesTo !== undefined
        ? normalizeAppliesTo(req.body.appliesTo)
        : current.appliesTo;

    if (current.onChainCouponId) {
      await updateCouponOnchain({
        couponId: current.onChainCouponId,
        discountPercent: nextDiscountValue,
        maxUses: nextMaxUses,
        expiresAt: nextExpiresAt,
        active: nextActive,
        appliesTo: nextAppliesTo,
      });
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...req.body,
        code: req.body.code ? normalizeCode(req.body.code) : undefined,
        discountType: DiscountType.PERCENT,
        discountValue: nextDiscountValue,
        appliesTo: nextAppliesTo,
        maxUses: nextMaxUses,
        expiresAt: nextExpiresAt,
        active: nextActive,
      },
    });

    return res.json({ success: true, coupon });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update coupon",
    });
  }
});

couponsRouter.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = String(req.params.id);

    const coupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    if (coupon.onChainCouponId) {
      await setCouponActiveOnchain(coupon.onChainCouponId, false);
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete coupon",
    });
  }
});