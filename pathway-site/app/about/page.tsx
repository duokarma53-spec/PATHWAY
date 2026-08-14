import type { Metadata } from 'next';
import { FadeIn } from '@/components/animations/FadeIn';
import { WHY_PATHWAY } from '@/lib/seed-data';

export const metadata: Metadata = {
  title: 'About Pathway',
  description: 'Learn about Pathway — our story, our philosophy, and our approach to international education counselling.',
};

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding bg-charcoal border-b border-border">
        <div className="container-padding max-w-4xl mx-auto">
          <FadeIn>
            <div className="flex items-center gap-3 mb-8">
              <div className="gold-rule" />
              <span className="label-text">About Pathway</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="headline-xl text-ivory mb-8">
              We believe every student deserves a path — not a template.
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-text-muted text-lg leading-relaxed max-w-2xl">
              Pathway was founded on a simple but important idea: that the most important decisions in a student's life deserve more than a generic checklist and a list of university names. They deserve genuine, personalised guidance from people who understand both education and the individuals seeking it.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-padding bg-ivory">
        <div className="container-padding max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="headline-lg text-charcoal mb-10">Our Philosophy</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {WHY_PATHWAY.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.1}>
                <div>
                  <div className="w-6 h-px bg-charcoal/30 mb-4" />
                  <h3 className="font-serif text-xl text-charcoal mb-3">{p.title}</h3>
                  <p className="text-charcoal/55 text-sm leading-relaxed">{p.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
