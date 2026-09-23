import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy text-white pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24">
          
          {/* Brand */}
          <div className="flex flex-col gap-6 max-w-sm">
            <Link href="/" className="inline-block">
              <img
                src="/images/logo.jpeg"
                alt="Pathway Education Consultancy"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-ivory/60 font-sans text-sm leading-relaxed">
              PATHWAY EDUCATION CONSULTANCY<br />
              GUIDING AMBITION BEYOND BORDERS.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
            
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-2">
                Navigation
              </span>
              <ul className="flex flex-col gap-3 text-sm text-ivory/80 font-sans">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="#about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#services" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link href="#why-pathway" className="hover:text-white transition-colors">Why Pathway</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-2">
                Destinations
              </span>
              <ul className="flex flex-col gap-3 text-sm text-ivory/80 font-sans">
                <li><Link href="#study-abroad" className="hover:text-white transition-colors">United Kingdom</Link></li>
                <li><Link href="#study-abroad" className="hover:text-white transition-colors">United States</Link></li>
                <li><Link href="#study-abroad" className="hover:text-white transition-colors">Canada</Link></li>
                <li><Link href="#study-abroad" className="hover:text-white transition-colors">Australia</Link></li>
                <li><Link href="#study-abroad" className="hover:text-white transition-colors flex items-center gap-1">Kyrgyzstan (IHSM) <ArrowUpRight size={10} /></Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-2">
                Contact
              </span>
              <ul className="flex flex-col gap-3 text-sm text-ivory/80 font-sans">
                <li>
                  <a href="tel:+917506284722" className="hover:text-white transition-colors block">
                    +91 75062 84722
                  </a>
                  <a href="tel:+919409161562" className="hover:text-white transition-colors block mt-1">
                    +91 94091 61562
                  </a>
                </li>
                <li className="mt-2 text-ivory/50">
                  1st Floor, Yusuf Corner,<br />
                  Godi Road, Dahod – 389151
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-ivory/40">
            © {new Date().getFullYear()} Pathway Education Consultancy
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-ivory/40 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-ivory/40 hover:text-white transition-colors">Facebook</a>
            <a href="#" className="text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-ivory/40 hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
