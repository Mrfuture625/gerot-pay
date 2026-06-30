import { CardType, PaymentToken } from "@prisma/client";
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateCardOrderDto {
  @IsString()
  walletAddress!: string;

  @IsString()
  productName!: string;

  @IsEnum(CardType)
  cardType!: CardType;

  @IsEnum(PaymentToken)
  paymentToken!: PaymentToken;

  @IsString()
  txHash!: string;

   @IsOptional()
@IsString()
vaultCardId?: string;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  country?: string;

}