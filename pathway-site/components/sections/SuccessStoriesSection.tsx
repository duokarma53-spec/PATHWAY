'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';

export function SuccessStoriesSection() {
  return (
    <Section id="success-stories" className="bg-bg-inverse py-20 md:py-28 relative overflow-hidden text-white">
      <Container className="max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <FadeIn>
              <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-white/40 block mb-6">
                OUR APPROACH
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="headline-lg text-white mb-8">
                Every student has a unique trajectory.
              </h2>
              <p className="font-sans text-white/60 text-lg leading-relaxed max-w-[50ch]">
                We don't manufacture success stories; we help build real ones. From Dahod to top-tier institutions in India and abroad, our guidance is built on transparency, dedication, and genuine care for your future.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10">
          {[
            {
              title: "Honest Guidance",
              description: "No false promises or fabricated guarantees. We evaluate your profile objectively and recommend paths where you have the strongest chance to thrive."
            },
            {
              title: "Comprehensive Support",
              description: "From selecting the right course and university to handling the intricacies of visas and travel arrangements, we stand by you at every step."
            },
            {
              title: "Long-Term Vision",
              description: "We don't just look at university admissions. We consider your long-term career goals, return on investment, and personal growth opportunities."
            }
          ].map((principle, index) => (
            <FadeIn key={index} delay={0.1 * (index + 1)} className="border-b md:border-b-0 md:border-r border-white/10 last:border-0">
              <div className="p-8 md:p-12 h-full flex flex-col">
                <span className="font-sans text-gold text-[10px] uppercase tracking-widest font-bold mb-8">Principle {String(index + 1).padStart(2, '0')}</span>
                <h3 className="font-sans font-semibold text-xl text-white mb-4">{principle.title}</h3>
                <p className="font-sans text-white/60 text-sm leading-relaxed">{principle.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 flex justify-center">
          <FadeIn delay={0.4}>
            <Link
              href="/success-stories"
              className="group inline-flex items-center gap-2 text-white hover:text-gold transition-colors duration-300 font-sans font-medium text-sm tracking-wide"
            >
              Read more about our approach
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 duration-200" />
            </Link>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
