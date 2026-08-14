'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';

export function WhatWeHelpWithSection() {
  return (
    <Section className="bg-bg-secondary py-20 md:py-28 relative overflow-hidden">
      <Container className="max-w-[1400px]">
        <FadeIn>
          <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-text-muted block mb-8">
            WHAT WE HELP WITH
          </span>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-px border border-border/30">
          {/* India Pillar */}
          <FadeIn delay={0.1}>
            <div className="group p-10 md:p-16 bg-bg-secondary border-b lg:border-b-0 lg:border-r border-border/30 hover:bg-bg-primary transition-colors duration-500 flex flex-col justify-between min-h-[360px]">
              <div>
                <h3 className="font-sans font-bold text-[64px] md:text-[80px] leading-none text-text-primary/10 group-hover:text-gold/15 transition-colors duration-500 mb-8 select-none">
                  IN
                </h3>
                <h4 className="font-sans font-bold tracking-widest text-xs uppercase text-text-primary mb-4">INDIA EDUCATION</h4>
                <p className="font-sans text-text-secondary text-base leading-relaxed max-w-[38ch]">
                  Career counselling, engineering and medical admissions, ACPC support and domestic college guidance.
                </p>
              </div>
              <Link href="/services" className="group/link mt-10 inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm font-sans font-medium transition-colors duration-300">
                View India services
                <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>
          </FadeIn>

          {/* Abroad Pillar */}
          <FadeIn delay={0.2}>
            <div className="group p-10 md:p-16 bg-bg-secondary hover:bg-bg-primary transition-colors duration-500 flex flex-col justify-between min-h-[360px]">
              <div>
                <h3 className="font-sans font-bold text-[64px] md:text-[80px] leading-none text-text-primary/10 group-hover:text-gold/15 transition-colors duration-500 mb-8 select-none">
                  AB
                </h3>
                <h4 className="font-sans font-bold tracking-widest text-xs uppercase text-text-primary mb-4">OVERSEAS EDUCATION</h4>
                <p className="font-sans text-text-secondary text-base leading-relaxed max-w-[38ch]">
                  International university applications, study abroad counselling, student visas and visitor visas.
                </p>
              </div>
              <Link href="/destinations" className="group/link mt-10 inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm font-sans font-medium transition-colors duration-300">
                Explore destinations
                <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
