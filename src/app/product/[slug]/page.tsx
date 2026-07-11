import { notFound } from "next/navigation";
import { getProductBySlug, listProducts } from "@/lib/db";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductCard } from "@/components/shop/ProductCard";
import { RelatedHeading } from "@/components/product/RelatedHeading";
import { RecentlyViewed } from "@/components/shop/RecentlyViewed";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.tagline,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await listProducts({ category: product.category }))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <ProductDetail product={product} />
      {related.length > 0 && (
        <section className="border-t border-line bg-ivory-deep/50 py-16">
          <div className="mx-auto max-w-[1440px] px-5 md:px-8">
            <RelatedHeading />
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
      <RecentlyViewed />
    </>
  );
}
