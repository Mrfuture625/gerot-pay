import { IsEmail, IsEthereumAddress, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEthereumAddress()
  walletAddress!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  referralCode?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  telegramId?: string;
}