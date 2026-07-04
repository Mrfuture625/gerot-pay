import { CardType, PaymentToken } from "../enums";

export interface CreateOrderDto {
  walletAddress: string;
  cardType: CardType;
  paymentToken: PaymentToken;
  txHash: string;

  vaultCardId?: string;
couponCode?: string;
  cardHolderName: string;
  email: string;

  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface OrderDto extends CreateOrderDto {
  id: string;
  status: string;
  createdAt: string;
}