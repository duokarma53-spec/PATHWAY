"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const DESTINATIONS = [
  {
    name: "UNITED KINGDOM",
    description: "Home to some of the world's oldest and most prestigious universities. Experience a rich academic tradition mixed with vibrant, modern student life.",
    image: "/images/united_kingdom.jpg",
  },
  {
    name: "UNITED STATES",
    description: "The largest international student population in the world. Unparalleled flexibility, cutting-edge research facilities, and diverse campus cultures.",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "CANADA",
    description: "Consistently ranked as one of the best countries in the world for quality of life, offering excellent education and welcoming immigration policies.",
    image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=2011&auto=format&fit=crop",
  },
  {
    name: "AUSTRALIA",
    description: "Globally recognized institutions, incredible natural landscapes, and a strong focus on student support and post-graduation opportunities.",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=2130&auto=format&fit=crop",
  },
  {
    name: "KYRGYZSTAN (MEDICAL)",
    description: "A premier destination for medical education, featuring the renowned International Higher School of Medicine (IHSM) with world-class facilities.",
    image: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?q=80&w=2070&auto=format&fit=crop",
  },
];

export function StudyAbroad() {
  const [hoveredDest, setHoveredDest] = useState(DESTINATIONS[0]);

  return (
    <section id="study-abroad" className="py-24 md:py-32 bg-navy text-ivory relative overflow-hidden">
      
      {/* Background Image (Faded) */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={hoveredDest.name}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            src={hoveredDest.image}
            alt={hoveredDest.name}
            className="w-full h-full object-cover grayscale"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-[1400px]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 md:mb-28">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-[1px] bg-gold" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-sage">
                Study Abroad
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-[1.1] tracking-tight">
              Where will your <br className="hidden md:block" />
              <span className="text-gold italic">next chapter</span> take you?
            </h2>
          </div>
        </div>

        {/* Interactive Destinations List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Left: The List */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="border-t border-white/10">
              {DESTINATIONS.map((dest, i) => (
                <div
                  key={dest.name}
                  className="group relative border-b border-white/10 py-6 md:py-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  onMouseEnter={() => setHoveredDest(dest)}
                >
                  <div className="flex items-baseline gap-6 md:gap-12 relative z-10">
                    <span className="text-sm font-sans font-medium text-sage/50 group-hover:text-gold transition-colors duration-300">
                      0{i + 1}
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-white/50 group-hover:text-white transition-colors duration-500">
                      {dest.name}
                    </h3>
                  </div>
                  
                  <div className="hidden md:block overflow-hidden relative z-10">
                    <motion.div 
                      className="text-gold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out"
                    >
                      <ArrowUpRight size={32} strokeWidth={1.5} />
                    </motion.div>
                  </div>
                  
                  {/* Subtle hover background highlight */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Featured Destination Info */}
          <div className="lg:col-span-5 relative h-[400px] lg:h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={hoveredDest.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col"
              >
                <div className="relative w-full h-[300px] lg:h-[400px] overflow-hidden mb-8">
                  <img
                    src={hoveredDest.image}
                    alt={hoveredDest.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border border-white/10 m-4 pointer-events-none" />
                </div>
                
                <h4 className="font-serif text-2xl text-white mb-4">
                  Study in {hoveredDest.name.split(' ')[0]}
                </h4>
                <p className="text-ivory/70 font-sans leading-relaxed max-w-md">
                  {hoveredDest.description}
                </p>
                
                <Link href="#contact" className="group flex items-center gap-2 mt-8 text-xs font-bold uppercase tracking-widest text-gold hover:text-white transition-colors w-fit">
                  Explore Programs <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </section>
  );
}
