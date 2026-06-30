import { Injectable, BadRequestException } from "@nestjs/common";
import {
  CardOrderStatus,
  CardType,
} from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import { CardInventoryService } from "../card-inventory/card-inventory.service";
import { CreateCardOrderDto } from "./dto";

@Injectable()
export class CardOrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryService: CardInventoryService,
  ) {}

  async createOrder(dto: CreateCardOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      // Find next unused card
      const inventory = await this.inventoryService.getNextAvailableCard(
  tx,
  dto.cardType,
);

      if (!inventory) {
        throw new BadRequestException(
          `No ${dto.cardType} cards available.`,
        );
      }

      // Create order
      const order = await tx.cardOrder.create({
        data: {
          walletAddress: dto.walletAddress.toLowerCase(),
          productName: dto.productName,
          cardType: dto.cardType,
          paymentToken: dto.paymentToken,
          couponCode: dto.couponCode,
          txHash: dto.txHash,
          vaultCardId: dto.vaultCardId,

          fullName: dto.fullName,
          email: dto.email,
          phone: dto.phone,
          address: dto.address,
          city: dto.city,
          state: dto.state,
          postalCode: dto.postalCode,
          country: dto.country,

          assignedInventoryId: inventory.id,
          status: CardOrderStatus.ASSIGNED,
        },
      });

      // Mark inventory as assigned
      await tx.cardInventory.update({
        where: {
          id: inventory.id,
        },
        data: {
          isAssigned: true,
          assignedAt: new Date(),
        },
      });

      return {
        orderId: order.id,
        status: order.status,

        card: {
          number: inventory.cardNumber,
          cvv: inventory.cvv,
          expiryMonth: inventory.expiryMonth,
          expiryYear: inventory.expiryYear,
        },
      };
    });
  }

 async findByVaultCardId(vaultCardId: string) {
    return this.prisma.cardOrder.findFirst({
      where: {
        vaultCardId,
      },
      include: {
        assignedInventory: true,
      },
    });
  }
}