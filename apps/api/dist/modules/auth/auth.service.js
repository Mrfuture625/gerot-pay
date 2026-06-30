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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const ethers_1 = require("ethers");
const users_service_1 = require("../users/users.service");
const challenge_store_1 = require("./challenge.store");
let AuthService = class AuthService {
    constructor(usersService, challengeStore, jwtService) {
        this.usersService = usersService;
        this.challengeStore = challengeStore;
        this.jwtService = jwtService;
    }
    createChallenge(dto) {
        const walletAddress = dto.walletAddress.toLowerCase();
        const nonce = crypto.randomUUID();
        const message = [
            'Sign in to KryptPay',
            '',
            `Wallet: ${walletAddress}`,
            `Nonce: ${nonce}`,
            `Issued At: ${new Date().toISOString()}`,
        ].join('\n');
        this.challengeStore.set(walletAddress, message);
        return {
            walletAddress,
            message,
            expiresInSeconds: 300,
        };
    }
    async login(dto) {
        const walletAddress = dto.walletAddress.toLowerCase();
        const expectedMessage = this.challengeStore.get(walletAddress);
        if (!expectedMessage || expectedMessage !== dto.message) {
            throw new common_1.UnauthorizedException('Invalid or expired login challenge');
        }
        const recoveredAddress = ethers_1.ethers.verifyMessage(dto.message, dto.signature);
        if (recoveredAddress.toLowerCase() !== walletAddress) {
            throw new common_1.UnauthorizedException('Invalid wallet signature');
        }
        this.challengeStore.delete(walletAddress);
        const user = await this.usersService.create({
            walletAddress,
        });
        const payload = {
            sub: user.id,
            walletAddress: user.walletAddress,
            role: user.role,
        };
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
        });
        return {
            authenticated: true,
            accessToken,
            refreshToken,
            user,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        challenge_store_1.ChallengeStore,
        jwt_1.JwtService])
], AuthService);
