"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const health_module_1 = require("./modules/health/health.module");
const users_module_1 = require("./modules/users/users.module");
const card_products_module_1 = require("./modules/card-products/card-products.module");
const card_inventory_module_1 = require("./modules/card-inventory/card-inventory.module");
const card_orders_module_1 = require("./modules/card-orders/card-orders.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            users_module_1.UsersModule,
            card_products_module_1.CardProductsModule,
            card_inventory_module_1.CardInventoryModule,
            card_orders_module_1.CardOrdersModule,
        ],
    })
], AppModule);
