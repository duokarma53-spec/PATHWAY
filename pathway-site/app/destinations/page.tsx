import { DEMO_DESTINATIONS } from '@/lib/seed-data';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Study Destinations',
  description: 'Explore countries to study abroad — UK, USA, Canada, Australia, Germany, Ireland, New Zealand, Singapore and more.',
};

export default function DestinationsPage() {
  return (
    <div className="pt-20 bg-charcoal min-h-screen">
      {/* Header */}
      <section className="section-padding border-b border-border">
        <div className="container-padding max-w-5xl mx-auto">
          <FadeIn>
            <div className="flex items-center gap-3 mb-8">
              <div className="gold-rule" />
              <span className="label-text">Study Destinations</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="headline-lg text-ivory">
              Where will your Pathway lead?
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-5 text-text-muted text-lg leading-relaxed max-w-2xl">
              Each destination offers something different. We help you find the one that is right for your goals, profile, and future.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="section-padding">
        <div className="container-padding max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {DEMO_DESTINATIONS.map((dest, i) => (
              <FadeIn key={dest.id} delay={i * 0.05}>
                <Link href={`/destinations/${dest.slug}`} className="group block bg-charcoal h-full">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={dest.imageUrl}
                      alt={dest.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="text-2xl">{dest.flag}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="font-serif text-xl text-ivory mb-2 group-hover:text-gold/90 transition-colors duration-200">
                      {dest.name}
                    </h2>
                    <p className="text-text-muted text-sm leading-relaxed line-clamp-2 mb-4">{dest.overview}</p>
                    <div className="flex items-center gap-2 text-gold text-sm">
                      <span>Explore</span>
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5 duration-200" />
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
