-- CreateTable
CREATE TABLE "CardInventory" (
    "id" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "cvv" TEXT NOT NULL,
    "expiryMonth" TEXT NOT NULL,
    "expiryYear" TEXT NOT NULL,
    "cardType" "CardType" NOT NULL,
    "isAssigned" BOOLEAN NOT NULL DEFAULT false,
    "assignedToWallet" TEXT,
    "assignedOrderId" TEXT,
    "assignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardInventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CardInventory_cardNumber_key" ON "CardInventory"("cardNumber");

-- CreateIndex
CREATE INDEX "CardInventory_cardType_idx" ON "CardInventory"("cardType");

-- CreateIndex
CREATE INDEX "CardInventory_isAssigned_idx" ON "CardInventory"("isAssigned");

-- CreateIndex
CREATE INDEX "CardInventory_assignedToWallet_idx" ON "CardInventory"("assignedToWallet");
