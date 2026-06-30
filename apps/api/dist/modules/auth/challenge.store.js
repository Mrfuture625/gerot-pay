"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeStore = void 0;
const common_1 = require("@nestjs/common");
let ChallengeStore = class ChallengeStore {
    constructor() {
        this.challenges = new Map();
    }
    set(walletAddress, message) {
        this.challenges.set(walletAddress.toLowerCase(), {
            message,
            expiresAt: Date.now() + 5 * 60 * 1000,
        });
    }
    get(walletAddress) {
        const record = this.challenges.get(walletAddress.toLowerCase());
        if (!record)
            return null;
        if (record.expiresAt < Date.now()) {
            this.challenges.delete(walletAddress.toLowerCase());
            return null;
        }
        return record.message;
    }
    delete(walletAddress) {
        this.challenges.delete(walletAddress.toLowerCase());
    }
};
exports.ChallengeStore = ChallengeStore;
exports.ChallengeStore = ChallengeStore = __decorate([
    (0, common_1.Injectable)()
], ChallengeStore);
