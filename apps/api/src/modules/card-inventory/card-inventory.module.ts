import { Module } from "@nestjs/common";
import { CardInventoryController } from "./card-inventory.controller";
import { CardInventoryService } from "./card-inventory.service";

@Module({
  controllers: [CardInventoryController],
  providers: [CardInventoryService],
  exports: [CardInventoryService],
})
export class CardInventoryModule {}