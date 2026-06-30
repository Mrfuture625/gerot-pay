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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    normalizeWallet(wallet) {
        return wallet.toLowerCase();
    }
    generateReferralCode(wallet) {
        return `KPAY-${wallet.slice(2, 8).toUpperCase()}`;
    }
    async create(dto) {
        const walletAddress = this.normalizeWallet(dto.walletAddress);
        const existing = await this.prisma.user.findUnique({
            where: { walletAddress },
        });
        if (existing)
            return existing;
        let referredById;
        if (dto.referralCode) {
            const referrer = await this.prisma.user.findUnique({
                where: { referralCode: dto.referralCode },
            });
            if (referrer) {
                referredById = referrer.id;
            }
        }
        return this.prisma.user.create({
            data: {
                walletAddress,
                email: dto.email,
                username: dto.username,
                referralCode: this.generateReferralCode(walletAddress),
                referredById,
            },
        });
    }
    async findByWallet(wallet) {
        const walletAddress = this.normalizeWallet(wallet);
        const user = await this.prisma.user.findUnique({
            where: { walletAddress },
            include: {
                referrals: true,
                referredBy: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async update(wallet, dto) {
        const walletAddress = this.normalizeWallet(wallet);
        await this.findByWallet(walletAddress);
        return this.prisma.user.update({
            where: { walletAddress },
            data: dto,
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
