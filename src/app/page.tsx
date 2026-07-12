import { listProducts } from "@/lib/db";
import { Hero } from "@/components/home/Hero";
import {
  Categories,
  DualPromo,
  FeaturedGrid,
  Philosophy,
  PromoBanner,
} from "@/components/home/FeaturedGrid";
import { CampaignGallery } from "@/components/home/CampaignGallery";
import { SkinCommunity } from "@/components/home/SkinCommunity";
import {
  DiscoveryStrip,
  TrustBar,
} from "@/components/home/DiscoveryStrip";
import { LuxuryExperiences } from "@/components/home/LuxuryExperiences";
import { RecentlyViewed } from "@/components/shop/RecentlyViewed";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await listProducts({ featured: true });
  return (
    <>
      <Hero />
      <TrustBar />
      <LuxuryExperiences />
      <DiscoveryStrip />
      <CampaignGallery />
      <SkinCommunity />
      <FeaturedGrid products={products.slice(0, 8)} />
      <DualPromo />
      <Categories />
      <Philosophy />
      <PromoBanner />
      <RecentlyViewed />
    </>
  );
}
