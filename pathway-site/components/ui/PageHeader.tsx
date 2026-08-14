'use client';

import { FadeIn } from '@/components/animations/FadeIn';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <Section className="bg-bg-primary pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-border/20">
      <Container className="max-w-5xl">
        <FadeIn>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-[1px] bg-gold" />
            <span className="label-text text-gold">{eyebrow}</span>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.1}>
          <h1 className="headline-lg text-text-primary mb-6">
            {title}
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-[55ch]">
            {description}
          </p>
        </FadeIn>
      </Container>
    </Section>
  );
}