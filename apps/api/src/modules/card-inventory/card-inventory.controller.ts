import { Controller, Get } from "@nestjs/common";
import { CardInventoryService } from "./card-inventory.service";

@Controller("card-inventory")
export class CardInventoryController {
  constructor(private readonly service: CardInventoryService) {}

  @Get("import-local")
  importLocalCsv() {
    return this.service.importLocalCsv();
  }
}