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
exports.CardInventoryService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const sync_1 = require("csv-parse/sync");
const fs_1 = require("fs");
const path_1 = require("path");
const prisma_service_1 = require("../../prisma/prisma.service");
let CardInventoryService = class CardInventoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async importLocalCsv() {
        const filePath = (0, path_1.join)(process.cwd(), "private", "card-pool.csv");
        const file = (0, fs_1.readFileSync)(filePath, "utf8");
        const rows = (0, sync_1.parse)(file, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
        const result = await this.prisma.cardInventory.createMany({
            skipDuplicates: true,
            data: rows.map((row) => ({
                cardNumber: row.card_number,
                cvv: row.cvv,
                expiryMonth: row.expiry_month,
                expiryYear: row.expiry_year,
                cardType: row.type.toUpperCase() === "PHYSICAL"
                    ? client_1.CardType.PHYSICAL
                    : client_1.CardType.VIRTUAL,
            })),
        });
        return {
            imported: result.count,
        };
    }
    async getNextAvailableCard(db, type) {
        return db.cardInventory.findFirst({
            where: {
                cardType: type,
                isAssigned: false,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
    }
};
exports.CardInventoryService = CardInventoryService;
exports.CardInventoryService = CardInventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CardInventoryService);
