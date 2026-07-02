import { CardType } from "../enums";

export interface VaultCardDto {
  id: string;

  vaultCardId: string;

  cardType: CardType;

  active: boolean;
  frozen: boolean;

  orderId?: string | null;

  txHash?: string | null;

  createdAt: string;
}