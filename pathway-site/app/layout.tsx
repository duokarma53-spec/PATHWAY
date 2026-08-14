import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navigation/Navbar';
import { FloatingCta } from '@/components/ui/FloatingCta';
import { Container } from '@/components/ui/Container';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const body = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pathwayconsultancy.in'),
  title: {
    default: `${SITE_CONFIG.name} — International Education Consultancy`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'study abroad consultants india',
    'international education consultancy',
    'uk university admissions india',
    'usa study abroad',
    'masters abroad india',
    'pathway education consultancy',
  ],
  authors: [{ name: 'Pathway Consultancy' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://pathwayconsultancy.in',
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — International Education Consultancy`,
    description: SITE_CONFIG.description,
    images: [{ url: '/og/default.jpg', width: 1200, height: 630, alt: 'Pathway — International Education Consultancy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} — International Education Consultancy`,
    description: SITE_CONFIG.description,
    images: ['/og/default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-bg-primary text-text-primary antialiased overflow-x-hidden selection:bg-gold selection:text-charcoal">
        <Navbar />
        <main>{children}</main>
        <FloatingCta />
        <footer className="border-t border-border/10 bg-bg-inverse text-text-inverse relative">
          <Container className="max-w-[1400px] py-16 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-start">

              {/* Left */}
              <div>
                <div className="font-serif text-3xl mb-4 tracking-tight text-white">Pathway</div>
                <p className="font-sans text-text-faint text-base leading-relaxed max-w-xs">
                  Education & career guidance for students and families.
                </p>
              </div>

              {/* Right */}
              <div className="lg:justify-self-end w-full lg:max-w-md">
                <div className="font-sans text-[10px] text-white/30 uppercase tracking-widest font-bold mb-6">NAVIGATION</div>
                <ul className="flex flex-wrap gap-x-8 gap-y-4 mb-16">
                  {[
                    { label: 'About', href: '/about' },
                    { label: 'Career & Admissions', href: '/#career-admissions' },
                    { label: 'Study Abroad', href: '/#study-abroad' },
                    { label: 'Services', href: '/services' },
                    { label: 'Contact', href: '/contact' },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="font-sans text-text-faint hover:text-gold transition-colors duration-300 text-sm font-medium tracking-wide">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 font-sans text-sm text-text-faint">
              <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                <span>1st Floor, Yusuf Corner, Godi Road, Dahod – 389151</span>
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-6 lg:justify-end">
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`} className="hover:text-gold transition-colors">{SITE_CONFIG.phone}</a>
                <span className="hidden md:block text-white/20">•</span>
                <a href={`tel:${SITE_CONFIG.phoneAlt?.replace(/\s/g, '')}`} className="hover:text-gold transition-colors">{SITE_CONFIG.phoneAlt}</a>
                <span className="hidden md:block text-white/20">•</span>
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-gold transition-colors">{SITE_CONFIG.email}</a>
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-sans text-xs text-white/30 uppercase tracking-widest">
              <p>© {new Date().getFullYear()} Pathway. All rights reserved.</p>
              <div className="flex gap-6">
                <Link href="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-gold transition-colors">Terms</Link>
              </div>
            </div>
          </Container>
        </footer>
      </body>
    </html>
  );
}
