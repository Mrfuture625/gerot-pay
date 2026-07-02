import { Router } from "express";
import { prisma } from "../config/prisma.js";

export const usersRouter = Router();

usersRouter.post("/connect", async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: "walletAddress is required",
      });
    }

    const normalized = String(walletAddress).toLowerCase();

    const user = await prisma.user.upsert({
      where: {
        walletAddress: normalized,
      },
      update: {},
      create: {
        walletAddress: normalized,
      },
    });

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});