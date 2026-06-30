"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardOrdersModule = void 0;
const common_1 = require("@nestjs/common");
const card_inventory_module_1 = require("../card-inventory/card-inventory.module");
const card_orders_controller_1 = require("./card-orders.controller");
const card_orders_service_1 = require("./card-orders.service");
let CardOrdersModule = class CardOrdersModule {
};
exports.CardOrdersModule = CardOrdersModule;
exports.CardOrdersModule = CardOrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [card_inventory_module_1.CardInventoryModule],
        controllers: [card_orders_controller_1.CardOrdersController],
        providers: [card_orders_service_1.CardOrdersService],
    })
], CardOrdersModule);
