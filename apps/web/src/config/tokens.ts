export const PAYMENT_TOKENS = [
  {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    enabled: true,
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    enabled: false,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    enabled: false,
  },
  {
    symbol: "GP",
    name: "KryptPay",
    decimals: 18,
    enabled: false,
  },
];

export const DEFAULT_PAYMENT_TOKEN = "USDC";