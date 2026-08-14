'use client';

import { useState, useMemo } from 'react';
import { DEMO_UNIVERSITIES } from '@/lib/seed-data';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '@/components/animations/FadeIn';
import Link from 'next/link';
import { ArrowRight, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export function UniversitiesSection() {
  const [activeCountry, setActiveCountry] = useState<string>('All');
  
  // Extract unique countries
  const countries = useMemo(() => {
    const unique = Array.from(new Set(DEMO_UNIVERSITIES.map(u => u.country)));
    return ['All', ...unique];
  }, []);

  // Filter universities based on selection
  const filteredUniversities = useMemo(() => {
    if (activeCountry === 'All') return DEMO_UNIVERSITIES.slice(0, 12);
    return DEMO_UNIVERSITIES.filter(u => u.country === activeCountry);
  }, [activeCountry]);

  return (
    <section className="section-padding bg-bg-secondary relative overflow-hidden border-t border-border">
      <div className="container-padding max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <FadeIn>
              <div className="flex items-center gap-3 mb-5">
                <div className="gold-rule" />
                <span className="label-text">The Shortlist</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="headline-lg text-text-primary max-w-xl">
                Curated for<br />ambition.
              </h2>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.2} className="md:self-end">
            <Link
              href="/universities"
              className="group flex items-center gap-2 text-text-primary text-sm tracking-wide border-b border-border-dark hover:border-text-primary pb-0.5 transition-colors duration-200 font-medium"
            >
              View all partnerships
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 duration-200" />
            </Link>
          </FadeIn>
        </div>

        {/* Filter */}
        <FadeIn delay={0.3}>
          <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-border">
            {countries.map(country => (
              <button
                key={country}
                onClick={() => setActiveCountry(country)}
                className={cn(
                  "px-5 py-2 text-sm transition-all duration-300 rounded-full border",
                  activeCountry === country 
                    ? "bg-text-primary text-white border-text-primary" 
                    : "bg-bg-primary text-text-secondary border-border hover:border-border-dark hover:text-text-primary"
                )}
              >
                {country}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredUniversities.map((uni, i) => (
              <motion.div
                layout
                key={uni.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group relative bg-bg-primary border border-border hover:border-gold/40 p-6 transition-colors duration-300 flex flex-col h-full cursor-pointer hover:shadow-sm"
              >
                <div className="mb-4 text-text-muted group-hover:text-gold transition-colors duration-300">
                  <Landmark strokeWidth={1.5} size={24} />
                </div>
                
                <h3 className="font-serif text-xl text-text-primary mb-2 line-clamp-2 leading-tight">
                  {uni.name}
                </h3>
                
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                    {uni.country}
                  </span>
                  
                  {(uni.globalRank || uni.rank) && (
                    <span className="text-xs bg-bg-secondary px-2 py-1 rounded text-text-secondary border border-border">
                      Rank #{uni.globalRank || uni.rank}
                    </span>
                  )}
                </div>
                
                {/* Subtle hover indicator */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-gold w-0 group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
