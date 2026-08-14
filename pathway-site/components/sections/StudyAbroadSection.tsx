'use client';

import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerChildren, staggerItem } from '@/components/animations/StaggerChildren';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Globe, ShieldCheck, FileText, Plane } from 'lucide-react';

const INTERNATIONAL_SERVICES = [
  {
    icon: Globe,
    title: 'University Admissions',
    desc: 'Strategic shortlisting and application management for top universities worldwide.',
  },
  {
    icon: ShieldCheck,
    title: 'Student Visas',
    desc: 'Expert guidance on financial documentation, visa interviews, and application submission.',
  },
  {
    icon: FileText,
    title: 'Visitor Visas',
    desc: 'Assistance for family members and companions planning to travel abroad with you.',
  },
  {
    icon: Plane,
    title: 'Pre-Departure & Travel',
    desc: 'Air ticket booking assistance and comprehensive pre-departure briefings.',
  },
];

export function StudyAbroadSection() {
  return (
    <Section id="study-abroad" className="bg-bg-primary relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          
          {/* Left: Sticky Header */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 order-1 lg:order-2">
            <FadeIn>
              <div className="flex items-center gap-3 mb-6 lg:justify-end">
                <span className="label-text">Overseas Education</span>
                <div className="gold-rule" />
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="headline-lg text-text-primary mb-8 lg:text-right">
                Study<br />
                <span className="italic text-text-muted">Abroad.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-text-secondary leading-relaxed text-lg max-w-[65ch] lg:text-right lg:ml-auto">
                Studying overseas is a major decision. From selecting the right destination to securing your visa and boarding your flight, we provide end-to-end support to make your international transition seamless.
              </p>
            </FadeIn>
          </div>

          {/* Right: Grid of Capabilities */}
          <div className="lg:col-span-7 mt-8 lg:mt-0 order-2 lg:order-1">
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-6" delay={0.1} stagger={0.1}>
              {INTERNATIONAL_SERVICES.map((service, i) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={i}
                    variants={staggerItem}
                    className="bg-bg-secondary p-8 border border-border/50 hover:border-gold/30 transition-colors duration-300"
                  >
                    <div className="mb-6 inline-flex items-center justify-center w-12 h-12 bg-bg-primary rounded-full border border-border">
                      <Icon size={20} className="text-gold" />
                    </div>
                    <h3 className="font-serif text-xl text-text-primary mb-3">
                      {service.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {service.desc}
                    </p>
                  </motion.div>
                );
              })}
            </StaggerChildren>
          </div>

        </div>
      </Container>
    </Section>
  );
}