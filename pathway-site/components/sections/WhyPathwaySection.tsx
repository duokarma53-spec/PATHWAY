'use client';

import { FadeIn } from '@/components/animations/FadeIn';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { WHY_PATHWAY } from '@/lib/seed-data';

export function WhyPathwaySection() {
  return (
    <Section className="bg-bg-primary py-20 md:py-28 relative overflow-hidden">
      <Container className="max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">

          {/* Left — sticky header */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <FadeIn>
              <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-text-muted block mb-8">
                WHY PATHWAY
              </span>
              <h2 className="headline-lg text-text-primary">
                A different kind{' '}
                <span className="italic text-text-muted">of consultancy.</span>
              </h2>
            </FadeIn>
          </div>

          {/* Right — principles list */}
          <div className="lg:col-span-8">
            <div className="divide-y divide-border/40">
              {WHY_PATHWAY.map((point, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <div className="py-8 md:py-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 group">
                    <div className="md:col-span-1">
                      <span className="font-sans font-medium text-sm text-gold">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="md:col-span-11">
                      <h3 className="font-sans font-semibold text-lg text-text-primary mb-3 tracking-wide">{point.title}</h3>
                      <p className="font-sans text-text-secondary text-base leading-relaxed max-w-[60ch]">{point.description}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

        </div>
      </Container>
    </Section>
  );
}
