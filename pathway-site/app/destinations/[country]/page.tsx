import { DEMO_DESTINATIONS } from '@/lib/seed-data';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ country: string }>;
}

export async function generateStaticParams() {
  return DEMO_DESTINATIONS.map(d => ({ country: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  const dest = DEMO_DESTINATIONS.find(d => d.slug === country);
  if (!dest) return {};
  return {
    title: `Study in ${dest.name}`,
    description: dest.overview,
  };
}

export default async function CountryPage({ params }: Props) {
  const { country } = await params;
  const dest = DEMO_DESTINATIONS.find(d => d.slug === country);
  if (!dest) notFound();

  return (
    <div className="pt-20 bg-charcoal min-h-screen">
      {/* Hero */}
      <section className="relative h-72 md:h-96">
        <Image src={dest.imageUrl} alt={dest.name} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/30 to-charcoal" />
        <div className="absolute bottom-8 container-padding max-w-5xl mx-auto w-full">
          <Link href="/destinations" className="group inline-flex items-center gap-2 text-ivory/60 hover:text-ivory text-sm mb-4 transition-colors">
            <ArrowLeft size={14} /> All Destinations
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl text-ivory">{dest.flag} {dest.name}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-padding max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main */}
            <div className="lg:col-span-2">
              <FadeIn>
                <p className="text-text-muted text-lg leading-relaxed mb-10">{dest.overview}</p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h2 className="font-serif text-2xl text-ivory mb-5">Popular Fields of Study</h2>
                <div className="flex flex-wrap gap-3 mb-10">
                  {dest.popularCourses.map(c => (
                    <span key={c} className="px-4 py-2 border border-border text-text-muted text-sm">{c}</span>
                  ))}
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <h2 className="font-serif text-2xl text-ivory mb-5">Visa Information</h2>
                <p className="text-text-muted leading-relaxed">{dest.visaInfo}</p>
              </FadeIn>
            </div>

            {/* Sidebar */}
            <div className="space-y-0">
              {[
                { label: 'Tuition Range', value: `${dest.currency} ${dest.averagTuitionMin.toLocaleString()} – ${dest.averagTuitionMax.toLocaleString()} / year` },
                { label: 'Application Period', value: dest.applicationPeriod },
              ].map(({ label, value }) => (
                <FadeIn key={label}>
                  <div className="border-t border-border py-6">
                    <div className="label-text text-text-faint mb-2">{label}</div>
                    <p className="text-ivory text-sm">{value}</p>
                  </div>
                </FadeIn>
              ))}
              <FadeIn delay={0.2}>
                <div className="pt-6">
                  <Link href="/consultation" className="group flex items-center justify-center gap-2 w-full py-4 bg-gold text-charcoal font-medium text-sm tracking-wide hover:bg-gold-light transition-colors duration-200">
                    Talk to a Counsellor
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
