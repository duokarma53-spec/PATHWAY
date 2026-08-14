import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Comprehensive education and career guidance services across India and abroad.',
};

export default function ServicesPage() {
  return (
    <main>
      {/* Header */}
      <Section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-bg-secondary relative overflow-hidden">
        <Container className="max-w-[1400px]">
          <FadeIn>
            <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-text-muted block mb-6">SERVICES</span>
            <h1 className="headline-xl text-text-primary mb-8 max-w-[16ch]">
              Comprehensive <span className="italic text-text-muted">guidance.</span>
            </h1>
            <p className="font-sans text-text-secondary text-lg leading-relaxed max-w-[50ch]">
              Whether you're looking for top engineering colleges in India, medical admissions, or planning to study abroad — we provide end-to-end support for your educational journey.
            </p>
          </FadeIn>
        </Container>
      </Section>

      {/* Main Services Split */}
      <Section className="py-20 md:py-28 bg-bg-primary border-t border-border/40">
        <Container className="max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* India */}
            <div>
              <FadeIn delay={0.1}>
                <div className="flex items-center gap-4 mb-12 pb-4 border-b border-border">
                  <h2 className="font-sans font-bold text-xs tracking-widest uppercase text-text-primary">INDIA EDUCATION</h2>
                  <div className="flex-1 h-px bg-border/50" />
                </div>
                
                <div className="space-y-12">
                  <div>
                    <h3 className="font-sans font-semibold text-xl text-text-primary mb-3">Career Counselling</h3>
                    <p className="font-sans text-text-secondary text-base leading-relaxed">
                      We help students identify their strengths and align them with the right career paths. Through detailed discussions, we provide clarity on which academic stream will yield the best long-term outcomes.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-xl text-text-primary mb-3">Engineering Admissions</h3>
                    <p className="font-sans text-text-secondary text-base leading-relaxed">
                      Comprehensive support for engineering admissions across India. We guide students through entrance exam requirements, college selection, and application strategies for top-tier institutions.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-xl text-text-primary mb-3">Medical Admissions</h3>
                    <p className="font-sans text-text-secondary text-base leading-relaxed">
                      Navigating medical admissions is highly competitive. We provide strategic guidance for NEET preparation pathways, college shortlisting, and the complex counseling processes.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-xl text-text-primary mb-3">ACPC Support</h3>
                    <p className="font-sans text-text-secondary text-base leading-relaxed">
                      For students in Gujarat, we offer step-by-step assistance with the Admission Committee for Professional Courses (ACPC) registration, choice filling, and seat allocation procedures.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Abroad */}
            <div>
              <FadeIn delay={0.2}>
                <div className="flex items-center gap-4 mb-12 pb-4 border-b border-border mt-8 lg:mt-0">
                  <h2 className="font-sans font-bold text-xs tracking-widest uppercase text-text-primary">OVERSEAS EDUCATION</h2>
                  <div className="flex-1 h-px bg-border/50" />
                </div>
                
                <div className="space-y-12">
                  <div>
                    <h3 className="font-sans font-semibold text-xl text-text-primary mb-3">University Applications</h3>
                    <p className="font-sans text-text-secondary text-base leading-relaxed">
                      End-to-end support for applying to universities in the UK, US, Canada, Australia, and more. We help craft strong applications, SOPs, and resumes that stand out to international admission committees.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-xl text-text-primary mb-3">Student Visas</h3>
                    <p className="font-sans text-text-secondary text-base leading-relaxed">
                      Expert guidance on navigating complex student visa processes. We assist with documentation, interview preparation, and compliance with the latest immigration regulations of the destination country.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-xl text-text-primary mb-3">Visitor Visas</h3>
                    <p className="font-sans text-text-secondary text-base leading-relaxed">
                      We also assist family members wanting to visit students abroad or accompany them during intake periods, ensuring all documentation is accurate for a smooth process.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-xl text-text-primary mb-3">Travel & Post-Admission</h3>
                    <p className="font-sans text-text-secondary text-base leading-relaxed">
                      Our support doesn't end at the acceptance letter. We assist with flight bookings, pre-departure briefings, and connecting you with resources for a seamless transition abroad.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>

          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-charcoal py-20 md:py-28 text-white text-center">
        <Container className="max-w-[1400px]">
          <FadeIn>
            <h2 className="headline-lg text-white mb-6">Not sure which service fits?</h2>
            <p className="font-sans text-white/60 text-lg mb-10 max-w-[40ch] mx-auto">
              Book a free consultation and let's discuss your educational goals together.
            </p>
            <Link
              href="/consultation"
              className="group inline-flex items-center gap-2 bg-white text-charcoal px-10 py-5 font-sans font-bold tracking-widest text-xs uppercase hover:bg-gold hover:text-charcoal transition-colors duration-300 rounded-sm"
            >
              Book a Consultation
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 duration-300" />
            </Link>
          </FadeIn>
        </Container>
      </Section>
    </main>
  );
}
