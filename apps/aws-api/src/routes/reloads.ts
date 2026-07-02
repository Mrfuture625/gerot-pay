import { Router } from "express";
import { prisma } from "../config/prisma.js";

export const reloadsRouter = Router();

reloadsRouter.post("/", async (req, res) => {
  try {
    const { walletAddress, vaultCardId, amountUsd, txHash } = req.body;

    if (!walletAddress || !vaultCardId || !amountUsd || !txHash) {
      return res.status(400).json({
        success: false,
        message: "Missing required reload fields",
      });
    }

    const reload = await prisma.reload.create({
      data: {
        walletAddress: String(walletAddress).toLowerCase(),
        vaultCardId: BigInt(vaultCardId),
        amountUsd,
        txHash,
      },
    });

    return res.json({
      success: true,
      reload: {
        ...reload,
        vaultCardId: reload.vaultCardId.toString(),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to save reload",
    });
  }
});

reloadsRouter.get("/:walletAddress", async (req, res) => {
  try {
    const walletAddress = String(req.params.walletAddress).toLowerCase();

    const reloads = await prisma.reload.findMany({
      where: { walletAddress },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      reloads: reloads.map((reload) => ({
        ...reload,
        vaultCardId: reload.vaultCardId.toString(),
      })),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reloads",
    });
  }
});