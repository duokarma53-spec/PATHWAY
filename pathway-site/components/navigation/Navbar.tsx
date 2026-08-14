'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ArrowRight } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'sticky top-0 left-0 right-0 z-50 transition-all duration-500 bg-bg-primary/95 backdrop-blur-md border-b border-border/50 shadow-subtle'
        )}
      >
        <div className="container-padding max-w-[1440px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 items-center h-18 md:h-20 transition-all duration-500">
            {/* Logo */}
            <div className="flex justify-start">
            <Link href="/" className="group flex items-center gap-2" aria-label="Pathway home">
              <div className="relative">
                <span
                  className={cn(
                    'font-serif text-2xl tracking-tight transition-colors duration-300',
                    'text-text-primary'
                  )}
                >
                  Pathway
                </span>
                <motion.div
                  className="absolute -bottom-0.5 left-0 h-px bg-gold"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center justify-center gap-8" role="navigation" aria-label="Main navigation">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'relative text-sm font-sans tracking-wide transition-colors duration-200 py-1 group',
                    pathname === item.href ? 'text-gold' : 'text-text-secondary hover:text-text-primary'
                  )}
                >
                  {item.label}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[2px] bg-gold"
                    initial={false}
                    animate={{ scaleX: pathname === item.href ? 1 : 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.25 }}
                    style={{ transformOrigin: 'left' }}
                  />
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex justify-end">
              <Link
                href="/consultation"
                className="group flex items-center gap-2 bg-charcoal text-white px-6 py-2.5 font-sans text-xs font-bold tracking-widest uppercase hover:bg-gold hover:text-charcoal transition-colors duration-300 rounded-sm select-none"
              >
                Book a Consultation
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex justify-end lg:hidden">
              <button
                onClick={() => setMobileOpen(true)}
              className={cn(
                "lg:hidden p-2 transition-colors",
                "text-text-primary hover:text-gold"
              )}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
