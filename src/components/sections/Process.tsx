"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const STEPS = [
  { num: "01", title: "DISCOVER", description: "Discuss your background, interests and goals." },
  { num: "02", title: "SHORTLIST", description: "Identify suitable courses and pathways." },
  { num: "03", title: "APPLY", description: "Receive guidance through the admission process." },
  { num: "04", title: "SECURE", description: "Ensure documentation is correctly prepared." },
  { num: "05", title: "PREPARE", description: "Get support with visa and final arrangements." },
  { num: "06", title: "FLY", description: "Begin the next chapter of your journey." },
];

export function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Calculate the height of the active line based on scroll
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-24 md:py-32 bg-white relative" ref={containerRef}>
      <div className="container mx-auto px-4 md:px-8 max-w-[1000px]">
        
        {/* Header */}
        <div className="text-center mb-20 md:mb-32">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-8 h-[1px] bg-gold" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/60">
              The Journey
            </span>
            <span className="w-8 h-[1px] bg-gold" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-navy leading-[1.1] tracking-tight">
            How we <span className="italic text-midnight/60">move forward.</span>
          </h2>
        </div>

        {/* Vertical Journey */}
        <div className="relative">
          
          {/* Background Track Line */}
          <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-[1px] bg-navy/10 -translate-x-1/2" />
          
          {/* Active Animated Line */}
          <motion.div 
            className="absolute left-[23px] md:left-1/2 top-0 w-[2px] bg-gold -translate-x-1/2 origin-top"
            style={{ height: lineHeight }}
          />

          <div className="flex flex-col gap-12 md:gap-24 relative z-10">
            {STEPS.map((step, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div key={index} className={`flex flex-row md:flex-row items-start md:items-center w-full`}>
                  
                  {/* Left Content (Empty on Mobile, alternates on Desktop) */}
                  <div className={`hidden md:block md:w-1/2 ${isEven ? 'pr-12 text-right' : 'order-3 pl-12 text-left'}`}>
                    {isEven ? (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                      >
                        <h4 className="font-sans font-bold tracking-widest text-lg text-navy mb-2">{step.title}</h4>
                        <p className="text-midnight/60 font-sans text-sm ml-auto max-w-[250px]">{step.description}</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                      >
                        <h4 className="font-sans font-bold tracking-widest text-lg text-navy mb-2">{step.title}</h4>
                        <p className="text-midnight/60 font-sans text-sm max-w-[250px]">{step.description}</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Center Node */}
                  <div className={`md:w-auto ${isEven ? 'order-2' : 'order-2'}`}>
                    <div className="w-12 h-12 rounded-full bg-white border border-navy/20 flex items-center justify-center relative shadow-sm z-10">
                      <span className="text-xs font-mono font-medium text-gold">{step.num}</span>
                      
                      {/* Active Node Ping Effect (CSS handled dynamically based on scroll if needed, but static hover works well for now) */}
                      <div className="absolute inset-0 rounded-full border border-gold opacity-0 scale-150 transition-all duration-500 hover:scale-100 hover:opacity-100 cursor-pointer" />
                    </div>
                  </div>

                  {/* Mobile Content (Always on Right) */}
                  <div className={`w-full pl-8 md:hidden`}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6 }}
                      className="pt-2"
                    >
                      <h4 className="font-sans font-bold tracking-widest text-base text-navy mb-2">{step.title}</h4>
                      <p className="text-midnight/60 font-sans text-sm">{step.description}</p>
                    </motion.div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
