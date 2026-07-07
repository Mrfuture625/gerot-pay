export const KRYPTPAY_CONTRACTS = {
  kpayToken: "0xB84357f221EcD21f41fd9A47B6ea86e7b33380A2",
  rewardClaim: "0x08bf745dcf0E04c4eb801E1744248db5263445af",
  cardMarketplace: "0x1657a8c0965f5Cd5323d69d098843d58Ed92d8B4",
  vault: "0xa7B0e549B53a7317154519c56c37162CBA0d6011",
} as const;

export const CARD_TYPE = {
  virtual: 0,
  physical: 1,
} as const;

export const PAYMENT_TOKEN = {
  eth: 0,
  usdc: 1,
  usdt: 2,
} as const;