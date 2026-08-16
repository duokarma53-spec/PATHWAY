"use client";

import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";

const PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop",
    alt: "University campus building",
    className: "col-span-1 md:col-span-2 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop",
    alt: "Students graduating",
    className: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
    alt: "Modern university library",
    className: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop",
    alt: "Medical student in lab",
    className: "col-span-1 md:col-span-2 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop",
    alt: "Student studying",
    className: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=2070&auto=format&fit=crop",
    alt: "Student walking to campus",
    className: "col-span-1 row-span-1",
  },
];

export function PhotoGallery() {
  return (
    <section className="py-16 md:py-24 bg-midnight text-white">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="LIFE AT CAMPUS"
          title={<span className="text-white">Every Journey Begins Somewhere.</span>}
        />

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 grid-rows-3 md:grid-rows-2 gap-4 h-[600px] md:h-[500px]">
          {PHOTOS.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative overflow-hidden rounded-sm group ${photo.className}`}
            >
              <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
