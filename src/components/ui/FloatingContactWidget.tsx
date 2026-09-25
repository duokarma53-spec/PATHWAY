"use client";

/**
 * FloatingContactWidget — COMPLETE REWRITE v3
 *
 * Approach: Pure CSS left positioning. No Framer transforms at all.
 * Two states controlled by a single boolean.
 *
 * OPEN:  wrapper left = 0  → panel fully visible, toggle touches panel right edge
 * CLOSED: wrapper left = -(panelWidth)px → panel fully off-screen, toggle at viewport edge
 *
 * The ENTIRE wrapper (panel + toggle) slides as one unit.
 * Since `left` is animated with CSS transition, there is no transform conflict.
 * The toggle is always at the RIGHT edge of the wrapper.
 *
 * When closed, wrapper.left = -panelWidth puts the panel off-screen,
 * and the toggle (which is at wrapper.right = 0 conceptually via flex)
 * peeks out exactly at the viewport left edge.
 *
 * Zero Framer Motion on the positioning. CSS `left` transition only.
 * This cannot glitch because there is only ONE property being animated.
 */

import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import { Phone, Mail, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const PHONE_RAW     = "917506284722";
const PHONE_DISPLAY = "+91 75062 84722";
const WA_RAW        = "919409161562";
const WA_DISPLAY    = "+91 94091 61562";
const WA_MSG        = encodeURIComponent(
  "Hello Pathway Education Consultancy, I would like to know more about your services."
);
const MAIL = "pathwayeduconsultancy53@gmail.com";

function WhatsAppSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="white" width={20} height={20}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.524 5.847L0 24l6.332-1.499A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.789 9.789 0 01-5.017-1.381l-.36-.214-3.728.882.939-3.625-.235-.372A9.792 9.792 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
  );
}



export function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(true);

  const panelRef = useRef<HTMLDivElement>(null);
  const [panelW, setPanelW] = useState(80); // default 80 prevents 0-flash

  const measure = useCallback(() => {
    if (panelRef.current) setPanelW(panelRef.current.offsetWidth);
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  /**
   * CSS left value for the wrapper:
   *   OPEN   → left: 0           (wrapper starts at viewport left edge)
   *   CLOSED → left: -panelW px  (panel fully off-screen, toggle peeks out)
   *
   * The wrapper is a flex row: [PANEL][TOGGLE]
   * Toggle width ≈ 28px.
   * When left = -panelW, only the toggle (28px) is visible at the left edge.
   */
  const wrapperLeft = isOpen ? 0 : -panelW;

  return (
    <>
      {/* ══════════════════════════════════════════════
          DESKTOP — md and above
          ══════════════════════════════════════════════ */}
      <div
        className="hidden md:flex"
        style={{
          /* Fixed to viewport, vertically centred */
          position: "fixed",
          top: "50%",
          left: wrapperLeft,
          transform: "translateY(-50%)",
          zIndex: 9999,

          /* Smooth CSS transition on `left` — single property, no conflicts */
          transition: "left 400ms cubic-bezier(0.22, 1, 0.36, 1)",

          /* Flex row: panel then toggle */
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          pointerEvents: "none", /* children opt-in */
        }}
        aria-label="Floating contact widget"
      >
        {/* ── Panel ─────────────────────────────────── */}
        <div
          ref={panelRef}
          style={{
            pointerEvents: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: "18px 14px",
            background: "rgba(11, 31, 51, 0.97)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: "0 18px 18px 0",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            borderRight: "1px solid rgba(255,255,255,0.12)",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "6px 0 32px -6px rgba(11,31,51,0.5)",
          }}
        >
          {/* Phone */}
          <a
            href={`tel:+${PHONE_RAW}`}
            aria-label={`Call ${PHONE_DISPLAY}`}
            className="group"
            style={{ display: "flex", alignItems: "center", borderRadius: 999, overflow: "hidden", cursor: "pointer", textDecoration: "none" }}
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
                transition: "max-width 280ms ease, padding 280ms ease",
              }}
              className="group-hover:[max-width:160px] group-hover:!max-w-[160px] group-hover:pl-3 group-hover:pr-2"
            >
              {PHONE_DISPLAY}
            </span>
            <div
              style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "#dc2626",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 14px rgba(220,38,38,0.45)",
                transition: "transform 220ms ease, box-shadow 220ms ease",
              }}
              className="group-hover:scale-[1.08] group-hover:shadow-lg"
            >
              <Phone size={18} color="white" strokeWidth={2} />
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${WA_RAW}?text=${WA_MSG}`}
            target="_blank" rel="noopener noreferrer"
            aria-label={`WhatsApp ${WA_DISPLAY}`}
            className="group"
            style={{ display: "flex", alignItems: "center", borderRadius: 999, overflow: "hidden", cursor: "pointer", textDecoration: "none" }}
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
                transition: "max-width 280ms ease, padding 280ms ease",
              }}
              className="group-hover:[max-width:160px] group-hover:!max-w-[160px] group-hover:pl-3 group-hover:pr-2"
            >
              {WA_DISPLAY}
            </span>
            <div
              style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "#25D366",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 14px rgba(37,211,102,0.4)",
                transition: "transform 220ms ease",
              }}
              className="group-hover:scale-[1.08]"
            >
              <WhatsAppSVG />
            </div>
          </a>

          {/* Email */}
          <a
            href={`mailto:${MAIL}`}
            aria-label={`Email ${MAIL}`}
            className="group"
            style={{ display: "flex", alignItems: "center", borderRadius: 999, overflow: "hidden", cursor: "pointer", textDecoration: "none" }}
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
                transition: "max-width 280ms ease, padding 280ms ease",
              }}
              className="group-hover:[max-width:210px] group-hover:!max-w-[210px] group-hover:pl-3 group-hover:pr-2"
            >
              {MAIL}
            </span>
            <div
              style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                transition: "transform 220ms ease",
              }}
              className="group-hover:scale-[1.08]"
            >
              <Mail size={18} color="white" strokeWidth={2} />
            </div>
          </a>
        </div>

        {/* ── Toggle ────────────────────────────────────
            Lives at the flex row's right end.
            When wrapper slides left by panelW, toggle
            sits at exactly left=0 of the viewport.
        ─────────────────────────────────────────────── */}
        <button
          onClick={() => setIsOpen(o => !o)}
          aria-label={isOpen ? "Hide contact panel" : "Show contact panel"}
          style={{
            pointerEvents: "auto",
            width: 28,
            alignSelf: "center",
            height: 80,
            background: "rgba(11, 31, 51, 0.97)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderLeft: "none",
            borderRadius: "0 12px 12px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
            boxShadow: "4px 0 16px -4px rgba(11,31,51,0.5)",
            flexShrink: 0,
            transition: "color 200ms ease, background 200ms ease",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#C8A96B"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "white"; }}
        >
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            initial={false}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <ChevronRight size={14} strokeWidth={3} />
          </motion.span>
        </button>
      </div>


    </>
  );
}
