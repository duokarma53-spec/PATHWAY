'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <Section
      ref={containerRef as any}
      className="relative min-h-[calc(100vh-72px)] lg:min-h-[800px] flex items-center py-16 overflow-hidden bg-bg-secondary"
    >
      <Container className="w-full relative z-10 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Text Content — 5 cols */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-8">
                <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-text-muted">
                  PATHWAY EDUCATION CONSULTANCY · DAHOD, GUJARAT
                </span>
              </div>

              <h1 className="headline-xl text-text-primary mb-6 leading-[1.05]">
                Career, admissions
                <br />
                and overseas
                <br />
                <span className="italic text-gold">education guidance.</span>
              </h1>

              <p className="font-sans text-text-secondary text-base md:text-lg max-w-[42ch] leading-relaxed mb-10">
                Personalised support for students and families navigating admissions in India and opportunities abroad.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Link
                  href="/consultation"
                  className="group inline-flex items-center gap-2 bg-charcoal text-white px-8 py-4 font-sans font-bold text-xs tracking-widest uppercase hover:bg-gold hover:text-charcoal transition-colors duration-300 rounded-sm"
                >
                  Book a Consultation
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 border border-border text-text-secondary px-8 py-4 font-sans font-medium text-xs tracking-widest uppercase hover:border-charcoal hover:text-text-primary transition-colors duration-300 rounded-sm"
                >
                  Explore Services
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Image — 7 cols, no overflow */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative h-[50vh] md:h-[60vh] lg:h-[80vh] w-full min-h-[380px] overflow-hidden rounded-sm">
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div style={{ y }} className="w-full h-full relative">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                  alt="Students in discussion about education"
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-charcoal/10" />
              </motion.div>
            </motion.div>
          </div>

        </div>
      </Container>
    </Section>
  );
}
