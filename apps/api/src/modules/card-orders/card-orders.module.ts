import { Module } from "@nestjs/common";
import { CardInventoryModule } from "../card-inventory/card-inventory.module";
import { CardOrdersController } from "./card-orders.controller";
import { CardOrdersService } from "./card-orders.service";

@Module({
  imports: [CardInventoryModule],
  controllers: [CardOrdersController],
  providers: [CardOrdersService],
})
export class CardOrdersModule {}