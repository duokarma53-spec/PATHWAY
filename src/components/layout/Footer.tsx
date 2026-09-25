"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Mail, Phone, MapPin, MessageCircle, ArrowUp } from "lucide-react";

// Fancy Typography Logo Component
const BrandLogo = () => (
  <div className="flex flex-col group cursor-pointer w-fit">
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
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-navy text-white relative overflow-hidden">
      
      {/* Radial Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-midnight/40 via-navy to-navy pointer-events-none" />
      
      {/* Decorative Gold Blurs */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute -bottom-[50%] -right-[10%] w-[80%] aspect-square rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      {/* Huge Background Wordmark */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none overflow-hidden flex items-end justify-center z-0">
        <span className="font-serif font-bold text-[18vw] leading-none text-white opacity-[0.02] tracking-tighter mix-blend-overlay">
          PATHWAY.
        </span>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-[1400px] pt-16 md:pt-32 pb-8 relative z-10">
        
        {/* Strong CTA Above Footer Columns */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 md:mb-32 relative z-20">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-white mb-4">
              Your journey <br className="hidden md:block"/>
              <span className="text-white/50 italic">starts here.</span>
            </h2>
            <p className="text-ivory/60 font-sans text-lg md:text-xl max-w-md">
              Let's find the right path for your future.
            </p>
          </div>
          <Link 
            href="#contact" 
            className="group flex items-center gap-4 bg-gold text-navy px-8 py-4 rounded-full font-sans font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors duration-300 shadow-xl shrink-0"
          >
            Book a Consultation
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Top Section: Newsletter & Brand */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 md:mb-24 border-b border-white/10 pb-10 md:pb-16 relative z-20">
          
          <div className="flex flex-col gap-6 max-w-lg">
            <Link href="/" className="inline-block">
              <BrandLogo />
            </Link>
            <p className="text-ivory/60 font-sans text-sm leading-relaxed max-w-sm mt-4">
              We guide ambition beyond borders. Your trusted partner for international education, admissions, and career counseling based in Dahod, Gujarat.
            </p>
          </div>

          {/* Upgraded Newsletter Section */}
          <div className="w-full lg:w-auto flex flex-col gap-6">
            <h3 className="font-serif text-2xl text-white">
              Stay Updated
            </h3>
            <div className="flex items-center w-full lg:w-[450px] bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-2 pl-6 focus-within:border-gold/50 focus-within:bg-white/10 transition-all duration-300 group">
              <Mail size={16} className="text-white/40 group-focus-within:text-gold transition-colors shrink-0" />
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-white/30 px-4"
              />
              <button className="w-10 h-10 rounded-full bg-navy border border-white/10 flex items-center justify-center shrink-0 text-white/60 group-hover:text-gold group-hover:border-gold/50 transition-all duration-300">
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
          
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 mb-16 md:mb-32 relative z-20">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
              Company
            </span>
            <ul className="flex flex-col gap-5 text-sm text-ivory/60 font-sans">
              <li><Link href="/" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block relative group w-max">Home<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-300"></span></Link></li>
              <li><Link href="#about" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block relative group w-max">About Us<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-300"></span></Link></li>
              <li><Link href="#why-pathway" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block relative group w-max">Why Pathway<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-300"></span></Link></li>
              <li><Link href="#contact" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block relative group w-max">Contact<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-300"></span></Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-8 lg:col-span-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
              Services
            </span>
            <ul className="flex flex-col gap-5 text-sm text-ivory/60 font-sans">
              <li><Link href="#services" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block relative group w-max">University Selection<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-300"></span></Link></li>
              <li><Link href="#services" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block relative group w-max">Application Guidance<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-300"></span></Link></li>
              <li><Link href="#services" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block relative group w-max">Visa Assistance<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-300"></span></Link></li>
              <li><Link href="#services" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block relative group w-max">Pre-departure Support<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-300"></span></Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-8 lg:col-span-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
              Destinations
            </span>
            <ul className="flex flex-col gap-5 text-sm text-ivory/60 font-sans">
              <li><Link href="#study-abroad" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block relative group w-max">United Kingdom<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-300"></span></Link></li>
              <li><Link href="#study-abroad" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block relative group w-max">United States<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-300"></span></Link></li>
              <li><Link href="#study-abroad" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block relative group w-max">Canada<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-300"></span></Link></li>
              <li><Link href="#study-abroad" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-flex items-center gap-1 relative group w-max">Australia <ArrowUpRight size={12} className="text-gold" /><span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-300"></span></Link></li>
            </ul>
          </div>

          {/* Column 4 - Get in touch */}
          <div className="flex flex-col gap-8 col-span-2 lg:col-span-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
              Get in Touch
            </span>
            <ul className="flex flex-col gap-6 text-sm text-ivory/60 font-sans">
              <li>
                <a href="tel:+917506284722" className="group flex items-start gap-4 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-gold/50 group-hover:bg-gold/10 transition-colors">
                    <Phone size={12} className="text-gold" />
                  </div>
                  <div>
                    <span className="text-white/40 block text-xs mb-1 uppercase tracking-widest">Ateka Chunawala</span>
                    <span className="text-lg font-serif group-hover:text-gold transition-colors">+91 75062 84722</span>
                  </div>
                </a>
              </li>
              <li>
                <a href="tel:+919409161562" className="group flex items-start gap-4 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-gold/50 group-hover:bg-gold/10 transition-colors">
                    <MessageCircle size={12} className="text-gold" />
                  </div>
                  <div>
                    <span className="text-white/40 block text-xs mb-1 uppercase tracking-widest">Faizah Kutervaali</span>
                    <span className="text-lg font-serif group-hover:text-gold transition-colors">+91 94091 61562</span>
                  </div>
                </a>
              </li>
              <li className="pt-2">
                <a href="https://maps.google.com/?q=1st+Floor,+Yusuf+Corner,+Godi+Road,+Dahod+–+389151,+Gujarat,+India" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-gold/50 group-hover:bg-gold/10 transition-colors">
                    <MapPin size={12} className="text-gold" />
                  </div>
                  <span className="leading-relaxed group-hover:text-white transition-colors">
                    1st Floor, Yusuf Corner,<br />
                    Godi Road, Dahod – 389151<br />
                    Gujarat, India
                  </span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section - Legal Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-20">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <p className="text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-ivory/40 text-center md:text-left">
              © {new Date().getFullYear()} Pathway Education Consultancy.
            </p>
            <div className="hidden md:block w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-4 text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-ivory/40">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span>·</span>
              <Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link>
            </div>
          </div>
          
          <button onClick={scrollToTop} className="group flex items-center gap-2 text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-gold hover:text-white transition-colors">
            Back to top
            <ArrowUp size={12} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
}
