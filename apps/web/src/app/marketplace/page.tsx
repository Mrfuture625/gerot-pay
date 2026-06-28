import { DashboardShell } from "@/components/layout/DashboardShell";
import { CardMarketplaceHero } from "@/features/cards/components/CardMarketplaceHero";
import { CardProductCard } from "@/features/cards/components/CardProductCard";
import { getActiveCardProducts } from "@/server/cards/cardRepository";

type CardsPageProps = {
  searchParams: Promise<{
    type?: "virtual" | "physical";
  }>;
};

export default async function CardsPage({ searchParams }: CardsPageProps) {
  const { type } = await searchParams;

  const { data: products } = await getActiveCardProducts(type);

  return (
    <DashboardShell title="Card Marketplace" subtitle="Choose your GerotPay card">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
          GerotPay Marketplace
        </p>

        <h1 className="mt-3 text-3xl font-bold">Choose your crypto card</h1>

        <p className="mt-2 max-w-2xl text-zinc-400">
          Purchase a Virtual or Physical GerotPay card, apply an optional coupon
          during checkout, earn GP rewards and unlock your bonus balance after
          your first reload.
        </p>
      </div>


      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {products?.length ? (
          products.map((product) => (
            <CardProductCard
              key={product.id}
              id={product.id}
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