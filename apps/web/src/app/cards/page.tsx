import { DashboardShell } from "@/components/layout/DashboardShell";
import { CardMarketplaceHero } from "@/features/cards/components/CardMarketplaceHero";
import { CardProductCard } from "@/features/cards/components/CardProductCard";
import { getActiveCardProducts } from "@/server/cards/cardRepository";
import { MarketplaceFilters } from "@/features/cards/components/MarketplaceFilters";

type CardsPageProps = {
  searchParams: Promise<{
    type?: "virtual" | "physical";
  }>;
};

export default async function CardsPage({
  searchParams,
}: CardsPageProps) {
  const { type } = await searchParams;

  const { data: products } =
    await getActiveCardProducts(type);

  return (
    <DashboardShell title="Card Marketplace" subtitle="Choose your GerotPay card">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Card Marketplace</h1>
        <p className="mt-2 text-zinc-400">
          Choose a Virtual or Physical GerotPay card.
        </p>
      </div>

<MarketplaceFilters />

      <div className="grid gap-6 lg:grid-cols-2">
  {products?.length ? (
    products.map((product) => (
      <CardProductCard
        key={product.id}
        name={product.name}
        cardType={product.card_type}
        priceEth={Number(product.price_eth)}
        stock={product.stock}
        description={product.description}
      />
    ))
  ) : (
    <div className="col-span-full rounded-3xl border border-white/10 p-10 text-center text-zinc-400">
      No cards available in this category.
    </div>
  )}
</div>

      <div className="mt-6">
        <CardMarketplaceHero />
      </div>
    </DashboardShell>
  );
}