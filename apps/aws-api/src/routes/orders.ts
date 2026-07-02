import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { CardType, PaymentToken } from "../generated/prisma/client.js";

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

    await prisma.user.upsert({
      where: { walletAddress: normalizedWallet },
      update: { email },
      create: {
        walletAddress: normalizedWallet,
        email,
      },
    });

    const order = await prisma.order.create({
      data: {
        walletAddress: normalizedWallet,
        cardType: cardType === "PHYSICAL" ? CardType.PHYSICAL : CardType.VIRTUAL,
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

    let vaultCard = null;

if (vaultCardId) {
  vaultCard = await prisma.vaultCard.create({
    data: {
      walletAddress: normalizedWallet,
      vaultCardId: BigInt(vaultCardId),
      cardType:
        cardType === "PHYSICAL" ? CardType.PHYSICAL : CardType.VIRTUAL,
      orderId: order.id,
    },
  });
}

    return res.json({
  success: true,
  order: {
    ...order,
    vaultCardId: order.vaultCardId?.toString() ?? null,
  },
  vaultCard: vaultCard
    ? {
        ...vaultCard,
        vaultCardId: vaultCard.vaultCardId.toString(),
      }
    : null,
});

  } catch (error) {
    console.error(error);

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