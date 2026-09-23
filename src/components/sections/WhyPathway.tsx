"use client";

import React from "react";
import { motion } from "framer-motion";

const PROOF_POINTS = [
  {
    title: "PERSONALIZED GUIDANCE",
    description: "Every student's academic journey is different. We don't believe in one-size-fits-all solutions.",
  },
  {
    title: "UNIVERSITY EXPERTISE",
    description: "Deep understanding of admission criteria, course structures, and long-term career prospects.",
  },
  {
    title: "END-TO-END SUPPORT",
    description: "From initial counseling to application, documentation, visa processing, and travel preparation.",
  },
  {
    title: "STUDENT-FIRST APPROACH",
    description: "A counseling center based in Dahod prioritizing accessible, transparent, and factual guidance.",
  },
];

export function WhyPathway() {
  return (
    <section id="why-pathway" className="py-24 md:py-32 bg-ivory relative">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          
          {/* Left: Huge Brand Statement */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mb-8"
            >
              <span className="w-8 h-[1px] bg-gold" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/60">
                Our Philosophy
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-serif text-3xl md:text-4xl lg:text-5xl text-navy leading-[1.1] tracking-tight pr-0 lg:pr-12"
            >
              We don't just process applications. <br className="hidden md:block" />
              <span className="text-midnight/60 italic">We help build your next chapter.</span>
            </motion.h2>
          </div>

          {/* Right: Architectural List */}
          <div className="lg:col-span-5 lg:mt-16">
            <div className="border-t border-navy/10">
              {PROOF_POINTS.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="py-6 border-b border-navy/10 group"
                >
                  <div className="flex items-start gap-6">
                    <span className="text-xs font-mono font-medium text-gold mt-1">
                      0{index + 1}
                    </span>
                    <div>
                      <h4 className="font-sans font-bold text-sm tracking-widest uppercase text-navy mb-2 group-hover:text-gold transition-colors duration-300">
                        {point.title}
                      </h4>
                      <p className="text-midnight/70 font-sans text-sm leading-relaxed max-w-sm">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
        </div>
        
      </div>
    </section>
  );
}
