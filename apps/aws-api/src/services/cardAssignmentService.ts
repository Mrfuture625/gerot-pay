import { prisma } from "../config/prisma.js";
import { CardType } from "../generated/prisma/client.js";

export async function assignCardToOrder(
  orderId: string,
  walletAddress: string,
  cardType: CardType,
) {
  return prisma.$transaction(async (tx) => {
    const card = await tx.cardInventory.findFirst({
      where: {
        cardType,
        assigned: false,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!card) {
      throw new Error("Card inventory is empty.");
    }

    const assignedCard = await tx.cardInventory.update({
      where: {
        id: card.id,
      },
      data: {
        assigned: true,
        assignedWallet: walletAddress.toLowerCase(),
        assignedAt: new Date(),
        orderId,
      },
    });

    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "ASSIGNED",
      },
    });

    return assignedCard;
  });
}