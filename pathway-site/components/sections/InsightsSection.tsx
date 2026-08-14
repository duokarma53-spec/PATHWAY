'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { DEMO_BLOG_POSTS } from '@/lib/seed-data';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerChildren, staggerItem } from '@/components/animations/StaggerChildren';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';

export function InsightsSection() {
  return (
    <section className="section-padding bg-bg-secondary relative overflow-hidden border-t border-border">
      <div className="container-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <FadeIn>
              <div className="flex items-center gap-3 mb-6">
                <div className="gold-rule" />
                <span className="label-text">Insights</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="headline-lg text-text-primary">
                Knowledge to guide<br />
                <span className="italic text-text-muted">every decision.</span>
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={0.2} className="md:self-end">
            <Link
              href="/insights"
              className="group flex items-center gap-2 text-text-primary text-sm tracking-wide border-b border-border-dark hover:border-text-primary pb-0.5 transition-colors duration-200 font-medium"
            >
              Read all articles
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 duration-200" />
            </Link>
          </FadeIn>
        </div>

        {/* Featured post + 2 secondary */}
        <StaggerChildren className="grid grid-cols-1 lg:grid-cols-12 gap-8" delay={0.1} stagger={0.1}>
          
          {/* Featured — large */}
          <motion.div variants={staggerItem} className="lg:col-span-7 group flex flex-col">
            <Link href={`/insights/${DEMO_BLOG_POSTS[0].slug}`} className="block flex-1 flex flex-col">
              <div className="relative h-[360px] overflow-hidden">
                <Image
                  src={DEMO_BLOG_POSTS[0].coverImage ?? ''}
                  alt={DEMO_BLOG_POSTS[0].title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-charcoal/5" />
                <div className="absolute top-6 left-6">
                  <span className="text-[10px] px-3 py-1.5 bg-bg-primary text-text-primary uppercase tracking-[0.2em] font-semibold shadow-sm">
                    {DEMO_BLOG_POSTS[0].category.name}
                  </span>
                </div>
              </div>
              <div className="pt-8">
                <h3 className="font-serif text-3xl text-text-primary mb-4 leading-snug group-hover:text-gold transition-colors duration-300">
                  {DEMO_BLOG_POSTS[0].title}
                </h3>
                <p className="text-text-secondary text-base leading-relaxed mb-6">{DEMO_BLOG_POSTS[0].excerpt}</p>
                <div className="flex items-center gap-3 text-text-muted text-sm">
                  <span className="font-medium text-text-primary">{DEMO_BLOG_POSTS[0].author}</span>
                  <span className="text-border-dark">·</span>
                  <span>{formatDate(DEMO_BLOG_POSTS[0].publishedAt)}</span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Secondary — 2 stacked */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {DEMO_BLOG_POSTS.slice(1, 3).map((post) => (
              <motion.div key={post.id} variants={staggerItem} className="flex-1 group flex flex-col">
                <Link href={`/insights/${post.slug}`} className="flex flex-col sm:flex-row h-full gap-6">
                  <div className="relative h-48 sm:h-full sm:w-48 shrink-0 overflow-hidden">
                    <Image
                      src={post.coverImage ?? ''}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      sizes="200px"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center py-2">
                    <span className="label-text text-gold mb-3 block">{post.category.name}</span>
                    <h3 className="font-serif text-xl text-text-primary leading-snug mb-3 group-hover:text-gold transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-text-muted text-xs mt-auto">
                      <Clock size={12} />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </StaggerChildren>
      </div>
    </section>
  );
}
