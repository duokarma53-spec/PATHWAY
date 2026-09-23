"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 md:mb-32">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="w-8 h-[1px] bg-gold" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/60">
                The Space
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-serif text-5xl md:text-6xl lg:text-7xl text-navy leading-[1.1] tracking-tight"
            >
              Step inside <br/>
              <span className="text-midnight/60 italic">Pathway.</span>
            </motion.h2>
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-midnight/70 font-sans max-w-sm"
          >
            A space designed around conversations, possibilities, and the journeys that begin with them. Located in the heart of Dahod.
          </motion.p>
        </div>

        {/* Asymmetrical Gallery Composition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 relative">
          
          {/* Left Column (Images 1 & 2) */}
          <div className="md:col-span-5 flex flex-col gap-12 md:gap-32 md:mt-20">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="group relative w-full aspect-[4/5] overflow-hidden bg-ivory"
            >
              <img
                src="/images/gallery-7.jpeg"
                alt="Pathway Office Interior"
                className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-95 transition-all duration-700 ease-out"
              />
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-[10px] font-mono tracking-widest text-white/90 bg-navy/60 backdrop-blur-md px-3 py-2 uppercase">
                  Consultation Room
                </span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="group relative w-[85%] md:w-[70%] ml-auto aspect-square overflow-hidden bg-ivory"
            >
              <img
                src="/images/gallery-3.jpeg"
                alt="Pathway Workspace"
                className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-95 transition-all duration-700 ease-out"
              />
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-[10px] font-mono tracking-widest text-white/90 bg-navy/60 backdrop-blur-md px-3 py-2 uppercase">
                  Details
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column (Images 3 & 4) */}
          <div className="md:col-span-7 flex flex-col gap-12 md:gap-24 relative">
            
            {/* Minimal About Text block intersecting */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="md:absolute top-[10%] -left-[20%] z-20 bg-white p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(11,31,51,0.05)] max-w-md hidden md:block"
            >
              <h3 className="font-serif text-2xl text-navy mb-4">Guidance that begins with understanding you.</h3>
              <p className="text-midnight/70 font-sans text-sm leading-relaxed mb-6">
                Pathway Education Consultancy is an education and career guidance centre helping students make informed decisions about higher education, admissions, and international study opportunities.
              </p>
              <Link href="#contact" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold hover:text-navy transition-colors">
                Visit Us <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.1 }}
              className="group relative w-full aspect-[16/9] overflow-hidden bg-ivory mt-8 md:mt-0"
            >
              <img
                src="/images/gallery-1.jpeg"
                alt="Pathway Office World Map"
                className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-95 transition-all duration-700 ease-out"
              />
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-[10px] font-mono tracking-widest text-white/90 bg-navy/60 backdrop-blur-md px-3 py-2 uppercase">
                  The Map Room
                </span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.3 }}
              className="group relative w-[90%] aspect-[3/4] md:aspect-[4/3] overflow-hidden bg-ivory"
            >
              <img
                src="/images/gallery-8.jpeg"
                alt="Pathway Office Discussion Area"
                className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-95 transition-all duration-700 ease-out"
              />
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-[10px] font-mono tracking-widest text-white/90 bg-navy/60 backdrop-blur-md px-3 py-2 uppercase">
                  Meeting Space
                </span>
              </div>
            </motion.div>
          </div>

        </div>
        
        {/* Mobile About Text (Visible only on mobile) */}
        <div className="md:hidden mt-12 bg-white/50 p-6 border border-navy/5">
          <h3 className="font-serif text-xl text-navy mb-3">Guidance that begins with understanding you.</h3>
          <p className="text-midnight/70 font-sans text-sm leading-relaxed mb-6">
            Pathway Education Consultancy is an education and career guidance centre helping students make informed decisions about higher education, admissions, and international study opportunities.
          </p>
          <Link href="#contact" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold hover:text-navy transition-colors">
            Visit Us <ArrowUpRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
