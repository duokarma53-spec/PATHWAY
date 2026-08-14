'use client';

import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerChildren, staggerItem } from '@/components/animations/StaggerChildren';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Building2, Compass, Target, FileText } from 'lucide-react';

const DOMESTIC_SERVICES = [
  {
    icon: Compass,
    title: 'Career Counselling',
    desc: 'Unbiased guidance to help you choose the right stream and career path based on your strengths.',
  },
  {
    icon: Building2,
    title: 'Engineering Admissions',
    desc: 'Strategic support for competitive engineering college admissions across Gujarat and India.',
  },
  {
    icon: Target,
    title: 'Medical Admissions',
    desc: 'Guidance through the complex medical entrance and admission processes.',
  },
  {
    icon: FileText,
    title: 'ACPC Guidance',
    desc: 'Step-by-step assistance with ACPC registration, choice filling, and securing your seat.',
  },
];

export function DomesticAdmissionsSection() {
  return (
    <Section id="career-admissions" className="bg-bg-secondary relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          
          {/* Left: Sticky Header */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <FadeIn>
              <div className="flex items-center gap-3 mb-6">
                <div className="gold-rule" />
                <span className="label-text">India Education</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="headline-lg text-text-primary mb-8">
                Career & Admission<br />
                <span className="italic text-text-muted">Guidance.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-text-secondary leading-relaxed text-lg max-w-[65ch]">
                Navigating admissions in India requires precision and timely action. Whether you are aiming for top-tier Engineering or Medical colleges, or need help with the ACPC process, our dedicated team in Dahod is here to guide you.
              </p>
            </FadeIn>
          </div>

          {/* Right: Grid of Capabilities */}
          <div className="lg:col-span-7 mt-8 lg:mt-0">
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-6" delay={0.1} stagger={0.1}>
              {DOMESTIC_SERVICES.map((service, i) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={i}
                    variants={staggerItem}
                    className="bg-bg-primary p-8 border border-border/50 hover:border-gold/30 transition-colors duration-300"
                  >
                    <div className="mb-6 inline-flex items-center justify-center w-12 h-12 bg-bg-secondary rounded-full border border-border">
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