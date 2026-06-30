import { Injectable } from "@nestjs/common";
import { CardType } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CardProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(type?: "virtual" | "physical") {
    return this.prisma.cardProduct.findMany({
      where: {
        isActive: true,
        ...(type
          ? {
              cardType:
                type === "virtual"
                  ? CardType.VIRTUAL
                  : CardType.PHYSICAL,
            }
          : {}),
      },
      orderBy: {
        priceUsd: "asc",
      },
    });
  }
}