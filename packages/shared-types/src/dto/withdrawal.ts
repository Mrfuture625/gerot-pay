export interface WithdrawalDto {
  id: string;

  walletAddress: string;

  vaultCardId: string;

  amountUsd: string;

  txHash: string;

  createdAt: string;
}