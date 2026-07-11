import { listProducts } from "@/lib/db";
import { Hero } from "@/components/home/Hero";
import {
  Categories,
  DualPromo,
  FeaturedGrid,
  Philosophy,
  PromoBanner,
} from "@/components/home/FeaturedGrid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await listProducts({ featured: true });
  return (
    <>
      <Hero />
      <FeaturedGrid products={products.slice(0, 8)} />
      <DualPromo />
      <Categories />
      <Philosophy />
      <PromoBanner />
    </>
  );
}
