export const KryptPay_CONTRACT_ADDRESS =
  "0xA28402247bb1E29fD4860023493ccE8aA2cd6FEF" as const;

export const KryptPay_PRODUCT_IDS = {
  virtual: 1,
  physical: 2,
} as const;

export const KryptPay_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "productId", type: "uint256" }],
    name: "buyCard",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "productId", type: "uint256" }],
    name: "getProduct",
    outputs: [
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "uint256", name: "maxPerWallet", type: "uint256" },
      { internalType: "bool", name: "active", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;