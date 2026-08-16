"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center pt-20 overflow-hidden bg-ivory">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ivory/50 z-10" />
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop"
          alt="Diverse group of students walking on campus"
          className="w-full h-full object-cover object-[70%_30%] opacity-90"
          loading="eager"
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-navy bg-gold/20 px-3 py-1 rounded-full">
              PATHWAY EDUCATION CONSULTANCY · DAHOD
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-4xl sm:text-5xl md:text-7xl font-medium text-navy leading-tight mt-5 mb-5"
          >
            Your Future Deserves <br className="hidden md:block" />
            <span className="text-gold">A Better Path.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-xl text-midnight/80 font-sans leading-relaxed mb-7 max-w-xl"
          >
            From choosing the right course to securing admission and preparing for your journey abroad, Pathway helps students move forward with clarity and confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 mb-7 w-full sm:w-auto"
          >
            <Button href="#contact" size="lg" className="w-full sm:w-auto">Start Your Journey</Button>
            <Button href="#study-abroad" variant="outline" size="lg" className="w-full sm:w-auto">Explore Opportunities</Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xs font-medium text-navy/70 tracking-wide uppercase flex flex-wrap gap-x-3 gap-y-2"
          >
            <span>Admissions</span> • <span>Career Guidance</span> • <span>Overseas Education</span> • <span>Visa Support</span>
          </motion.div>
        </div>

        {/* Floating Card — desktop only */}
        <motion.div
          initial={{ opacity: 0, y: 30, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="hidden lg:flex absolute right-10 bottom-20 bg-white/90 backdrop-blur-md p-6 rounded-sm shadow-xl max-w-sm border border-gold/10 items-start gap-4"
        >
          <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#C8A96B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16V12" stroke="#C8A96B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8H12.01" stroke="#C8A96B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h4 className="font-serif font-bold text-navy text-lg leading-tight mb-1">Personalised Guidance</h4>
            <p className="text-sm text-midnight/70">From first counselling to your next step.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
