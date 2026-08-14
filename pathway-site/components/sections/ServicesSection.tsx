'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';

// India services
const INDIA_SERVICES = [
  { num: '01', title: 'Career Counselling', desc: 'Understand your options before choosing your direction.' },
  { num: '02', title: 'Engineering Admissions', desc: 'Guidance for top engineering programs across India.' },
  { num: '03', title: 'Medical Admissions', desc: 'Strategic support for medical entrance and college admissions.' },
  { num: '04', title: 'ACPC Support', desc: 'Step-by-step assistance with Gujarat ACPC processes.' },
  { num: '05', title: 'Alternative Admissions', desc: 'Guidance for students seeking other academic pathways.' },
];

// Abroad services
const ABROAD_SERVICES = [
  { num: '06', title: 'Overseas Education', desc: 'University applications and international study counselling.' },
  { num: '07', title: 'Student Visa', desc: 'Expert support for international student visa applications.' },
  { num: '08', title: 'Visitor Visa', desc: 'Assistance for families and companions travelling abroad.' },
  { num: '09', title: 'Application Support', desc: 'End-to-end tracking from form-filling to final submission.' },
  { num: '10', title: 'Air Ticket Booking', desc: 'Travel support for a seamless start to the journey.' },
];

export function ServicesSection() {
  return (
    <Section className="bg-bg-primary py-20 md:py-28">
      <Container className="max-w-[1400px]">
        {/* Header */}
        <FadeIn>
          <div className="mb-16 md:mb-20">
            <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-text-muted block mb-6">
              SERVICES
            </span>
            <h2 className="headline-lg text-text-primary">
              One journey.{' '}
              <span className="italic text-text-muted">Every step covered.</span>
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16">
          {/* India Column */}
          <div>
            <FadeIn delay={0.1}>
              <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border">
                <span className="font-sans font-bold text-[10px] tracking-widest uppercase text-text-muted">INDIA</span>
                <div className="flex-1 h-px bg-border/50" />
              </div>
            </FadeIn>
            {INDIA_SERVICES.map((s, i) => (
              <FadeIn key={s.num} delay={0.1 + i * 0.06}>
                <Link href="/consultation" className="group flex items-start gap-6 py-6 border-b border-border/40 hover:border-border transition-colors duration-300">
                  <span className="font-sans font-medium text-sm text-gold shrink-0 w-8">{s.num}</span>
                  <div className="flex-1">
                    <h3 className="font-sans font-semibold tracking-wide text-base text-text-primary mb-1 group-hover:text-gold transition-colors duration-300">{s.title}</h3>
                    <p className="font-sans text-text-secondary text-sm">{s.desc}</p>
                  </div>
                  <ArrowRight size={16} className="text-text-faint group-hover:text-gold group-hover:translate-x-1 transition-all duration-300 mt-0.5 shrink-0" />
                </Link>
              </FadeIn>
            ))}
          </div>

          {/* Abroad Column */}
          <div>
            <FadeIn delay={0.15}>
              <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border mt-12 lg:mt-0">
                <span className="font-sans font-bold text-[10px] tracking-widest uppercase text-text-muted">ABROAD</span>
                <div className="flex-1 h-px bg-border/50" />
              </div>
            </FadeIn>
            {ABROAD_SERVICES.map((s, i) => (
              <FadeIn key={s.num} delay={0.15 + i * 0.06}>
                <Link href="/consultation" className="group flex items-start gap-6 py-6 border-b border-border/40 hover:border-border transition-colors duration-300">
                  <span className="font-sans font-medium text-sm text-gold shrink-0 w-8">{s.num}</span>
                  <div className="flex-1">
                    <h3 className="font-sans font-semibold tracking-wide text-base text-text-primary mb-1 group-hover:text-gold transition-colors duration-300">{s.title}</h3>
                    <p className="font-sans text-text-secondary text-sm">{s.desc}</p>
                  </div>
                  <ArrowRight size={16} className="text-text-faint group-hover:text-gold group-hover:translate-x-1 transition-all duration-300 mt-0.5 shrink-0" />
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
