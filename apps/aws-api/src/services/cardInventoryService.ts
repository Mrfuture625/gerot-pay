import { prisma } from "../config/prisma.js";
import { CardType } from "../generated/prisma/client.js";

export async function getAvailableCard(cardType: CardType) {
  return prisma.cardInventory.findFirst({
    where: {
      cardType,
      assigned: false,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function assignCardToOrder(params: {
  cardId: string;
  walletAddress: string;
  orderId: string;
}) {
  return prisma.cardInventory.update({
    where: {
      id: params.cardId,
    },
    data: {
      assigned: true,
      assignedWallet: params.walletAddress,
      assignedAt: new Date(),
      orderId: params.orderId,
    },
  });
}

export async function getUserCards(walletAddress: string) {
  return prisma.cardInventory.findMany({
    where: {
      assignedWallet: walletAddress.toLowerCase(),
    },
    orderBy: {
      assignedAt: "desc",
    },
  });
}

export async function getInventoryStats() {
  const total = await prisma.cardInventory.count();

  const available = await prisma.cardInventory.count({
    where: {
      assigned: false,
    },
  });

  const sold = await prisma.cardInventory.count({
    where: {
      assigned: true,
    },
  });

  return {
    total,
    available,
    sold,
  };
}