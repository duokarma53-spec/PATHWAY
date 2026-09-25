"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-ivory selection:bg-gold/30"
    >
      <div className="container mx-auto px-4 md:px-8 relative z-20 w-full max-w-[1400px]">
        {/* Editorial Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Typography */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center order-2 lg:order-1 relative z-20">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-[1px] bg-gold" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/60">
                  Pathway Education Consultancy
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-medium text-navy leading-[0.92] tracking-tight mb-6 md:mb-8"
            >
              YOUR WORLD<br />
              <span className="text-midnight/60 italic">BEGINS BEYOND</span><br />
              BORDERS.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-base md:text-xl text-midnight/70 font-sans leading-relaxed max-w-md mb-8 md:mb-12"
            >
              Personalized guidance for ambitious students building their future across the world.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-8"
            >
              <Link 
                href="#contact" 
                className="group flex items-center gap-3 text-sm font-sans font-medium uppercase tracking-widest text-navy"
              >
                Start Your Journey
                <span className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-all duration-300 group-hover:border-navy">
                  <ArrowDownRight size={14} className="transform group-hover:-rotate-90 transition-transform duration-300" />
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Architectural Image Composition */}
          <div className="lg:col-span-6 xl:col-span-7 relative h-[45vh] sm:h-[55vh] lg:h-[80vh] w-full order-1 lg:order-2 mt-4 sm:mt-8 lg:mt-0">
            
            {/* Primary Large Image */}
            <motion.div 
              style={{ y: y1 }}
              initial={{ opacity: 0, scale: 0.95, clipPath: 'inset(10% 0 10% 0)' }}
              animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0 0% 0)' }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 w-[90%] lg:w-[75%] h-[85%] shadow-2xl z-10"
            >
              <div className="absolute inset-0 bg-navy/10 z-10 mix-blend-overlay" />
              <Image
                src="/images/gallery-2.jpeg"
                alt="Pathway Education Consultancy Office Reception"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 75vw"
                className="object-cover grayscale-[20%]"
              />
              
              {/* Subtle Coordinate Label */}
              <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-1 hidden sm:flex">
                <span className="text-[9px] font-mono tracking-widest text-white/80 bg-navy/40 backdrop-blur-md px-2 py-1">
                  22.8333° N, 74.2500° E
                </span>
                <span className="text-[9px] font-mono tracking-widest text-white/80 bg-navy/40 backdrop-blur-md px-2 py-1">
                  DAHOD, GJ
                </span>
              </div>
            </motion.div>

            {/* Secondary Overlapping Image */}
            <motion.div 
              style={{ y: y2 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 bottom-[5%] lg:bottom-[10%] w-[60%] lg:w-[45%] h-[50%] lg:h-[55%] shadow-[0_30px_60px_-15px_rgba(11,31,51,0.3)] z-20 border-8 border-ivory"
            >
              <Image
                src="/images/gallery-6.jpeg"
                alt="Consultation Space"
                fill
                sizes="(max-width: 1024px) 60vw, 45vw"
                className="object-cover"
              />
            </motion.div>
            
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 hidden md:flex"
      >
        <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-navy/50">Scroll</span>
        <div className="w-[1px] h-12 bg-navy/20 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 w-full h-1/2 bg-gold"
            animate={{ y: [0, 48, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
