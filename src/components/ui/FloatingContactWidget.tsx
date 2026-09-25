"use client";

/**
 * FloatingContactWidget — CLEAN REBUILD
 *
 * ARCHITECTURE (desktop):
 * ─────────────────────────────────────────────────
 *  <div.widget-root>          fixed, left:0, top:50%, translateY(-50%)
 *    <div.contact-panel>      slides via translateX only
 *    <button.contact-toggle>  position:absolute, left=panelWidth, NEVER moves
 *  </div>
 *
 * OPEN  → panel.translateX(0)      toggle at left=panelWidth (attached to right edge)
 * CLOSED → panel.translateX(-100%) toggle at left=panelWidth (panel gone left, toggle stays)
 *
 * The panel's translateX does NOT affect DOM layout, so the toggle's
 * absolute `left: panelWidth` is always correct regardless of open/closed.
 *
 * NO opacity tricks. NO width tricks. NO overflow-hidden. NO display:none.
 * The panel physically exits the viewport to the left.
 * Fixed elements don't affect document scrollWidth — no overflow.
 * ─────────────────────────────────────────────────
 */

import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import { Phone, Mail, ChevronRight, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Contact details ──────────────────────────────────────────────────── */
const PHONE_RAW     = "917506284722";
const PHONE_DISPLAY = "+91 75062 84722";
const WA_RAW        = "919409161562";
const WA_DISPLAY    = "+91 94091 61562";
const WA_MSG        = encodeURIComponent(
  "Hello Pathway Education Consultancy, I would like to know more about your services."
);
const MAIL = "pathwayeduconsultancy53@gmail.com";

/* ─── Mobile FAB config ────────────────────────────────────────────────── */
const MOBILE_ITEMS = [
  {
    key: "email",
    href: `mailto:${MAIL}`,
    label: "Email us",
    bg: "#0B1F33",
    icon: <Mail size={20} />,
  },
  {
    key: "phone",
    href: `tel:+${PHONE_RAW}`,
    label: "Call us",
    bg: "#dc2626",
    icon: <Phone size={20} />,
  },
  {
    key: "whatsapp",
    href: `https://wa.me/${WA_RAW}?text=${WA_MSG}`,
    label: "WhatsApp",
    bg: "#25D366",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.524 5.847L0 24l6.332-1.499A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.789 9.789 0 01-5.017-1.381l-.36-.214-3.728.882.939-3.625-.235-.372A9.792 9.792 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
      </svg>
    ),
  },
];

