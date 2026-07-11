import { TryOnStudio } from "@/components/tryon/TryOnStudio";

export const metadata = {
  title: "Virtual Try-On Studio",
  description:
    "Live camera or photo upload virtual try-on. Match foundation, lips, and bronzer to your skin tone with LUMÉA.",
};

export default function StudioPage() {
  return <TryOnStudio />;
}
