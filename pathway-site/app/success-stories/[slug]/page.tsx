import { DEMO_SUCCESS_STORIES } from '@/lib/seed-data';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, GraduationCap, MapPin } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import type { Metadata } from 'next';

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return DEMO_SUCCESS_STORIES.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = DEMO_SUCCESS_STORIES.find(s => s.slug === slug);
  if (!story) return {};
  return { title: `${story.studentName} — ${story.university}` };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = DEMO_SUCCESS_STORIES.find(s => s.slug === slug);
  if (!story) notFound();

  return (
    <div className="pt-20 bg-charcoal min-h-screen">
      <section className="relative h-64 md:h-80">
        <Image src={story.imageUrl ?? ''} alt={story.studentName} fill className="object-cover object-top" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 via-charcoal/30 to-charcoal" />
        <div className="absolute bottom-8 container-padding max-w-4xl mx-auto w-full">
          <Link href="/success-stories" className="inline-flex items-center gap-2 text-ivory/60 hover:text-ivory text-sm mb-4 transition-colors">
            <ArrowLeft size={14} /> All Stories
          </Link>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-padding max-w-4xl mx-auto">
          <FadeIn>
            <div className="mb-8">
              <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest mb-2">
                <GraduationCap size={12} /> Admitted to {story.university}
              </div>
              <h1 className="font-serif text-4xl text-ivory mb-2">{story.studentName}</h1>
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <MapPin size={12} className="text-gold" /> {story.course} · {story.country}
              </div>
            </div>
          </FadeIn>

          <div className="space-y-8 max-w-2xl">
            {[
              { label: 'Background', content: story.background },
              { label: 'The Challenge', content: story.challenge },
              { label: 'Our Strategy', content: story.strategy },
            ].map(({ label, content }) => (
              <FadeIn key={label}>
                <div className="border-l-2 border-border pl-6">
                  <div className="label-text text-text-faint mb-2">{label}</div>
                  <p className="text-text-muted leading-relaxed">{content}</p>
                </div>
              </FadeIn>
            ))}
            <FadeIn delay={0.3}>
              <div className="border-l-2 border-gold pl-6 bg-gold/5 py-4 pr-4">
                <div className="label-text text-gold mb-2">Outcome</div>
                <p className="text-ivory leading-relaxed">{story.outcome}</p>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.4}>
            <div className="mt-16 pt-8 border-t border-border">
              <p className="text-text-muted mb-4">Ready to write your own story?</p>
              <Link href="/consultation" className="inline-flex items-center gap-2 bg-gold text-charcoal font-medium text-sm px-6 py-3 hover:bg-gold-light transition-colors">
                Book a Consultation
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
