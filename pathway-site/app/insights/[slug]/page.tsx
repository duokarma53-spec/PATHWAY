import { DEMO_BLOG_POSTS } from '@/lib/seed-data';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return DEMO_BLOG_POSTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = DEMO_BLOG_POSTS.find(p => p.slug === slug);
  if (!post) return {};
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
  };
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const post = DEMO_BLOG_POSTS.find(p => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="pt-20 bg-charcoal min-h-screen">
      {/* Hero */}
      <section className="relative h-64 md:h-80">
        <Image src={post.coverImage ?? ''} alt={post.title} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 via-charcoal/30 to-charcoal" />
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-padding max-w-3xl mx-auto">
          <FadeIn>
            <Link href="/insights" className="inline-flex items-center gap-2 text-ivory/60 hover:text-ivory text-sm mb-8 transition-colors">
              <ArrowLeft size={14} /> All Insights
            </Link>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs px-3 py-1 bg-gold text-charcoal uppercase tracking-widest font-medium">
                {post.category.name}
              </span>
            </div>
            <h1 className="font-serif text-4xl text-ivory mb-4 leading-snug">{post.title}</h1>
            <div className="flex items-center gap-3 text-text-muted text-sm mb-10 pb-8 border-b border-border">
              <span>{post.author}</span>
              <span className="text-border">·</span>
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-text-muted text-lg leading-relaxed mb-6">{post.excerpt}</p>
            <p className="text-text-muted leading-relaxed">
              {post.content ?? "Full article content will be available once connected to the CMS. This is a demo placeholder — real content from your Supabase database will render here."}
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-16 pt-8 border-t border-border">
              <p className="text-text-muted mb-4 font-serif text-lg">Ready to take the next step?</p>
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
