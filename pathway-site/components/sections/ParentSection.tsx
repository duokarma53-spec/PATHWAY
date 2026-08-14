'use client';

import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerChildren, staggerItem } from '@/components/animations/StaggerChildren';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const PARENT_POINTS = [
  { title: 'Transparent Communication', desc: "We keep you informed at every stage — no surprises, no jargon. You will always know where your child's application stands." },
  { title: 'Realistic University Options', desc: 'Our shortlists are honest. We balance ambition with realism and help your family make informed decisions, not emotional ones.' },
  { title: 'Financial & ROI Clarity', desc: "We walk you through the true cost of education abroad — tuition, living expenses, scholarships, and graduate outcomes — before you commit." },
  { title: 'Safety & Support', desc: "From evaluating campus safety to post-arrival support, we ensure your child is secure and prepared for their new environment." },
];

export function ParentSection() {
  return (
    <section className="section-padding bg-forest relative overflow-hidden text-white">
      <div className="container-padding max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left — emotional */}
          <div>
            <FadeIn>
              <div className="flex items-center gap-3 mb-6">
                <div className="gold-rule" />
                <span className="label-text text-gold">For Parents</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="headline-lg text-white mb-6">
                A decision this important<br />
                <span className="italic text-white/70">deserves absolute clarity.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-white/70 leading-relaxed text-lg mb-8 max-w-md">
                Sending your child abroad is one of the most significant decisions your family will make. We understand the weight of that. Pathway exists to make it a considered, well-supported decision — not a stressful one.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="text-white/70 leading-relaxed max-w-md">
                We work with parents directly — providing the context, clarity, and reassurance you need to feel confident about the path your child is taking.
              </p>
            </FadeIn>
          </div>

          {/* Right — practical points */}
          <div className="bg-charcoal/30 backdrop-blur-md border border-white/10 p-8 md:p-12">
            <StaggerChildren className="space-y-0" delay={0.2} stagger={0.1}>
              {PARENT_POINTS.map((point) => (
                <motion.div
                  key={point.title}
                  variants={staggerItem}
                  className="flex items-start gap-6 py-6 border-b border-white/10 last:border-0 last:pb-0 first:pt-0"
                >
                  <div className="shrink-0 mt-1">
                    <ShieldCheck size={24} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-white mb-2">{point.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{point.desc}</p>
                  </div>
                </motion.div>
              ))}
            </StaggerChildren>
          </div>

        </div>
      </div>
    </section>
  );
}
