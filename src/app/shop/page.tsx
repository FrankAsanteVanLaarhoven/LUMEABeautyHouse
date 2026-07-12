import { listProducts } from "@/lib/db";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopChrome } from "@/components/shop/ShopChrome";
import { getHouseBrand } from "@/lib/house-brands";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; brand?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || "all";
  const q = params.q || "";
  const brand = params.brand || "";
  const brandMeta = brand ? getHouseBrand(brand) : undefined;

  const products = await listProducts({
    category: category === "all" ? undefined : category,
    q: q || undefined,
    houseBrand: brand || undefined,
  });

  return (
    <ShopChrome
      category={category}
      q={q}
      brand={brand}
      brandName={brandMeta?.name}
      count={products.length}
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </ShopChrome>
  );
}
