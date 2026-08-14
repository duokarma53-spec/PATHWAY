'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { DEMO_DESTINATIONS } from '@/lib/seed-data';
import { FadeIn } from '@/components/animations/FadeIn';
import { cn } from '@/lib/utils';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';

// Country code abbreviations — no emoji flags
const COUNTRY_CODES: Record<string, string> = {
  'United Kingdom': 'UK',
  'United States': 'US',
  'Canada': 'CA',
  'Australia': 'AU',
  'Germany': 'DE',
  'Ireland': 'IE',
  'New Zealand': 'NZ',
  'Singapore': 'SG',
};

export function DestinationsSection() {
  const [active, setActive] = useState(0);
  const dest = DEMO_DESTINATIONS[active];

  return (
    <Section className="bg-bg-inverse py-20 md:py-28 relative overflow-hidden text-white">
      <Container className="max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <FadeIn>
              <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-white/40 block mb-6">
                STUDY DESTINATIONS
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="headline-lg text-white">
                Where will your<br />Pathway lead?
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <Link
              href="/destinations"
              className="group flex items-center gap-2 text-white/60 hover:text-white text-sm tracking-wide border-b border-white/20 hover:border-white/60 pb-0.5 transition-colors duration-200 self-start md:self-auto font-sans font-medium"
            >
              Explore all destinations
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 duration-200" />
            </Link>
          </FadeIn>
        </div>

        {/* Main Interaction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[520px] border border-white/10">
          {/* Country List — left column */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible border-b lg:border-b-0 lg:border-r border-white/10">
            {DEMO_DESTINATIONS.map((d, i) => (
              <button
                key={d.id}
                onClick={() => setActive(i)}
                className={cn(
                  'flex items-center gap-3 px-5 py-4 lg:py-5 text-left transition-all duration-300 whitespace-nowrap lg:whitespace-normal w-auto lg:w-full shrink-0 border-l-0 lg:border-l-2 border-b-2 lg:border-b-0 relative group',
                  active === i
                    ? 'border-gold bg-white/5'
                    : 'border-transparent hover:bg-white/5 hover:border-white/20'
                )}
                aria-pressed={active === i}
              >
                {/* Country code badge instead of emoji */}
                <span className={cn(
                  'font-sans text-[10px] font-bold tracking-widest w-7 h-7 flex items-center justify-center border transition-colors duration-300 rounded-sm shrink-0',
                  active === i ? 'border-gold text-gold' : 'border-white/20 text-white/40 group-hover:border-white/40 group-hover:text-white/70'
                )}>
                  {COUNTRY_CODES[d.name] ?? d.name.slice(0, 2).toUpperCase()}
                </span>
                <span className={cn(
                  'font-sans text-sm transition-colors duration-300',
                  active === i ? 'text-white font-medium' : 'text-white/50 group-hover:text-white'
                )}>
                  {d.name}
                </span>
              </button>
            ))}
          </div>

          {/* Content — right */}
          <div className="lg:col-span-9 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={dest.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-full flex flex-col"
              >
                {/* Image */}
                <div className="relative h-64 md:h-[320px] overflow-hidden">
                  <Image
                    src={dest.imageUrl}
                    alt={dest.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 75vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
                  {/* Country name overlay */}
                  <div className="absolute bottom-8 left-8 md:left-10">
                    <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-white/50 block mb-2">Study in</span>
                    <span className="font-serif text-4xl md:text-5xl text-white">{dest.name}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <p className="font-sans text-white/60 leading-relaxed text-base mb-8">{dest.overview}</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {dest.popularCourses.slice(0, 4).map((course) => (
                        <span key={course} className="font-sans text-xs px-3 py-1.5 border border-white/10 text-white/50 rounded-sm">
                          {course}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="group inline-flex items-center gap-2 bg-gold text-charcoal px-6 py-3 font-sans text-xs font-bold tracking-widest uppercase hover:bg-white transition-colors duration-300 rounded-sm"
                    >
                      Explore {dest.name}
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 duration-200" />
                    </Link>
                  </div>

                  <div className="space-y-5">
                    <div className="border-t border-white/10 pt-5">
                      <div className="font-sans text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2">Tuition Range</div>
                      <p className="font-sans text-white font-medium text-sm">
                        {dest.currency} {dest.averagTuitionMin.toLocaleString()} – {dest.averagTuitionMax.toLocaleString()} / year
                      </p>
                    </div>
                    <div className="border-t border-white/10 pt-5">
                      <div className="font-sans text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2">Application Period</div>
                      <p className="font-sans text-white font-medium text-sm">{dest.applicationPeriod}</p>
                    </div>
                    <div className="border-t border-white/10 pt-5">
                      <div className="font-sans text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2">Visa & Work Rights</div>
                      <p className="font-sans text-white/70 text-sm leading-relaxed">{dest.visaInfo}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </Section>
  );
}
