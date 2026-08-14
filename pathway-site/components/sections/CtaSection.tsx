'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-bg-inverse py-32 md:py-48 rounded-t-3xl -mt-6 z-20">
      
      {/* Large background text */}
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
      >
        <motion.span
          className="font-serif text-[24vw] text-white/[0.03] whitespace-nowrap leading-none"
          animate={{ x: ['-5%', '5%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear', repeatType: "reverse" }}
        >
          Your Pathway
        </motion.span>
      </div>

      <div className="container-padding max-w-4xl mx-auto text-center relative z-10">
        <FadeIn>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-px bg-gold/40" />
            <span className="label-text text-gold">Ready to begin?</span>
            <div className="w-12 h-px bg-gold/40" />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="headline-xl text-white mb-8">
            Your future is worth<br />
            <span className="italic text-white/70">a conversation.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12 font-light">
            Book a no-obligation consultation with a Pathway counsellor. No pressure. No scripts. Just an honest conversation about where you want to go.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/consultation"
              className="group relative overflow-hidden inline-flex items-center justify-center gap-3 bg-gold text-charcoal font-medium text-sm tracking-wide px-10 py-5 hover:bg-gold-light transition-colors duration-300 w-full sm:w-auto"
            >
              Book a Consultation
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 duration-300" />
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 text-white/70 hover:text-white text-sm tracking-wide transition-colors duration-300 border border-white/20 hover:border-white/50 px-10 py-5 w-full sm:w-auto"
            >
              Contact Us Directly
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
