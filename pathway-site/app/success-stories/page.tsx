import { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'Success Stories',
  description: 'Real student journeys from Dahod to top universities in India and abroad.',
};

export default function SuccessStoriesPage() {
  return (
    <main>
      {/* Header */}
      <Section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-bg-secondary relative overflow-hidden">
        <Container className="max-w-[1400px]">
          <FadeIn>
            <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-text-muted block mb-6">OUR APPROACH</span>
            <h1 className="headline-xl text-text-primary mb-8 max-w-[20ch]">
              Real journeys. <span className="italic text-text-muted">Individual guidance.</span>
            </h1>
            <p className="font-sans text-text-secondary text-lg leading-relaxed max-w-[55ch]">
              We believe in honest counselling. Rather than manufacturing success stories, we focus on helping every individual student find the path where they can genuinely thrive, whether that's a top engineering college in Gujarat or a university abroad.
            </p>
          </FadeIn>
        </Container>
      </Section>

      {/* Core Principles */}
      <Section className="py-20 md:py-28 bg-bg-primary border-t border-border/40">
        <Container className="max-w-[1400px]">
          <FadeIn>
            <div className="mb-16 md:mb-20">
              <h2 className="headline-lg text-text-primary">
                How we measure success
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            <FadeIn delay={0.1}>
              <div className="border-t border-border pt-6">
                <span className="font-sans text-gold font-bold text-[10px] tracking-widest uppercase mb-6 block">01</span>
                <h3 className="font-sans font-semibold text-xl text-text-primary mb-4">No Fabricated Guarantees</h3>
                <p className="font-sans text-text-secondary text-base leading-relaxed">
                  We don't promise 100% scholarships or guaranteed acceptances if they aren't realistic. We evaluate your profile objectively and recommend paths where you have the strongest chance of success.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="border-t border-border pt-6">
                <span className="font-sans text-gold font-bold text-[10px] tracking-widest uppercase mb-6 block">02</span>
                <h3 className="font-sans font-semibold text-xl text-text-primary mb-4">Focus on the Right Fit</h3>
                <p className="font-sans text-text-secondary text-base leading-relaxed">
                  Success isn't just about getting into the most famous university. It's about finding the institution and course that aligns perfectly with your academic strengths, career goals, and financial planning.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="border-t border-border pt-6">
                <span className="font-sans text-gold font-bold text-[10px] tracking-widest uppercase mb-6 block">03</span>
                <h3 className="font-sans font-semibold text-xl text-text-primary mb-4">Long-Term Vision</h3>
                <p className="font-sans text-text-secondary text-base leading-relaxed">
                  We look beyond admissions. Our counselling considers return on investment, post-study work opportunities, and the long-term career trajectory of every decision you make.
                </p>
              </div>
            </FadeIn>
          </div>
        </Container>
      </Section>
    </main>
  );
}
