/*
  Warnings:

  - You are about to drop the column `assignedOrderId` on the `CardInventory` table. All the data in the column will be lost.
  - You are about to drop the column `assignedToWallet` on the `CardInventory` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CardOrderStatus" AS ENUM ('PENDING', 'PAID', 'ASSIGNED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentToken" AS ENUM ('ETH', 'USDC', 'USDT');

-- DropIndex
DROP INDEX "CardInventory_assignedToWallet_idx";

-- AlterTable
ALTER TABLE "CardInventory" DROP COLUMN "assignedOrderId",
DROP COLUMN "assignedToWallet";

-- CreateTable
CREATE TABLE "CardOrder" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "productId" TEXT,
    "productName" TEXT NOT NULL,
    "cardType" "CardType" NOT NULL,
    "paymentToken" "PaymentToken" NOT NULL,
    "couponCode" TEXT,
    "txHash" TEXT NOT NULL,
    "status" "CardOrderStatus" NOT NULL DEFAULT 'PAID',
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "assignedInventoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CardOrder_txHash_key" ON "CardOrder"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "CardOrder_assignedInventoryId_key" ON "CardOrder"("assignedInventoryId");

-- CreateIndex
CREATE INDEX "CardOrder_walletAddress_idx" ON "CardOrder"("walletAddress");

-- CreateIndex
CREATE INDEX "CardOrder_cardType_idx" ON "CardOrder"("cardType");

-- CreateIndex
CREATE INDEX "CardOrder_status_idx" ON "CardOrder"("status");

-- AddForeignKey
ALTER TABLE "CardOrder" ADD CONSTRAINT "CardOrder_assignedInventoryId_fkey" FOREIGN KEY ("assignedInventoryId") REFERENCES "CardInventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
