import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingContactWidget } from "@/components/ui/FloatingContactWidget";
import { NewsTicker } from "@/components/ui/NewsTicker";
import { CookieConsentBanner } from "@/components/ui/CookieConsentBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pathway Education Consultancy | Dahod",
  description: "Your Future Deserves A Better Path. Expert guidance for admissions, medical and engineering counselling, overseas education, and visa assistance in Dahod, Gujarat.",
  icons: {
    icon: [
      { url: "/images/logo.png", type: "image/png" },
    ],
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased min-h-screen bg-ivory text-midnight font-sans overflow-x-hidden">
        <NewsTicker />
        <Navbar />
        <main>{children}</main>
        <FloatingContactWidget />
        <CookieConsentBanner />
        <Footer />
      </body>
    </html>
  );
}
