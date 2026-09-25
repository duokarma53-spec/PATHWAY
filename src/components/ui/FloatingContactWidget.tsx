"use client";

import React, { useState } from "react";
import { Phone, Mail, ChevronRight, ChevronLeft, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PHONE_RAW = "917506284722";
const PHONE_DISPLAY = "+91 75062 84722";
const WA_DISPLAY = "+91 94091 61562";
const WA_RAW = "919409161562";
const WA_MSG = encodeURIComponent(
  "Hello Pathway Education Consultancy, I would like to know more about your services."
);
const MAIL = "pathwayeduconsultancy53@gmail.com";

// Mobile FAB items — shown bottom-to-top when menu is open
const MOBILE_ITEMS = [
  {
    key: "email",
    href: `mailto:${MAIL}`,
    label: "Email us",
    bg: "bg-midnight",
    icon: <Mail size={20} />,
  },
  {
    key: "phone",
    href: `tel:+${PHONE_RAW}`,
    label: "Call us",
    bg: "bg-red-600",
    icon: <Phone size={20} />,
  },
  {
    key: "whatsapp",
    href: `https://wa.me/${WA_RAW}?text=${WA_MSG}`,
    label: "WhatsApp",
    bg: "bg-[#25D366]",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.524 5.847L0 24l6.332-1.499A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.789 9.789 0 01-5.017-1.381l-.36-.214-3.728.882.939-3.625-.235-.372A9.792 9.792 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
      </svg>
    ),
  },
];

export function FloatingContactWidget() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* ── Desktop Side Widget ────────────────────────── */}
      <div
        className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-[90] items-center"
        style={{ pointerEvents: "auto" }}
      >
        {/* Icon panel — slides in/out, hover expands each item */}
        <div
          className={`flex flex-col gap-3 py-4 px-3 bg-navy/95 backdrop-blur-md rounded-r-3xl
            shadow-[20px_0_40px_-15px_rgba(11,31,51,0.5)] border-y border-r border-white/10
            transition-all duration-500 ease-out ${
              collapsed
                ? "opacity-0 -translate-x-full pointer-events-none"
                : "opacity-100 translate-x-0"
            }`}
        >
          {/* Phone */}
          <a
            href={`tel:+${PHONE_RAW}`}
            className="group flex items-center rounded-full overflow-hidden cursor-pointer"
            aria-label="Call us"
          >
            <div className="max-w-0 group-hover:max-w-[170px] overflow-hidden transition-[max-width] duration-300 ease-out">
              <span className="block pl-4 pr-3 text-[13px] font-semibold text-white whitespace-nowrap">
                {PHONE_DISPLAY}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-600/90 border border-red-500/50 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 group-hover:bg-red-600 transition-all duration-300">
              <Phone size={18} className="text-white" strokeWidth={2} />
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${WA_RAW}?text=${WA_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center rounded-full overflow-hidden cursor-pointer"
            aria-label="WhatsApp"
          >
            <div className="max-w-0 group-hover:max-w-[170px] overflow-hidden transition-[max-width] duration-300 ease-out">
              <span className="block pl-4 pr-3 text-[13px] font-semibold text-white whitespace-nowrap">
                {WA_DISPLAY}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#25D366]/90 border border-[#25D366]/50 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 group-hover:bg-[#25D366] transition-all duration-300">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.524 5.847L0 24l6.332-1.499A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.789 9.789 0 01-5.017-1.381l-.36-.214-3.728.882.939-3.625-.235-.372A9.792 9.792 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
              </svg>
            </div>
          </a>

          {/* Email */}
          <a
            href={`mailto:${MAIL}`}
            className="group flex items-center rounded-full overflow-hidden cursor-pointer"
            aria-label="Email us"
          >
            <div className="max-w-0 group-hover:max-w-[200px] overflow-hidden transition-[max-width] duration-300 ease-out">
              <span className="block pl-4 pr-3 text-[11px] font-semibold text-white whitespace-nowrap">
                {MAIL}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-midnight border border-white/10 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 group-hover:bg-midnight/80 transition-all duration-300">
              <Mail size={18} className="text-white" strokeWidth={2} />
            </div>
          </a>
        </div>

        {/* Collapse / expand tab — always visible, sits to the right of the panel */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-6 h-16 bg-navy/95 backdrop-blur-md border-y border-r border-white/10 rounded-r-xl
            flex items-center justify-center text-white hover:text-gold transition-colors duration-300
            shadow-xl shrink-0"
          aria-label={collapsed ? "Show contact widget" : "Hide contact widget"}
        >
          <motion.span
            animate={{ rotate: collapsed ? 0 : 180 }}
            transition={{ duration: 0.3 }}
            className="flex"
          >
            <ChevronRight size={14} strokeWidth={3} />
          </motion.span>
        </button>
      </div>

      {/* ── Mobile FAB ─────────────────────────────────── */}
      <div className="md:hidden fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3 pointer-events-auto">
        {/* Sub-action buttons — AnimatePresence for glitch-free show/hide */}
        <AnimatePresence>
          {mobileMenuOpen &&
            MOBILE_ITEMS.map((item, i) => (
              <motion.a
                key={item.key}
                href={item.href}
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                aria-label={item.label}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                transition={{
                  duration: 0.25,
                  delay: mobileMenuOpen ? (MOBILE_ITEMS.length - 1 - i) * 0.06 : i * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`w-[52px] h-[52px] rounded-full ${item.bg} text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform`}
              >
                {item.icon}
              </motion.a>
            ))}
        </AnimatePresence>

        {/* Main toggle button */}
        <motion.button
          onClick={() => setMobileMenuOpen((o) => !o)}
          className="w-14 h-14 rounded-full bg-navy flex items-center justify-center text-white shadow-xl"
          aria-label={mobileMenuOpen ? "Close contact menu" : "Open contact menu"}
          animate={{ rotate: mobileMenuOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {mobileMenuOpen ? <X size={22} /> : <MessageCircle size={22} />}
        </motion.button>
      </div>
    </>
  );
}
