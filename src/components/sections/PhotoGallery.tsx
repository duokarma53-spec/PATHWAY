"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImagesScrollingAnimation } from "@/components/ui/images-scrolling-animation";

export function PhotoGallery() {
  return (
    <section id="gallery" className="bg-midnight text-white">
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
    </section>
  );
}