/* ─── WhatsApp SVG (inline, used in panel) ─────────────────────────────── */
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" style={{ width: 20, height: 20 }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.524 5.847L0 24l6.332-1.499A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.789 9.789 0 01-5.017-1.381l-.36-.214-3.728.882.939-3.625-.235-.372A9.792 9.792 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export function FloatingContactWidget() {
  /* ── State ─────────────────────────────────────────────────── */
  const [isOpen, setIsOpen]       = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ── Panel width measurement ───────────────────────────────── */
  const panelRef  = useRef<HTMLDivElement>(null);
  const [panelW, setPanelW] = useState(0);

  const measurePanel = useCallback(() => {
    if (panelRef.current) {
      setPanelW(panelRef.current.offsetWidth);
    }
  }, []);

  // useLayoutEffect fires synchronously before paint → no position flash
  useLayoutEffect(() => {
    measurePanel();
    window.addEventListener("resize", measurePanel);
    return () => window.removeEventListener("resize", measurePanel);
  }, [measurePanel]);

  /* ── Render ────────────────────────────────────────────────── */
  return (
    <>
      {/* ════════════════════════════════════════════════════════
          DESKTOP WIDGET
          Only shown on md+ screens.
          ════════════════════════════════════════════════════════ */}
      <div
        /*
          widget-root:
          - fixed to viewport, left:0, vertically centered
          - pointer-events:none so it never blocks page content
          - overflow:visible (default) — panel slides left past viewport edge
        */
        style={{
          position: "fixed",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 9999,
          pointerEvents: "none",
          /* Width is determined by the panel — toggle is absolute so doesn't expand it */
        }}
        className="hidden md:block"
        aria-label="Contact widget"
      >
        {/* ── contact-panel ──────────────────────────────────────
            ONLY THIS ELEMENT MOVES.
            Open  → translateX(0)     — fully on screen
            Closed → translateX(-100%) — fully off-screen to the left

            translateX(-100%) means 100% of THIS element's own width,
            so the panel slides exactly its own width to the left,
            guaranteeing zero pixels remain visible regardless of panel size.
        ─────────────────────────────────────────────────────────── */}
        <motion.div
          ref={panelRef}
          initial={false}
          animate={{ x: isOpen ? "0%" : "-100%" }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          style={{ pointerEvents: "auto" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              padding: "16px 12px",
              background: "rgba(11, 31, 51, 0.96)",
              backdropFilter: "blur(12px)",
              borderRadius: "0 16px 16px 0",
              borderTop: "1px solid rgba(255,255,255,0.10)",
              borderRight: "1px solid rgba(255,255,255,0.10)",
              borderBottom: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "4px 0 24px -4px rgba(11,31,51,0.45)",
            }}
          >
            {/* Phone */}
            <a
              href={`tel:+${PHONE_RAW}`}
              aria-label={`Call us: ${PHONE_DISPLAY}`}
              style={{ display: "flex", alignItems: "center", borderRadius: 999, overflow: "hidden", cursor: "pointer" }}
              className="group"
            >
              <div
                style={{ maxWidth: 0, overflow: "hidden", transition: "max-width 300ms ease-out" }}
                className="group-hover:[max-width:170px]! [&]:group-hover:max-w-[170px]"
              >
                {/* Using inline style for hover via CSS custom property trick */}
              </div>
              {/* Label expands on hover */}
              <span
                style={{
                  display: "block",
                  maxWidth: 0,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "white",
                  paddingLeft: 0,
                  paddingRight: 0,
                  transition: "max-width 300ms ease-out, padding 300ms ease-out",
                }}
                className="group-hover:max-w-[170px] group-hover:pl-4 group-hover:pr-3"
              >
                {PHONE_DISPLAY}
              </span>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(220,38,38,0.4)",
                  transition: "transform 250ms ease",
                }}
                className="group-hover:scale-105"
              >
                <Phone size={18} color="white" strokeWidth={2} />
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WA_RAW}?text=${WA_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp: ${WA_DISPLAY}`}
              style={{ display: "flex", alignItems: "center", borderRadius: 999, overflow: "hidden", cursor: "pointer" }}
              className="group"
            >
              <span
                style={{
                  display: "block",
                  maxWidth: 0,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "white",
                  transition: "max-width 300ms ease-out, padding 300ms ease-out",
                }}
                className="group-hover:max-w-[170px] group-hover:pl-4 group-hover:pr-3"
              >
                {WA_DISPLAY}
              </span>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "#25D366",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(37,211,102,0.4)",
                  transition: "transform 250ms ease",
                }}
                className="group-hover:scale-105"
              >
                <WhatsAppIcon />
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${MAIL}`}
              aria-label={`Email us: ${MAIL}`}
              style={{ display: "flex", alignItems: "center", borderRadius: 999, overflow: "hidden", cursor: "pointer" }}
              className="group"
            >
              <span
                style={{
                  display: "block",
                  maxWidth: 0,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "white",
                  transition: "max-width 300ms ease-out, padding 300ms ease-out",
                }}
                className="group-hover:max-w-[220px] group-hover:pl-4 group-hover:pr-3"
              >
                {MAIL}
              </span>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  transition: "transform 250ms ease",
                }}
                className="group-hover:scale-105"
              >
                <Mail size={18} color="white" strokeWidth={2} />
              </div>
            </a>
          </div>
        </motion.div>

        {/* ── contact-toggle ─────────────────────────────────────
            NEVER MOVES. Position:absolute, left=panelW.
            panelW is measured via useLayoutEffect → no flash.

            Open:  panel is at x=0,     toggle is at left=panelW → attached to panel right edge ✓
            Closed: panel is at x=-100%, toggle is still at left=panelW → floats at viewport left area ✓

            The toggle is the ONLY thing visible when closed.
        ─────────────────────────────────────────────────────────── */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Hide contact widget" : "Show contact widget"}
          style={{
            /* Absolute within widget-root */
            position: "absolute",
            left: panelW,          /* always = measured panel width, never changes */
            top: "50%",
            transform: "translateY(-50%)",

            /* Dimensions */
            width: 28,
            height: 72,

            /* Appearance */
            background: "rgba(11, 31, 51, 0.96)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderLeft: "none",   /* flush against panel */
            borderRadius: "0 10px 10px 0",
            boxShadow: "3px 0 16px -4px rgba(11,31,51,0.5)",

            /* Layout */
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            pointerEvents: "auto",

            /* No transition on position — it never moves */
            color: "white",
          }}
        >
          <motion.span
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <ChevronRight size={14} strokeWidth={3} />
          </motion.span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════
          MOBILE FAB
          Completely separate from desktop widget.
          Fixed bottom-right, expands upward.
          ════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 12,
          pointerEvents: "auto",
        }}
        className="md:hidden"
        aria-label="Mobile contact menu"
      >
        {/* Sub-action buttons */}
        <AnimatePresence>
          {mobileOpen &&
            MOBILE_ITEMS.map((item, i) => (
              <motion.a
                key={item.key}
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                aria-label={item.label}
                initial={{ opacity: 0, scale: 0.5, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 16 }}
                transition={{
                  duration: 0.22,
                  delay: (MOBILE_ITEMS.length - 1 - i) * 0.055,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: item.bg,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                  textDecoration: "none",
                }}
              >
                {item.icon}
              </motion.a>
            ))}
        </AnimatePresence>

        {/* FAB trigger — single icon, rotates 135° to suggest close (no DOM swap) */}
        <motion.button
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Close contact menu" : "Open contact menu"}
          initial={false}
          animate={{ rotate: mobileOpen ? 135 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#0B1F33",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 32px rgba(11,31,51,0.45)",
            border: "none",
            cursor: "pointer",
          }}
        >
          <MessageCircle size={22} />
        </motion.button>
      </div>
    </>
  );
}
