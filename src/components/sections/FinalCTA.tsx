"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="relative py-20 md:py-48 bg-navy text-center overflow-hidden">
      
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/gallery-1.jpeg" 
          alt="Pathway Education World Map"
          className="w-full h-full object-cover grayscale opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/80 to-navy" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-4xl flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="w-8 h-[1px] bg-gold" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
            Take The Next Step
          </span>
          <span className="w-8 h-[1px] bg-gold" />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-[1] tracking-tight mb-6 md:mb-8"
        >
          READY TO BEGIN <br className="hidden md:block" />
          <span className="italic text-white/50">YOUR JOURNEY?</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-ivory/80 font-sans mb-12 max-w-lg"
        >
          Your next chapter starts with a conversation. Let's explore your possibilities together.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link 
            href="#contact" 
            className="group flex items-center justify-center gap-4 bg-white text-navy h-[60px] px-10 rounded-full text-sm font-sans font-bold uppercase tracking-widest transition-all duration-300 hover:bg-gold hover:text-white"
          >
            Start Your Journey
            <ArrowUpRight 
              size={18} 
              className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" 
            />
          </Link>
        </motion.div>
        
      </div>
    </section>
  );
}
