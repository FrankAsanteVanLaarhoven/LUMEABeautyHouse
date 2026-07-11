import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { GlobalBar } from "@/components/global/GlobalBar";
import { I18nProvider } from "@/components/i18n/I18nProvider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "LUMÉA — Beauty Without Boundaries",
    template: "%s · LUMÉA",
  },
  description:
    "LUMÉA is a next-generation beauty house. Inclusive shades, clinical skincare, virtual try-on, and quiet luxury for every face.",
  keywords: [
    "LUMÉA",
    "inclusive beauty",
    "virtual try-on",
    "luxury makeup",
    "skincare",
    "foundation shades",
    "lip oil",
  ],
  icons: {
    icon: "/icons/lumea-mark.svg",
    apple: "/icons/lumea-mark.svg",
  },
  openGraph: {
    title: "LUMÉA — Beauty Without Boundaries",
    description: "Light for every face. Inclusive luxury beauty with live try-on.",
    type: "website",
    siteName: "LUMÉA",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${cormorant.variable} ${jetbrains.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <I18nProvider>
          <AnnouncementBar />
          <GlobalBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </I18nProvider>
      </body>
    </html>
  );
}
