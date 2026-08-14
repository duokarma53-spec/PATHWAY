import { HeroSection } from '@/components/sections/HeroSection';
import { PathwayStorySection } from '@/components/sections/PathwayStorySection';
import { DestinationsSection } from '@/components/sections/DestinationsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { UniversitiesSection } from '@/components/sections/UniversitiesSection';
import { SuccessStoriesSection } from '@/components/sections/SuccessStoriesSection';
import { WhyPathwaySection } from '@/components/sections/WhyPathwaySection';
import { TeamSection } from '@/components/sections/TeamSection';
import { ParentSection } from '@/components/sections/ParentSection';
import { InsightsSection } from '@/components/sections/InsightsSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { LeadSection } from '@/components/sections/LeadSection';
import { CtaSection } from '@/components/sections/CtaSection';
import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — International Education Consultancy`,
  description: SITE_CONFIG.description,
  alternates: { canonical: 'https://pathwayconsultancy.in' },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PathwayStorySection />
      <DestinationsSection />
      <ServicesSection />
      <HowItWorksSection />
      <UniversitiesSection />
      <SuccessStoriesSection />
      <WhyPathwaySection />
      <TeamSection />
      <ParentSection />
      <InsightsSection />
      <FaqSection />
      <LeadSection />
      <CtaSection />
    </>
  );
}
