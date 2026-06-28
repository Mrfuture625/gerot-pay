export const APP_CONFIG = {
  brand: {
    name: "KryptPay",
    tokenName: "KryptPay",
    tokenSymbol: "GP",
  },

  payment: {
    defaultToken: "USDC",
  },

  cards: {
    virtual: {
      name: "Krypt Virtual Card",
      price: 1,
      reward: 10,
      bonus: 5,
      unlockReload: 1,
    },
    physical: {
      name: "Krypt Physical Card",
      price: 2,
      reward: 100,
      bonus: 15,
      unlockReload: 2,
    },
  },

  referral: {
    referrerReward: 10,
    refereeReward: 5,
  },
};