"use client";

import React, { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

const PHOTOS = [
  {
    src: "/images/gallery-2.jpeg",
    alt: "Pathway reception area with world map mural",
    className: "col-span-1 md:col-span-2 row-span-2",
    caption: "Our Reception",
  },
  {
    src: "/images/gallery-4.jpeg",
    alt: "Pathway team at the consultation desk",
    className: "col-span-1 row-span-1",
    caption: "Our Team",
  },
  {
    src: "/images/gallery-1.jpeg",
    alt: "Pathway private consultation office",
    className: "col-span-1 row-span-1",
    caption: "Consultation Room",
  },
  {
    src: "/images/gallery-3.jpeg",
    alt: "Pathway reception – front angle",
    className: "col-span-1 md:col-span-2 row-span-1",
    caption: "Welcome Area",
  },
  {
    src: "/images/gallery-6.jpeg",
    alt: "Pathway consultation room with backlit world map",
    className: "col-span-1 row-span-1",
    caption: "Inner Office",
  },
  {
    src: "/images/gallery-5.jpeg",
    alt: "Pathway office world map mural and cove ceiling",
    className: "col-span-1 row-span-1",
    caption: "Map Wall",
  },
];

export function PhotoGallery() {
  const [lightbox, setLightbox] = useState<null | (typeof PHOTOS)[0]>(null);

  return (
    <section className="py-16 md:py-24 bg-midnight text-white">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="OUR OFFICE"
          title={<span className="text-white">A Space Built for Your Success.</span>}
        />

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 grid-rows-3 md:grid-rows-2 gap-3 md:gap-4 h-[700px] md:h-[520px]">
          {PHOTOS.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`relative overflow-hidden rounded-xl group cursor-pointer ${photo.className}`}
              onClick={() => setLightbox(photo)}
            >
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-navy/30 group-hover:bg-navy/10 transition-colors duration-500 z-10" />
              
              {/* Zoom Icon */}
              <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ZoomIn size={14} className="text-white" />
                </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
                <p className="text-xs font-sans font-semibold tracking-widest uppercase text-gold">
                  {photo.caption}
                </p>
              </div>

              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-midnight/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={() => setLightbox(null)}
            >
              <X size={20} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="absolute bottom-6 left-0 right-0 text-center text-sm text-white/50 font-sans tracking-widest uppercase">
              {lightbox.caption}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
