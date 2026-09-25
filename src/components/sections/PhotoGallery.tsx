"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, MapPin, Phone } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const PHOTOS = [
  {
    src: "/images/gallery-2.jpeg",
    alt: "Pathway reception with world map mural",
    caption: "Reception",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/images/gallery-9.jpeg",
    alt: "Pathway reception – night view",
    caption: "Welcome Area",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/images/gallery-6.jpeg",
    alt: "Inner consultation room",
    caption: "Consultation Office",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/images/gallery-1.jpeg",
    alt: "Pathway consultation desk",
    caption: "Consultation Desk",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/images/gallery-4.jpeg",
    alt: "Our team at the office",
    caption: "Our Team",
    span: "md:col-span-2 md:row-span-1",
  },
  {
    src: "/images/gallery-7.jpeg",
    alt: "World map mural – reception wall",
    caption: "World Map Wall",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/images/gallery-5.jpeg",
    alt: "Pathway office exterior entrance",
    caption: "Our Entrance",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/images/gallery-3.jpeg",
    alt: "Pathway reception front view",
    caption: "Reception (Day)",
    span: "md:col-span-1 md:row-span-1",
  },
];

export function PhotoGallery() {
  const [lightbox, setLightbox] = useState<null | (typeof PHOTOS)[0]>(null);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-midnight text-white">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="OUR OFFICE"
          title={<span className="text-white">Come Visit Us in Dahod.</span>}
        />

        {/* Masonry Gallery */}
        <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {PHOTOS.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
              className="relative overflow-hidden rounded-xl group cursor-pointer break-inside-avoid"
              onClick={() => setLightbox(photo)}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />

              {/* Zoom icon */}
              <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <ZoomIn size={14} className="text-white" />
                </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pointer-events-none">
                <motion.p
                  className="text-[11px] font-sans font-bold tracking-[0.18em] uppercase text-gold translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
                >
                  {photo.caption}
                </motion.p>
              </div>

              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </motion.div>
          ))}
        </div>

        {/* Visit Us Strip */}
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-midnight/96 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-colors active:scale-95 z-10"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <motion.img
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="absolute bottom-6 left-0 right-0 text-center text-xs text-white/40 font-sans tracking-widest uppercase">
              {lightbox.caption} — Pathway Education Consultancy
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
