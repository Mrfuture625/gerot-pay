"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardOrdersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const card_inventory_service_1 = require("../card-inventory/card-inventory.service");
let CardOrdersService = class CardOrdersService {
    constructor(prisma, inventoryService) {
        this.prisma = prisma;
        this.inventoryService = inventoryService;
    }
    async createOrder(dto) {
        return this.prisma.$transaction(async (tx) => {
            // Find next unused card
            const inventory = await this.inventoryService.getNextAvailableCard(tx, dto.cardType);
            if (!inventory) {
                throw new common_1.BadRequestException(`No ${dto.cardType} cards available.`);
            }
            // Create order
            const order = await tx.cardOrder.create({
                data: {
                    walletAddress: dto.walletAddress.toLowerCase(),
                    productName: dto.productName,
                    cardType: dto.cardType,
                    paymentToken: dto.paymentToken,
                    couponCode: dto.couponCode,
                    txHash: dto.txHash,
                    vaultCardId: dto.vaultCardId,
                    fullName: dto.fullName,
                    email: dto.email,
                    phone: dto.phone,
                    address: dto.address,
                    city: dto.city,
                    state: dto.state,
                    postalCode: dto.postalCode,
                    country: dto.country,
                    assignedInventoryId: inventory.id,
                    status: client_1.CardOrderStatus.ASSIGNED,
                },
            });
            // Mark inventory as assigned
            await tx.cardInventory.update({
                where: {
                    id: inventory.id,
                },
                data: {
                    isAssigned: true,
                    assignedAt: new Date(),
                },
            });
            return {
                orderId: order.id,
                status: order.status,
                card: {
                    number: inventory.cardNumber,
                    cvv: inventory.cvv,
                    expiryMonth: inventory.expiryMonth,
                    expiryYear: inventory.expiryYear,
                },
            };
        });
    }
    async findByVaultCardId(vaultCardId) {
        return this.prisma.cardOrder.findFirst({
            where: {
                vaultCardId,
            },
            include: {
                assignedInventory: true,
            },
        });
    }
};
exports.CardOrdersService = CardOrdersService;
exports.CardOrdersService = CardOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        card_inventory_service_1.CardInventoryService])
], CardOrdersService);
