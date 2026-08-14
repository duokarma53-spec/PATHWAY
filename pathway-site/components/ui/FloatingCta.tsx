'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function FloatingCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-8 right-8 z-40 hidden lg:block"
        >
          <Link
            href="/consultation"
            className="group flex items-center gap-2.5 bg-gold text-charcoal text-sm font-medium tracking-wide px-5 py-3 hover:bg-gold-light transition-colors duration-200 shadow-lg shadow-gold/20"
          >
            Start your Pathway
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5 duration-200" />
          </Link>
        </motion.div>
      )}

      {/* Mobile bottom bar */}
      {visible && (
        <motion.div
          key="mobile-cta"
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-charcoal-light border-t border-border"
        >
          <Link
            href="/consultation"
            className="flex items-center justify-center gap-2 w-full py-4 text-gold font-medium text-sm tracking-wide"
          >
            Start your Pathway
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
