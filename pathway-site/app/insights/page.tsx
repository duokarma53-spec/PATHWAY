import { DEMO_BLOG_POSTS } from '@/lib/seed-data';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Guides, articles, and expert perspectives on studying abroad, scholarships, visas, and university admissions.',
};

export default function InsightsPage() {
  return (
    <div className="pt-20 bg-charcoal min-h-screen">
      <section className="section-padding border-b border-border">
        <div className="container-padding max-w-5xl mx-auto">
          <FadeIn>
            <div className="flex items-center gap-3 mb-8">
              <div className="gold-rule" />
              <span className="label-text">Insights</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="headline-lg text-ivory">Knowledge to guide every decision.</h1>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-padding max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {DEMO_BLOG_POSTS.map((post, i) => (
              <FadeIn key={post.id} delay={i * 0.06}>
                <Link href={`/insights/${post.slug}`} className="group block bg-charcoal h-full">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.coverImage ?? ''}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
                    <span className="absolute top-3 left-3 text-xs px-2.5 py-1 bg-gold text-charcoal uppercase tracking-widest font-medium">
                      {post.category.name}
                    </span>
                  </div>
                  <div className="p-6">
                    <h2 className="font-serif text-xl text-ivory mb-2 leading-snug group-hover:text-gold/90 transition-colors duration-200">
                      {post.title}
                    </h2>
                    <p className="text-text-muted text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-text-faint text-xs">
                      <span>{post.author}</span>
                      <span>{formatDate(post.publishedAt)}</span>
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
