import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getBrandBySlug, listBrandProducts } from "@/lib/brands";
import { BrandStorefront } from "@/components/brand/BrandStorefront";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return { title: "Brand" };
  return {
    title: `${brand.whiteLabel.storeName || brand.name} · LUMÉA Network`,
    description: brand.whiteLabel.tagline,
  };
}

export default async function BrandStorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand || brand.status !== "active" || !brand.whiteLabel.enabled) {
    notFound();
  }
  const products = (await listBrandProducts(brand.id)).filter((p) => p.active);
  const { password: _, ...pub } = brand;

  return <BrandStorefront brand={pub} products={products} />;
}
