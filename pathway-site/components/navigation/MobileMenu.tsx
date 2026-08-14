'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';

interface MobileMenuProps {
  onClose: () => void;
}

const menuVariants: Variants = {
  hidden: { opacity: 0, x: '100%' },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, x: '100%', transition: { duration: 0.4, ease: 'easeIn' } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: 0.1 + i * 0.07, ease: 'easeOut' },
  }),
};

export function MobileMenu({ onClose }: MobileMenuProps) {
  return (
    <motion.div
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[100] bg-bg-primary flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-20 border-b border-border">
        <span className="font-serif text-2xl text-text-primary tracking-tight">Pathway</span>
        <button
          onClick={onClose}
          className="p-2 text-text-secondary hover:text-gold transition-colors"
          aria-label="Close menu"
        >
          <X size={22} />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
        {NAV_ITEMS.map((item, i) => (
          <motion.div key={item.label} custom={i} variants={itemVariants} initial="hidden" animate="visible">
            <Link
              href={item.href}
              onClick={onClose}
              className="group flex items-center justify-between py-4 border-b border-border/50 last:border-0"
            >
              <span className="font-serif text-3xl text-text-secondary group-hover:text-text-primary transition-colors duration-200">
                {item.label}
              </span>
              <ArrowRight size={16} className="text-gold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Bottom CTA */}
      <motion.div
        className="px-8 pb-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
      >
        <Link
          href="/consultation"
          onClick={onClose}
          className="flex items-center justify-center w-full py-4 bg-gold text-white font-medium text-sm tracking-wide hover:bg-gold-light transition-colors duration-200"
        >
          Book a Consultation
        </Link>
        <div className="mt-6 flex flex-col gap-1 text-text-muted text-sm">
          <a href="mailto:hello@pathwayconsultancy.in" className="hover:text-gold transition-colors">hello@pathwayconsultancy.in</a>
          <a href="tel:+919876543210" className="hover:text-gold transition-colors">+91 98765 43210</a>
        </div>
      </motion.div>
    </motion.div>
  );
}
