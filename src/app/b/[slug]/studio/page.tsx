import { notFound } from "next/navigation";
import { getBrandBySlug } from "@/lib/brands";
import { TryOnStudio } from "@/components/tryon/TryOnStudio";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return { title: "Mirror Studio" };
  const name = brand.studioSkin?.studioName || `${brand.name} Studio`;
  return {
    title: name,
    description:
      brand.studioSkin?.subheadline ||
      `Virtual try-on studio for ${brand.name}`,
  };
}

export default async function BrandStudioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand || brand.status !== "active") notFound();
  if (!brand.studioSkin?.enabled) notFound();

  return (
    <TryOnStudio
      brandSkin={brand.studioSkin}
      brandName={brand.whiteLabel.storeName || brand.name}
    />
  );
}
