export type CardProduct = {
  id: string;
  name: string;
  card_type: "virtual" | "physical";
  price_eth: number;
  stock: number | null;
  description: string;
  is_active: boolean;
};

const CARD_PRODUCTS: CardProduct[] = [
  {
    id: "virtual-card",
    name: "KryptPay Virtual Card",
    card_type: "virtual",
    price_eth: 1,
    stock: null,
    description:
      "Instant virtual crypto payment card. Purchase with ETH, USDC or USDT and start spending immediately.",
    is_active: true,
  },
  {
    id: "physical-card",
    name: "KryptPay Physical Card",
    card_type: "physical",
    price_eth: 2,
    stock: 500,
    description:
      "Worldwide physical crypto payment card delivered to your shipping address.",
    is_active: true,
  },
];

export async function getActiveCardProducts(
  type?: "virtual" | "physical",
) {
  return {
    data: type
      ? CARD_PRODUCTS.filter((product) => product.card_type === type)
      : CARD_PRODUCTS,
  };
}