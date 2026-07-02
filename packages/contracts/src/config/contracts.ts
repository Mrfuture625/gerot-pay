export const KRYPTPAY_CONTRACTS = {
  kpayToken: "0xB84357f221EcD21f41fd9A47B6ea86e7b33380A2",
  rewardClaim: "0x08bf745dcf0E04c4eb801E1744248db5263445af",
  cardMarketplace: "0xF534aA0Da9bC86eAe2B9a5f1dd68288fb5f656CC",
  vault: "0xc7a986A5d83967736e5D7EC0882030947924916c",
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