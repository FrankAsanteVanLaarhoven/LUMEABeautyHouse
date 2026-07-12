import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AbandonedCartCapture } from "@/components/cart/AbandonedCartCapture";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://lumea-beige.vercel.app"
  ),
  title: {
    default: "LUMÉA — Beauty Without Boundaries",
    template: "%s · LUMÉA",
  },
  description:
    "LUMÉA Beauty House — inclusive luxury makeup, skin, and hair for every undertone. Fifty foundation shades, Mirror Studio try-on, clinical care, and quiet luxury. Pay securely with PayPal.",
  applicationName: "LUMÉA",
  authors: [{ name: "LUMÉA Beauty House" }],
  creator: "LUMÉA Beauty House",
  publisher: "LUMÉA Beauty House",
  // Explicitly strip framework generator branding from HTML
  generator: "LUMÉA",
  keywords: [
    "LUMÉA",
    "inclusive beauty",
    "virtual try-on",
    "luxury makeup",
    "skincare",
    "foundation shades",
    "hair care",
    "lip oil",
  ],
  icons: {
    // favicon.ico first — browsers & OS link previews request this path specifically
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon", type: "image/png", sizes: "64x64" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#1a1612",
  },
  openGraph: {
    title: "LUMÉA — Beauty Without Boundaries",
    description:
      "Light for every face. Inclusive luxury beauty with live Mirror Studio try-on.",
    type: "website",
    siteName: "LUMÉA",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LUMÉA — Beauty Without Boundaries",
    description:
      "Light for every face. Inclusive luxury beauty with live Mirror Studio try-on.",
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
          <AbandonedCartCapture />
        </I18nProvider>
      </body>
    </html>
  );
}
