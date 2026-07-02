import { Router } from "express";
import { prisma } from "../config/prisma.js";

export const withdrawalsRouter = Router();

withdrawalsRouter.post("/", async (req, res) => {
  try {
    const { walletAddress, vaultCardId, amountUsd, txHash } = req.body;

    if (!walletAddress || !vaultCardId || !amountUsd || !txHash) {
      return res.status(400).json({
        success: false,
        message: "Missing required withdrawal fields",
      });
    }

    const withdrawal = await prisma.withdrawal.create({
      data: {
        walletAddress: String(walletAddress).toLowerCase(),
        vaultCardId: BigInt(vaultCardId),
        amountUsd,
        txHash,
      },
    });

    return res.json({
      success: true,
      withdrawal: {
        ...withdrawal,
        vaultCardId: withdrawal.vaultCardId.toString(),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to save withdrawal",
    });
  }
});

withdrawalsRouter.get("/:walletAddress", async (req, res) => {
  try {
    const walletAddress = String(req.params.walletAddress).toLowerCase();

    const withdrawals = await prisma.withdrawal.findMany({
      where: { walletAddress },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      withdrawals: withdrawals.map((withdrawal) => ({
        ...withdrawal,
        vaultCardId: withdrawal.vaultCardId.toString(),
      })),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch withdrawals",
    });
  }
});