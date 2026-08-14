'use client';

import { motion } from 'framer-motion';
import { FadeIn } from '@/components/animations/FadeIn';

export function PathwayStorySection() {
  return (
    <section className="section-padding bg-bg-secondary relative overflow-hidden">
      <div className="container-padding max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          
          {/* Left: Large Typography */}
          <div className="max-w-2xl">
            <FadeIn>
              <div className="flex items-center gap-3 mb-6">
                <div className="gold-rule" />
                <span className="label-text">The Pathway Philosophy</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="headline-lg text-text-primary">
                There is no<br />
                <span className="italic text-text-muted">one-size-fits-all</span><br />
                route to your future.
              </h2>
            </FadeIn>
          </div>

          {/* Right: Explanatory Copy & Visual */}
          <div className="relative">
            <FadeIn delay={0.2}>
              <p className="text-text-secondary text-lg leading-relaxed max-w-md mb-8">
                Every student's academic background, ambitions, budget, interests and career goals are different. Pathway helps create a personalised route—one that is built entirely around you, not a template.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <div className="relative w-full h-[300px] border border-border bg-bg-primary overflow-hidden group">
                <div className="absolute inset-0 bg-charcoal/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                
                {/* Subtle animated path visual */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <motion.path
                    d="M -100 150 C 100 150, 200 50, 400 150 C 600 250, 700 150, 900 150"
                    fill="none"
                    stroke="var(--color-gold)"
                    strokeWidth="1.5"
                    strokeDasharray="4 8"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.5 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                  />
                  <motion.path
                    d="M -100 150 C 100 150, 200 50, 400 150 C 600 250, 700 150, 900 150"
                    fill="none"
                    stroke="var(--color-gold)"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2.5, ease: "easeOut", delay: 0.5 }}
                  />
                </svg>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20">
                  <span className="font-serif italic text-2xl text-text-primary">Your Path</span>
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
