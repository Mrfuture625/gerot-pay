import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CardOrdersService } from "./card-orders.service";
import { CreateCardOrderDto } from "./dto";

@Controller("card-orders")
export class CardOrdersController {
  constructor(private readonly service: CardOrdersService) {}

  @Post()
  createOrder(@Body() dto: CreateCardOrderDto) {
    return this.service.createOrder(dto);
  }

  @Get("by-card/:vaultCardId")
  findByVaultCardId(@Param("vaultCardId") vaultCardId: string) {
    return this.service.findByVaultCardId(vaultCardId);
  }
}