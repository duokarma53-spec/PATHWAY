import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Mail } from "lucide-react";

// Fancy Typography Logo Component
const BrandLogo = () => (
  <div className="flex flex-col group cursor-pointer">
    <div className="flex items-center gap-1">
      <span className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white group-hover:text-gold transition-colors duration-500">
        PATHWAY
      </span>
      <span className="w-2 h-2 rounded-full bg-gold mt-2 md:mt-4 group-hover:scale-150 transition-transform duration-500" />
    </div>
    <span className="text-[10px] md:text-xs font-sans text-sage/70 font-medium tracking-[0.3em] uppercase mt-1">
      Education Consultancy
    </span>
  </div>
);

export function Footer() {
  return (
    <footer className="bg-navy text-white relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute -bottom-[50%] -right-[10%] w-[80%] aspect-square rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-[1400px] pt-24 pb-10 relative z-10">
        
        {/* Top Section: Newsletter & Brand */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-16 mb-24 border-b border-white/10 pb-16">
          
          <div className="flex flex-col gap-8 max-w-lg">
            <Link href="/" className="inline-block">
              <BrandLogo />
            </Link>
            <p className="text-ivory/60 font-sans text-sm leading-relaxed max-w-sm">
              We guide ambition beyond borders. Your trusted partner for international education, admissions, and career counseling based in Dahod, Gujarat.
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
              Stay Updated
            </span>
            <div className="flex items-center w-full lg:w-[400px] border-b border-white/20 pb-2 focus-within:border-gold transition-colors group">
              <Mail size={16} className="text-white/40 mr-3 group-focus-within:text-gold transition-colors" />
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-white/30"
              />
              <button className="text-white/60 hover:text-gold transition-colors ml-2">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 mb-24">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
              Company
            </span>
            <ul className="flex flex-col gap-4 text-sm text-ivory/70 font-sans">
              <li><Link href="/" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Home</Link></li>
              <li><Link href="#about" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">About Us</Link></li>
              <li><Link href="#why-pathway" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Why Pathway</Link></li>
              <li><Link href="#contact" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Contact</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
              Services
            </span>
            <ul className="flex flex-col gap-4 text-sm text-ivory/70 font-sans">
              <li><Link href="#services" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">University Selection</Link></li>
              <li><Link href="#services" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Application Guidance</Link></li>
              <li><Link href="#services" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Visa Assistance</Link></li>
              <li><Link href="#services" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Pre-departure Support</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
              Destinations
            </span>
            <ul className="flex flex-col gap-4 text-sm text-ivory/70 font-sans">
              <li><Link href="#study-abroad" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">United Kingdom</Link></li>
              <li><Link href="#study-abroad" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">United States</Link></li>
              <li><Link href="#study-abroad" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Canada</Link></li>
              <li><Link href="#study-abroad" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-flex items-center gap-1">Australia <ArrowUpRight size={10} className="text-gold" /></Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col gap-6 col-span-2 md:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
              Get in Touch
            </span>
            <ul className="flex flex-col gap-4 text-sm text-ivory/70 font-sans">
              <li>
                <a href="tel:+917506284722" className="hover:text-white transition-colors block">
                  <span className="text-white/40 block text-xs mb-0.5">Ateka Chunawala</span>
                  +91 75062 84722
                </a>
              </li>
              <li>
                <a href="tel:+919409161562" className="hover:text-white transition-colors block">
                  <span className="text-white/40 block text-xs mb-0.5">Faizah Kutervaali</span>
                  +91 94091 61562
                </a>
              </li>
              <li className="mt-2 text-ivory/50">
                1st Floor, Yusuf Corner,<br />
                Godi Road, Dahod – 389151<br />
                Gujarat, India
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-ivory/40">
            © {new Date().getFullYear()} Pathway Education Consultancy. All Rights Reserved.
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
