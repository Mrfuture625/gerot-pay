import { Router } from "express";
import { prisma } from "../config/prisma.js";

export const cardsRouter = Router();

cardsRouter.get("/:walletAddress", async (req, res) => {
  try {
    const walletAddress = String(req.params.walletAddress).toLowerCase();

    const cards = await prisma.vaultCard.findMany({
      where: { walletAddress },
      include: {
        order: {
          include: {
            inventoryCard: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const inventoryByOrderId = await prisma.cardInventory.findMany({
      where: {
        assignedWallet: walletAddress,
      },
    });

    const inventoryMap = new Map(
      inventoryByOrderId.map((item) => [item.orderId, item]),
    );

    return res.json({
      success: true,
      cards: cards.map((card) => {
        const inventoryCard =
          card.order?.inventoryCard ??
          inventoryMap.get(card.orderId ?? "") ??
          null;

        const cardNumber = inventoryCard?.cardNumber ?? "";

        return {
          id: card.id,
          vaultCardId: card.vaultCardId.toString(),
          cardType: card.cardType,
          active: card.active,
          frozen: card.frozen,
          createdAt: card.createdAt,
          orderId: card.orderId,
          txHash: card.order?.txHash ?? null,
          cardHolderName: card.order?.cardHolderName ?? null,
          last4: cardNumber ? cardNumber.slice(-4) : null,
          expiryMonth: inventoryCard?.expiryMonth ?? null,
          expiryYear: inventoryCard?.expiryYear ?? null,
        };
      }),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load cards",
    });
  }
});