import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeWallet(wallet: string) {
    return wallet.toLowerCase();
  }

  private generateReferralCode(wallet: string) {
    return `KPAY-${wallet.slice(2, 8).toUpperCase()}`;
  }

  async create(dto: CreateUserDto) {
    const walletAddress = this.normalizeWallet(dto.walletAddress);

    const existing = await this.prisma.user.findUnique({
      where: { walletAddress },
    });

    if (existing) return existing;

    let referredById: string | undefined;

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

  async findByWallet(wallet: string) {
    const walletAddress = this.normalizeWallet(wallet);

    const user = await this.prisma.user.findUnique({
      where: { walletAddress },
      include: {
        referrals: true,
        referredBy: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(wallet: string, dto: UpdateUserDto) {
    const walletAddress = this.normalizeWallet(wallet);

    await this.findByWallet(walletAddress);

    return this.prisma.user.update({
      where: { walletAddress },
      data: dto,
    });
  }
}