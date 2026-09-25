"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImagesScrollingAnimation } from "@/components/ui/images-scrolling-animation";

export function PhotoGallery() {
  return (
    <section id="gallery" className="bg-midnight text-white relative">

      {/* Background wrapper — overflow-hidden MUST be here, NOT on the section,
          because overflow-hidden on the section kills position:sticky for cards */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">

      {/* 1. Primary radial glow — soft navy/blue bloom behind the gallery center */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 45%, rgba(20,60,110,0.35) 0%, rgba(11,31,51,0.12) 50%, transparent 80%)",
        }}
      />

      {/* 2. Secondary warm glow — very subtle gold accent top-center */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 30% at 50% 15%, rgba(200,169,107,0.06) 0%, transparent 70%)",
        }}
      />

      {/* 3. Bottom-left gold accent — faint warm light leak */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle 400px at 15% 85%, rgba(200,169,107,0.05) 0%, transparent 70%)",
        }}
      />

      {/* 4. Bottom-right blue accent — adds asymmetry */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle 350px at 85% 75%, rgba(30,80,140,0.08) 0%, transparent 70%)",
        }}
      />

      {/* 5. Abstract world-map / travel contour SVG pattern — very faint */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Simplified world contour lines */}
          <g stroke="white" strokeWidth="1.2" fill="none">
            {/* Large continental contours */}
            <path d="M120 350 Q200 280 320 300 Q440 320 500 260 Q560 200 680 220 Q800 240 850 300 Q900 360 920 340" />
            <path d="M80 420 Q180 380 280 400 Q380 420 460 380 Q540 340 640 360 Q740 380 820 420 Q900 460 980 440" />
            <path d="M200 500 Q320 460 420 480 Q520 500 600 460 Q680 420 780 440 Q880 460 960 500" />
            
            {/* Flight path arcs */}
            <path d="M180 350 Q400 180 700 280" strokeDasharray="8 6" opacity="0.6" />
            <path d="M300 450 Q550 250 900 350" strokeDasharray="8 6" opacity="0.4" />
            <path d="M100 300 Q350 120 650 200" strokeDasharray="8 6" opacity="0.3" />
            
            {/* Meridian / latitude grid lines */}
            <path d="M0 200 Q300 180 600 200 Q900 220 1200 200" opacity="0.3" />
            <path d="M0 400 Q300 380 600 400 Q900 420 1200 400" opacity="0.3" />
            <path d="M0 600 Q300 580 600 600 Q900 620 1200 600" opacity="0.3" />
            <path d="M300 0 Q280 200 300 400 Q320 600 300 800" opacity="0.3" />
            <path d="M600 0 Q580 200 600 400 Q620 600 600 800" opacity="0.3" />
            <path d="M900 0 Q880 200 900 400 Q920 600 900 800" opacity="0.3" />
            
            {/* Small destination dots */}
            <circle cx="320" cy="300" r="3" fill="white" opacity="0.5" />
            <circle cx="680" cy="220" r="3" fill="white" opacity="0.5" />
            <circle cx="500" cy="260" r="2.5" fill="white" opacity="0.4" />
            <circle cx="850" cy="300" r="2" fill="white" opacity="0.3" />
            <circle cx="200" cy="500" r="2" fill="white" opacity="0.3" />
            
            {/* Compass rose hint — top right */}
            <g transform="translate(1050 120)" opacity="0.4">
              <circle cx="0" cy="0" r="30" />
              <line x1="0" y1="-35" x2="0" y2="35" />
              <line x1="-35" y1="0" x2="35" y2="0" />
              <line x1="-22" y1="-22" x2="22" y2="22" strokeWidth="0.6" />
              <line x1="22" y1="-22" x2="-22" y2="22" strokeWidth="0.6" />
            </g>
          </g>
        </svg>
      </div>

      {/* 6. Subtle top/bottom edge vignette for depth framing */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,21,33,0.6) 0%, transparent 12%, transparent 88%, rgba(7,21,33,0.6) 100%)",
        }}
      />

      {/* 7. Very faint vertical center guide line — adds intentional "centered" feeling */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px pointer-events-none z-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent 5%, rgba(200,169,107,0.06) 30%, rgba(200,169,107,0.04) 70%, transparent 95%)",
        }}
      />
      </div>{/* end background wrapper */}


      {/* ═══════════════════════════════════════════════════
          CONTENT — z-10
          ═══════════════════════════════════════════════════ */}

      <div className="relative z-10">
        <div className="container mx-auto px-4 md:px-8 pt-16 md:pt-24">
          <SectionHeading
            eyebrow="OUR OFFICE"
            title={<span className="text-white">Come Visit Us in Dahod.</span>}
          />
        </div>

        {/* Scrolling Card Gallery */}
        <ImagesScrollingAnimation />

        {/* Visit Us Strip */}
        <div className="container mx-auto px-4 md:px-8 pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-gold" />
              </div>
              <div>
                <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gold mb-0.5">Visit Us</p>
                <p className="text-sm text-white/80 font-sans">
                  1st Floor, Yusuf Corner, Godi Road, Dahod – 389151, Gujarat
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="tel:+917506284722"
                className="flex items-center gap-2 bg-white/10 hover:bg-gold/20 border border-white/10 hover:border-gold/30 text-white text-sm font-sans px-4 py-2.5 rounded-full transition-all duration-300"
              >
                <Phone size={14} className="text-gold" />
                +91 75062 84722
              </a>
              <a
                href="https://maps.google.com/?q=Yusuf+Corner,+Godi+Road,+Dahod,+Gujarat+389151"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gold text-navy font-sans font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-gold/90 transition-all duration-300"
              >
                <MapPin size={14} />
                Open in Maps
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
