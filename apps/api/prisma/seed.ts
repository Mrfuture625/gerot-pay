import { PrismaClient, CardType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.cardProduct.createMany({
    skipDuplicates: true,
    data: [
      {
        slug: "virtual-card",
        name: "KryptPay Virtual Card",
        cardType: CardType.VIRTUAL,
        priceUsd: 1,
        stock: null,
        description: "Instant virtual crypto payment card.",
      },
      {
        slug: "physical-card",
        name: "KryptPay Physical Card",
        cardType: CardType.PHYSICAL,
        priceUsd: 2,
        stock: 500,
        description: "Worldwide physical crypto payment card.",
      },
    ],
  });

  console.log("✅ Card products seeded.");
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });