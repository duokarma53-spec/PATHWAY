"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useMagneticHover } from "@/hooks/useMagneticHover";
import { cn } from "@/lib/utils";
import { Menu, X, ArrowUpRight, ArrowRight } from "lucide-react";

// --- Types ---
type NavItem = {
  label: string;
  href: string;
  hasMegaMenu?: "services" | "study-abroad";
};

const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services", hasMegaMenu: "services" },
  { label: "Study Abroad", href: "#study-abroad", hasMegaMenu: "study-abroad" },
  { label: "Admissions", href: "#admissions" },
  { label: "Why Pathway", href: "#why-pathway" },
  { label: "Contact", href: "#contact" },
];

const SERVICES_MENU = [
  "Admission Guidance",
  "Medical Education",
  "Engineering",
  "Career Counselling",
  "Overseas Education",
  "Visa Assistance",
];

const DESTINATIONS = [
  "India",
  "Kyrgyzstan",
  "United Kingdom",
  "Canada",
  "Australia",
  "Europe",
];

// --- Custom Cursor Component ---
function CustomCursor({ active }: { active: boolean }) {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    if (isTouch) return;
    
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[60] flex items-center justify-center rounded-full bg-ivory/80 backdrop-blur-sm border border-gold/20 text-gold shadow-sm"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: active ? 1 : 0,
        opacity: active ? 1 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        mass: 0.5,
      }}
      style={{ width: 32, height: 32 }}
    >
      <ArrowUpRight size={14} strokeWidth={2.5} />
    </motion.div>
  );
}

// --- Desktop Nav Item Component ---
function NavDesktopItem({
  item,
  isActive,
  onMouseEnter,
  onMouseLeave,
  setCursorActive,
}: {
  item: NavItem;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  setCursorActive: (v: boolean) => void;
}) {
  const { ref, position } = useMagneticHover(0.1);

  return (
    <li
      className="relative"
      onMouseEnter={() => {
        onMouseEnter();
        setCursorActive(true);
      }}
      onMouseLeave={() => {
        onMouseLeave();
        setCursorActive(false);
      }}
    >
      <div ref={ref} className="px-2 py-2 cursor-pointer relative z-10">
        <Link href={item.href}>
          <motion.div
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative"
          >
            <motion.span
              className={cn(
                "block text-[14.5px] font-sans tracking-wide transition-colors duration-300",
                isActive ? "text-navy" : "text-midnight/70 hover:text-navy"
              )}
              whileHover={{ y: -2 }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            >
              {item.label}
            </motion.span>
            
            {/* Animated Hover Line */}
            <motion.div
              className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gold origin-center"
              initial={{ scaleX: 0, opacity: 0 }}
              whileHover={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />

            {/* Active Dot Indicator */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, y: 5 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold rounded-full"
                />
              )}
            </AnimatePresence>
          </motion.div>
        </Link>
      </div>
    </li>
  );
}

// --- Mega Menus ---
function ServicesMegaMenu({ isHovered }: { isHovered: boolean }) {
  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.2 } }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-[500px] bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-navy/5 p-8"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {SERVICES_MENU.map((service, i) => (
              <Link href="#services" key={service} className="group flex items-center gap-3">
                <span className="text-[10px] font-sans font-medium tracking-wider text-midnight/30 group-hover:hidden transition-all">
                  0{i + 1}
                </span>
                <motion.span 
                  className="hidden group-hover:block text-gold"
                  initial={{ opacity: 0, x: -5 }}
                  whileInView={{ opacity: 1, x: 0 }}
                >
                  <ArrowRight size={12} strokeWidth={3} />
                </motion.span>
                <span className="font-sans text-sm text-midnight/80 group-hover:text-navy transition-colors">
                  {service}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StudyAbroadMegaMenu({ isHovered }: { isHovered: boolean }) {
  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.2 } }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-full right-0 lg:left-1/2 lg:-translate-x-[20%] mt-6 w-[700px] bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-navy/5 p-2 flex overflow-hidden"
        >
          {/* Left Column - Destinations */}
          <div className="w-5/12 p-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-sage mb-6">
              Explore Destinations
            </h4>
            <div className="flex flex-col gap-4">
              {DESTINATIONS.map((dest) => (
                <Link href="#study-abroad" key={dest} className="group relative w-fit">
                  <span className="font-sans text-[15px] text-midnight/80 group-hover:text-navy transition-colors">
                    {dest}
                  </span>
                  <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column - Editorial Image */}
          <div className="w-7/12 relative rounded-xl overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop" 
              alt="International University Campus"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent flex flex-col justify-end p-8">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-2">
                Your Next Chapter
              </h5>
              <p className="font-serif text-2xl text-white leading-tight">
                Explore international education opportunities.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Main Navbar Component ---
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [hoveredMegaMenu, setHoveredMegaMenu] = useState<string | null>(null);
  const [cursorActive, setCursorActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState<string | null>(null);

  // Scroll Morphing Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      
      // Extremely basic active tab calculation based on scroll
      const sections = NAV_LINKS.map(l => l.href.substring(1)).filter(Boolean);
      let current = "Home";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 200) {
          current = NAV_LINKS.find(l => l.href === `#${section}`)?.label || "Home";
        }
      }
      if (window.scrollY < 100) current = "Home";
      setActiveTab(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  return (
    <>
      <CustomCursor active={cursorActive} />

      {/* --- Desktop Floating Island --- */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        initial={{ y: -100 }}
        animate={{ y: scrolled ? 20 : 32 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          className="pointer-events-auto w-[92%] max-w-[1300px] flex items-center justify-between mx-auto"
          animate={{
            backgroundColor: scrolled ? "rgba(247, 245, 239, 0.85)" : "rgba(247, 245, 239, 0.5)",
            backdropFilter: scrolled ? "blur(24px)" : "blur(12px)",
            paddingTop: scrolled ? "12px" : "16px",
            paddingBottom: scrolled ? "12px" : "16px",
            paddingLeft: scrolled ? "24px" : "32px",
            paddingRight: scrolled ? "24px" : "32px",
            borderRadius: scrolled ? "20px" : "24px",
            boxShadow: scrolled 
              ? "0 10px 30px -10px rgba(11, 31, 51, 0.08)" 
              : "0 4px 20px -10px rgba(11, 31, 51, 0.04)",
            border: "1px solid rgba(11, 31, 51, 0.06)",
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Brand Area */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="flex flex-col">
              <span className="font-serif text-2xl lg:text-[28px] font-bold tracking-tight text-navy leading-none">
                PATHWAY
              </span>
              <span className="text-[8.5px] font-sans text-navy/50 font-semibold tracking-[0.25em] uppercase mt-1">
                Education Consultancy
              </span>
            </div>

          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center" onMouseLeave={() => setHoveredMegaMenu(null)}>
            <ul className="flex items-center gap-1 xl:gap-4 relative">
              {NAV_LINKS.map((link) => (
                <div key={link.label} className="relative">
                  <NavDesktopItem
                    item={link}
                    isActive={activeTab === link.label}
                    onMouseEnter={() => setHoveredMegaMenu(link.hasMegaMenu || null)}
                    onMouseLeave={() => {
                      if (!link.hasMegaMenu) setHoveredMegaMenu(null);
                    }}
                    setCursorActive={setCursorActive}
                  />
                  
                  {link.hasMegaMenu === "services" && (
                    <ServicesMegaMenu isHovered={hoveredMegaMenu === "services"} />
                  )}
                  {link.hasMegaMenu === "study-abroad" && (
                    <StudyAbroadMegaMenu isHovered={hoveredMegaMenu === "study-abroad"} />
                  )}
                </div>
              ))}
            </ul>
          </nav>

          {/* Premium Pill CTA */}
          <div className="hidden lg:block">
            <Link 
              href="#contact" 
              className="group flex items-center justify-center gap-2 bg-navy text-ivory h-[48px] px-7 rounded-full text-[14.5px] font-sans font-medium transition-all duration-300 hover:shadow-lg hover:bg-midnight"
              onMouseEnter={() => setCursorActive(true)}
              onMouseLeave={() => setCursorActive(false)}
            >
              Start Your Journey
              <ArrowUpRight 
                size={16} 
                className="text-gold transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" 
              />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-navy bg-navy/5 rounded-full"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={20} />
          </button>
        </motion.div>
      </motion.header>

      {/* --- Mobile Full-Screen Menu --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-ivory flex flex-col overflow-hidden"
          >
            {/* Mobile Menu Header */}
            <div className="px-6 py-8 flex justify-between items-center border-b border-navy/5">
              <span className="font-serif text-2xl font-bold text-navy">PATHWAY</span>
              <button
                className="w-10 h-10 flex items-center justify-center text-navy bg-navy/5 rounded-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTimeout(() => setMobileSubMenu(null), 500); // Reset submenu after exit
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Menu Content area */}
            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!mobileSubMenu ? (
                  // Main Mobile Links
                  <motion.div
                    key="main-menu"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="h-full flex flex-col justify-start pt-8 px-8 pb-20 overflow-y-auto"
                  >
                    <ul className="flex flex-col gap-6">
                      {NAV_LINKS.map((link, i) => (
                        <motion.li
                          key={link.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: "easeOut" }}
                        >
                          {link.hasMegaMenu === "study-abroad" ? (
                            <button 
                              onClick={() => setMobileSubMenu("study-abroad")}
                              className="text-4xl font-serif text-navy flex items-center justify-between w-full text-left"
                            >
                              <span className="flex items-baseline gap-4">
                                <span className="text-sm font-sans font-medium text-gold">0{i + 1}</span>
                                {link.label}
                              </span>
                              <ArrowRight size={24} className="text-navy/30" />
                            </button>
                          ) : (
                            <Link
                              href={link.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="text-4xl font-serif text-navy flex items-baseline gap-4"
                            >
                              <span className="text-sm font-sans font-medium text-gold">0{i + 1}</span>
                              {link.label}
                            </Link>
                          )}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ) : (
                  // Sub Mobile Menu (Study Abroad)
                  <motion.div
                    key="sub-menu"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                    className="h-full flex flex-col px-8 pt-8 pb-20 overflow-y-auto"
                  >
                    <button 
                      onClick={() => setMobileSubMenu(null)}
                      className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-sage mb-10"
                    >
                      <ArrowRight size={16} className="rotate-180" /> Back
                    </button>
                    
                    <h2 className="text-4xl font-serif text-navy mb-8">Study Abroad</h2>
                    
                    <img 
                      src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop" 
                      alt="Campus"
                      className="w-full h-40 object-cover rounded-xl mb-8"
                    />

                    <div className="flex flex-col gap-6">
                      {DESTINATIONS.map((dest, i) => (
                        <Link
                          key={dest}
                          href="#study-abroad"
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-2xl font-sans text-navy flex items-center justify-between border-b border-navy/5 pb-4"
                        >
                          {dest}
                          <ArrowUpRight size={20} className="text-gold" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Footer Area */}
            <div className="p-6 bg-white border-t border-navy/5 shrink-0 flex flex-col gap-4">
              <Link 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-navy text-ivory h-14 rounded-full text-lg font-sans font-medium w-full"
              >
                Start Your Journey <ArrowUpRight size={20} className="text-gold" />
              </Link>
              <div className="flex justify-between items-center px-4">
                <a href="tel:+917506284722" className="text-navy font-medium font-sans">+91 75062 84722</a>
                <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                <a href="https://wa.me/917506284722" className="text-sage font-medium font-sans uppercase tracking-wider text-xs">WhatsApp</a>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
