'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { DEMO_FAQS } from '@/lib/seed-data';
import { FadeIn } from '@/components/animations/FadeIn';
import { cn } from '@/lib/utils';

export function FaqSection() {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (id: string) => setOpen(prev => prev === id ? null : id);

  return (
    <section className="section-padding bg-bg-primary relative overflow-hidden">
      <div className="container-padding max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="gold-rule" />
              <span className="label-text">FAQ</span>
              <div className="gold-rule" />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="headline-lg text-text-primary">
              Honest answers to<br />
              <span className="italic text-text-muted">honest questions.</span>
            </h2>
          </FadeIn>
        </div>

        {/* Accordion */}
        <FadeIn delay={0.2}>
          <div className="space-y-0 border-t border-border">
            {DEMO_FAQS.map((faq) => (
              <div
                key={faq.id}
                className="border-b border-border group"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between gap-6 py-8 text-left"
                  aria-expanded={open === faq.id}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <h3
                    className={cn(
                      'font-serif text-xl md:text-2xl leading-snug transition-colors duration-300',
                      open === faq.id ? 'text-gold' : 'text-text-primary group-hover:text-gold'
                    )}
                  >
                    {faq.question}
                  </h3>
                  <div
                    className={cn(
                      'shrink-0 w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300',
                      open === faq.id
                        ? 'border-gold bg-gold/10'
                        : 'border-border group-hover:border-gold'
                    )}
                  >
                    {open === faq.id
                      ? <Minus size={16} className="text-gold" />
                      : <Plus size={16} className="text-text-secondary group-hover:text-gold" />
                    }
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {open === faq.id && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-text-secondary text-base leading-relaxed pb-8 max-w-2xl">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
