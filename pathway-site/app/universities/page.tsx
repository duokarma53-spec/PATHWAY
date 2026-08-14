import { DEMO_UNIVERSITIES } from '@/lib/seed-data';
import { FadeIn } from '@/components/animations/FadeIn';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Universities',
  description: 'Explore universities worldwide that Pathway students have gained admission to.',
};

const BY_COUNTRY = DEMO_UNIVERSITIES.reduce((acc, uni) => {
  if (!acc[uni.country]) acc[uni.country] = [];
  acc[uni.country].push(uni);
  return acc;
}, {} as Record<string, typeof DEMO_UNIVERSITIES>);

export default function UniversitiesPage() {
  return (
    <div className="pt-20 bg-charcoal min-h-screen">
      <section className="section-padding border-b border-border">
        <div className="container-padding max-w-5xl mx-auto">
          <FadeIn>
            <div className="flex items-center gap-3 mb-8">
              <div className="gold-rule" />
              <span className="label-text">Universities</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="headline-lg text-ivory">Where could your Pathway lead?</h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-5 text-text-muted text-lg leading-relaxed max-w-xl">
              A selection of universities our students have applied to and been admitted to. Organised by country.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-padding max-w-5xl mx-auto space-y-16">
          {Object.entries(BY_COUNTRY).map(([country, unis], i) => (
            <FadeIn key={country} delay={i * 0.08}>
              <div>
                <h2 className="font-serif text-2xl text-ivory mb-8 pb-4 border-b border-border">{country}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unis.map(uni => (
                    <div key={uni.id} className="flex items-center gap-4 p-4 border border-border hover:border-gold/30 transition-colors duration-200 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold/40 group-hover:bg-gold transition-colors duration-200 shrink-0" />
                      <span className="text-text-muted text-sm group-hover:text-ivory transition-colors duration-200">{uni.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
