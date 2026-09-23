"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const SERVICES = [
  {
    id: "01",
    title: "University Selection",
    description: "Guidance for engineering, medical and general university admissions, matching your academic profile with the right institution.",
    image: "/images/gallery-1.jpeg", // Using real office photo
  },
  {
    id: "02",
    title: "Application Guidance",
    description: "End-to-end support for university admissions across disciplines, helping you prepare strong applications for top-tier institutions.",
    image: "/images/gallery-6.jpeg", // Using real office photo
  },
  {
    id: "03",
    title: "Overseas Education",
    description: "Explore global opportunities. We assist with university shortlisting and applications for the UK, Canada, Australia, USA, and Europe.",
    image: "/images/gallery-8.jpeg", // Using real office photo
  },
  {
    id: "04",
    title: "Visa Assistance",
    description: "Navigate the complex visa process with ease. Our dedicated team helps you gather the correct documentation for a smooth approval.",
    image: "/images/gallery-5.jpeg", // Using real office photo
  },
  {
    id: "05",
    title: "Pre-departure Support",
    description: "Assistance with ticket bookings, finding student accommodation, and providing essential travel tips for your new chapter.",
    image: "/images/gallery-4.jpeg", // Using real office photo
  }
];

export function Services() {
  const [hoveredService, setHoveredService] = useState(SERVICES[0]);

  return (
    <section id="services" className="py-24 md:py-32 bg-ivory relative border-t border-navy/5">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 md:mb-32">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-[1px] bg-gold" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/60">
                Expertise
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-navy leading-[1.1] tracking-tight">
              Guidance tailored <br className="hidden md:block" />
              <span className="text-midnight/60 italic">to your ambition.</span>
            </h2>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-8">
          
          {/* Left Side - Vertical Interactive List */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="border-t border-navy/10">
              {SERVICES.map((service) => (
                <div 
                  key={service.id}
                  className="group relative border-b border-navy/10 py-6 md:py-8 cursor-pointer overflow-hidden"
                  onMouseEnter={() => setHoveredService(service)}
                >
                  {/* Hover background slide */}
                  <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1] -z-10" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 relative z-10 px-4 md:px-6">
                    <div className="flex items-baseline gap-6 md:gap-12">
                      <span className="text-sm font-sans font-medium text-gold/60 group-hover:text-gold transition-colors duration-300">
                        {service.id}
                      </span>
                      <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-navy group-hover:translate-x-4 transition-transform duration-500 ease-out">
                        {service.title}
                      </h3>
                    </div>
                    
                    <motion.div 
                      className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-navy/10 text-navy group-hover:bg-navy group-hover:text-white transition-all duration-500"
                    >
                      <ArrowRight size={18} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                    </motion.div>
                  </div>

                  {/* Expandable Description */}
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[0.22,1,0.36,1] px-4 md:px-6">
                    <div className="overflow-hidden">
                      <div className="pt-6 pb-2 pl-0 md:pl-[4.5rem]">
                        <p className="text-midnight/70 font-sans max-w-md leading-relaxed">
                          {service.description}
                        </p>
                        <Link href="#contact" className="inline-flex items-center gap-2 mt-6 text-xs font-bold uppercase tracking-widest text-navy hover:text-gold transition-colors">
                          Learn More <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Dynamic Image Reveal (Desktop Only) */}
          <div className="hidden lg:block w-full lg:w-1/2 h-[700px] relative rounded-sm overflow-hidden sticky top-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={hoveredService.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-navy/10 z-10 mix-blend-overlay" />
                <img 
                  src={hoveredService.image} 
                  alt={hoveredService.title}
                  className="w-full h-full object-cover grayscale-[30%]"
                />
                
                {/* Image metadata overlay */}
                <div className="absolute bottom-8 right-8 z-20 bg-white/90 backdrop-blur-md px-6 py-4 shadow-xl">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-gold mb-1">
                    Service {hoveredService.id}
                  </span>
                  <span className="block font-serif text-xl text-navy">
                    {hoveredService.title}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </section>
  );
}
