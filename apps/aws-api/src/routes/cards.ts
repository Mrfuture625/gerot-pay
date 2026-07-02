import { Router } from "express";
import { prisma } from "../config/prisma.js";

export const cardsRouter = Router();

cardsRouter.get("/:walletAddress", async (req, res) => {
  try {
    const walletAddress = String(req.params.walletAddress).toLowerCase();

    const cards = await prisma.vaultCard.findMany({
      where: {
        walletAddress,
      },
      include: {
        order: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      success: true,
      cards: cards.map((card) => ({
        id: card.id,
        vaultCardId: card.vaultCardId.toString(),
        cardType: card.cardType,
        active: card.active,
        frozen: card.frozen,
        createdAt: card.createdAt,
        orderId: card.orderId,
        txHash: card.order?.txHash ?? null,
      })),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load cards",
    });
  }
});