import { Controller, Get, Query } from "@nestjs/common";
import { CardProductsService } from "./card-products.service";

@Controller("card-products")
export class CardProductsController {
  constructor(
    private readonly service: CardProductsService,
  ) {}

  @Get()
  async getProducts(
    @Query("type") type?: "virtual" | "physical",
  ) {
    return this.service.findAll(type);
  }
}