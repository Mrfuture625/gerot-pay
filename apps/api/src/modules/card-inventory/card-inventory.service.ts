import { Injectable } from "@nestjs/common";
import { Prisma, CardType } from "@prisma/client";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { join } from "path";
import { PrismaService } from "../../prisma/prisma.service";

type CsvCardRow = {
  card_number: string;
  cvv: string;
  expiry_month: string;
  expiry_year: string;
  type: "VIRTUAL" | "PHYSICAL";
};

@Injectable()
export class CardInventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async importLocalCsv() {
    const filePath = join(process.cwd(), "private", "card-pool.csv");
    const file = readFileSync(filePath, "utf8");

    const rows = parse(file, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CsvCardRow[];

    const result = await this.prisma.cardInventory.createMany({
      skipDuplicates: true,
      data: rows.map((row) => ({
        cardNumber: row.card_number,
        cvv: row.cvv,
        expiryMonth: row.expiry_month,
        expiryYear: row.expiry_year,
        cardType:
          row.type.toUpperCase() === "PHYSICAL"
            ? CardType.PHYSICAL
            : CardType.VIRTUAL,
      })),
    });

    return {
      imported: result.count,
    };
  }

  async getNextAvailableCard(
  db: Prisma.TransactionClient,
  type: CardType,
) {
  return db.cardInventory.findFirst({
    where: {
      cardType: type,
      isAssigned: false,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

  
}