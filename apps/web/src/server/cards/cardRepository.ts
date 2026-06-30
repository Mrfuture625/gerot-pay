type CardProduct = {
  id: string;
  name: string;
  cardType: "VIRTUAL" | "PHYSICAL";
  priceUsd: string;
  stock: number | null;
  description: string | null;
  isActive: boolean;
};

export async function getActiveCardProducts(type?: "virtual" | "physical") {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

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
    card_type: product.cardType.toLowerCase() as
      | "virtual"
      | "physical",
    price_eth: Number(product.priceUsd),
    stock: product.stock,
    description: product.description,
    is_active: product.isActive,
  })),
};
}