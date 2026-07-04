import { Router } from "express";
import { prisma } from "../config/prisma.js";
import {
  CouponTarget,
  DiscountType,
} from "../generated/prisma/client.js";
import { requireAdmin } from "../middleware/adminAuth.js";

export const couponsRouter = Router();

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
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

    const coupon = await prisma.coupon.create({
      data: {
        code: normalizeCode(code),
        discountType:
          discountType === "FIXED" ? DiscountType.FIXED : DiscountType.PERCENT,
        discountValue,
        appliesTo:
          appliesTo === "VIRTUAL_CARD"
            ? CouponTarget.VIRTUAL_CARD
            : appliesTo === "PHYSICAL_CARD"
              ? CouponTarget.PHYSICAL_CARD
              : CouponTarget.ALL,
        minimumOrderAmount: minimumOrderAmount || null,
        maxUses: maxUses ? Number(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
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

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...req.body,
        code: req.body.code ? normalizeCode(req.body.code) : undefined,
        expiresAt: req.body.expiresAt
          ? new Date(req.body.expiresAt)
          : undefined,
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