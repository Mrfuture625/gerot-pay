type CardProduct = {
  id: string;
  name: string;
  cardType: "VIRTUAL" | "PHYSICAL";
  priceUsd: string;
  stock: number | null;
  description: string | null;
  isActive: boolean;
};

const fallbackProducts = [
  {
    id: "virtual-card",
    name: "KryptPay Virtual Card",
    card_type: "virtual" as const,
    price_eth: 1,
    stock: null,
    description: "Instant virtual crypto payment card.",
    is_active: true,
  },
  {
    id: "physical-card",
    name: "KryptPay Physical Card",
    card_type: "physical" as const,
    price_eth: 2,
    stock: 500,
    description: "Worldwide physical crypto payment card.",
    is_active: true,
  },
];

export async function getActiveCardProducts(type?: "virtual" | "physical") {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    return {
      data: type
        ? fallbackProducts.filter((product) => product.card_type === type)
        : fallbackProducts,
    };
  }

  try {
    const url = new URL(`${baseUrl}/card-products`);

    if (type) {
      url.searchParams.set("type", type);
    }

    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch card products");
    }

    const data = (await response.json()) as CardProduct[];

    return {
      data: data.map((product) => ({
        id: product.id,
        name: product.name,
        card_type: product.cardType.toLowerCase() as "virtual" | "physical",
        price_eth: Number(product.priceUsd),
        stock: product.stock,
        description: product.description,
        is_active: product.isActive,
      })),
    };
  } catch {
    return {
      data: type
        ? fallbackProducts.filter((product) => product.card_type === type)
        : fallbackProducts,
    };
  }
}