'use client';

import { FadeIn } from '@/components/animations/FadeIn';
import { LeadForm } from '@/components/forms/LeadForm';

export function LeadSection() {
  return (
    <section className="section-padding bg-charcoal-mid relative overflow-hidden" id="start">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-ivory) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      <div className="container-padding max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <FadeIn>
            <div className="flex items-center gap-3 mb-6">
              <div className="gold-rule" />
              <span className="label-text">Get Started</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="headline-lg text-ivory">
              Let's map your<br />
              <span className="font-serif italic text-gold">Pathway.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-5 text-text-muted leading-relaxed text-lg">
              Tell us where you want to go. We'll help you understand how to get there.
            </p>
          </FadeIn>
        </div>

        {/* Form */}
        <FadeIn delay={0.25}>
          <div className="border-t border-border pt-12">
            <LeadForm />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
