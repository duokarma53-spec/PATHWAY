import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased min-h-screen bg-ivory text-midnight font-sans overflow-x-hidden">
        <Navbar />
        <main>{children}</main>
        <FloatingWhatsApp phoneNumber="+917506284722" />
        <Footer />
      </body>
    </html>
  );
}
