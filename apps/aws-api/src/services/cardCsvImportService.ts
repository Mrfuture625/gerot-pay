import fs from "fs";
import csv from "csv-parser";
import { prisma } from "../config/prisma.js";
import { CardType } from "../generated/prisma/client.js";

type CsvRow = {
  card_number?: string;
  cvv?: string;
  expiry_month?: string;
  expiry_year?: string;
  type?: string;
};

function normalizeCardType(value: string): CardType {
  const type = value.trim().toUpperCase();

  if (type === "VIRTUAL") return CardType.VIRTUAL;
  if (type === "PHYSICAL") return CardType.PHYSICAL;

  throw new Error(`Invalid card type: ${value}`);
}

export async function importCardCsv(filePath: string, sourceFile: string) {
  const rows: CsvRow[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  const batch = `cards_${Date.now()}`;
  let imported = 0;
  let duplicates = 0;
  let invalid = 0;

  for (const row of rows) {
    try {
      const cardNumber = String(row.card_number || "").trim();
      const cvv = String(row.cvv || "").trim();
      const expiryMonth = Number(row.expiry_month);
      const expiryYear = Number(row.expiry_year);
      const cardType = normalizeCardType(String(row.type || ""));

      if (!cardNumber || !cvv || !expiryMonth || !expiryYear) {
        invalid++;
        continue;
      }

      const existing = await prisma.cardInventory.findUnique({
        where: { cardNumber },
      });

      if (existing) {
        duplicates++;
        continue;
      }

      await prisma.cardInventory.create({
        data: {
          cardNumber,
          cvv,
          expiryMonth,
          expiryYear,
          cardType,
          batch,
        },
      });

      imported++;
    } catch {
      invalid++;
    }
  }

  fs.unlinkSync(filePath);

  return {
    success: true,
    batch,
    sourceFile,
    totalRows: rows.length,
    imported,
    duplicates,
    invalid,
  };
}