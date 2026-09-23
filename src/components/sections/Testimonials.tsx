"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Placeholder data - clearly marked for real content
const TESTIMONIALS = [
  {
    id: 1,
    quote: "Pathway made what felt overwhelming feel completely manageable. Their guidance helped me secure a place in my dream university.",
    author: "Riya M.",
    detail: "BSc Computer Science, United Kingdom",
  },
  {
    id: 2,
    quote: "The personalized attention I received was incredible. They didn't just give me a list of colleges, they helped me find the right fit for my career goals.",
    author: "Rahul S.",
    detail: "MSc Engineering, Canada",
  },
  {
    id: 3,
    quote: "Navigating medical admissions abroad seemed impossible until I found Pathway. Their end-to-end support took all the stress away.",
    author: "Ayesha K.",
    detail: "MBBS, Kyrgyzstan",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  return (
    <section className="py-24 md:py-32 bg-ivory relative border-t border-navy/5">
      <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Header Area */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-[1px] bg-gold" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/60">
                  Student Success
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-navy leading-[1.1] tracking-tight mb-8">
                Stories that <br />
                <span className="italic text-midnight/60">matter.</span>
              </h2>
            </div>

            {/* Navigation Controls */}
            <div className="hidden lg:flex items-center gap-4 mt-auto">
              <button 
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all duration-300 group"
                aria-label="Previous testimonial"
              >
                <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all duration-300 group"
                aria-label="Next testimonial"
              >
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Testimonial Content */}
          <div className="lg:col-span-8 relative min-h-[300px] flex items-center">
            
            <span className="absolute -top-12 -left-8 text-[120px] font-serif text-navy/5 select-none leading-none">
              "
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full"
              >
                <h3 className="font-serif text-2xl md:text-4xl text-navy leading-snug mb-10 md:mb-16">
                  "{TESTIMONIALS[currentIndex].quote}"
                </h3>
                
                <div className="flex items-center gap-6">
                  {/* Optional Profile Image Placeholder */}
                  <div className="w-12 h-12 rounded-full bg-navy/10 border border-navy/5 flex items-center justify-center overflow-hidden">
                    <span className="font-sans font-medium text-navy/50 text-sm">
                      {TESTIMONIALS[currentIndex].author.charAt(0)}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-sans font-bold text-sm tracking-widest uppercase text-navy">
                      {TESTIMONIALS[currentIndex].author}
                    </h4>
                    <p className="text-midnight/60 font-sans text-xs mt-1">
                      {TESTIMONIALS[currentIndex].detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex lg:hidden items-center gap-4 mt-8">
            <button 
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all duration-300"
            >
              <ArrowLeft size={14} />
            </button>
            <button 
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all duration-300"
            >
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
