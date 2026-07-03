import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { CardType, PaymentToken } from "../generated/prisma/client.js";
import { assignCardToOrder } from "../services/cardAssignmentService.js";

export const ordersRouter = Router();

ordersRouter.post("/", async (req, res) => {
  try {
    const {
      walletAddress,
      cardType,
      paymentToken,
      txHash,
      cardHolderName,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
      vaultCardId,
    } = req.body;

    if (!walletAddress || !cardType || !paymentToken || !txHash || !cardHolderName || !email) {
      return res.status(400).json({
        success: false,
        message: "Missing required order fields",
      });
    }

    const normalizedWallet = String(walletAddress).toLowerCase();
    const normalizedCardType =
      cardType === "PHYSICAL" ? CardType.PHYSICAL : CardType.VIRTUAL;

    const result = await prisma.$transaction(async (tx) => {
      await tx.user.upsert({
        where: { walletAddress: normalizedWallet },
        update: { email },
        create: {
          walletAddress: normalizedWallet,
          email,
        },
      });

      const availableCard = await tx.cardInventory.findFirst({
        where: {
          cardType: normalizedCardType,
          assigned: false,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      if (!availableCard) {
        throw new Error("CARD_OUT_OF_STOCK");
      }

      const order = await tx.order.create({
        data: {
          walletAddress: normalizedWallet,
          cardType: normalizedCardType,
          paymentToken:
            paymentToken === "USDC"
              ? PaymentToken.USDC
              : paymentToken === "USDT"
                ? PaymentToken.USDT
                : PaymentToken.ETH,
          txHash,
          vaultCardId: vaultCardId ? BigInt(vaultCardId) : undefined,
          cardHolderName,
          email,
          phone,
          address,
          city,
          state,
          postalCode,
          country,
        },
      });

      const assignedCard = await tx.cardInventory.update({
        where: { id: availableCard.id },
        data: {
          assigned: true,
          assignedWallet: normalizedWallet,
          assignedAt: new Date(),
          orderId: order.id,
        },
      });

      let vaultCard = null;

      if (vaultCardId) {
        vaultCard = await tx.vaultCard.create({
          data: {
            walletAddress: normalizedWallet,
            vaultCardId: BigInt(vaultCardId),
            cardType: normalizedCardType,
            orderId: order.id,
          },
        });
      }

      return {
        order,
        assignedCard,
        vaultCard,
      };
    });

    return res.json({
      success: true,
      order: {
        ...result.order,
        vaultCardId: result.order.vaultCardId?.toString() ?? null,
      },
      vaultCard: result.vaultCard
        ? {
            ...result.vaultCard,
            vaultCardId: result.vaultCard.vaultCardId.toString(),
          }
        : null,
      assignedCard: {
        id: result.assignedCard.id,
        cardNumber: result.assignedCard.cardNumber,
        cvv: result.assignedCard.cvv,
        expiryMonth: result.assignedCard.expiryMonth,
        expiryYear: result.assignedCard.expiryYear,
        cardType: result.assignedCard.cardType,
      },
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message === "CARD_OUT_OF_STOCK") {
      return res.status(409).json({
        success: false,
        message: "This card type is currently out of stock.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
});

ordersRouter.get("/:walletAddress", async (req, res) => {
  try {
    const walletAddress = String(req.params.walletAddress).toLowerCase();

    const orders = await prisma.order.findMany({
      where: { walletAddress },
      orderBy: { createdAt: "desc" },
      include: { inventoryCard: true },
    });

    return res.json({
      success: true,
      orders: orders.map((order) => ({
        ...order,
        vaultCardId: order.vaultCardId?.toString() ?? null,
      })),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});