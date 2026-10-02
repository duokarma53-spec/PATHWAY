"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Cookie, ChevronRight, X, Sparkles } from "lucide-react";

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user already consented
    const consent = localStorage.getItem("pathway_cookie_consent_choice");
    if (!consent) {
      // Delay showing banner smoothly so the initial hero animations aren't interrupted
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (type: "all" | "essential") => {
    try {
      localStorage.setItem("pathway_cookie_consent_choice", type);
      localStorage.setItem("pathway_cookie_consent_timestamp", Date.now().toString());
    } catch {}
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Preferences"
      className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-500"
    >
      <div className="relative rounded-2xl bg-[#151210]/95 backdrop-blur-xl border border-gold/25 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-ivory">
        {/* Subtle decorative glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
            <Cookie size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-serif font-bold text-white tracking-wide flex items-center gap-2">
                Cookie & Privacy Safeguard
              </h4>
              <button
                onClick={() => handleConsent("essential")}
                className="text-ivory/50 hover:text-white transition-colors p-1"
                aria-label="Dismiss cookie notice with essential cookies only"
              >
                <X size={16} />
              </button>
            </div>
            <p className="mt-1.5 text-xs text-ivory/70 leading-relaxed font-sans">
              We use encrypted session security and essential storage to protect your consultation requests from automated spam and deliver a seamless experience. We never sell or share your data.
            </p>
          </div>
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <div className="mt-4 pt-3.5 border-t border-white/10 space-y-2.5 text-xs font-sans">
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-lg border border-white/5">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Strictly Necessary (Always Active):</span>
                <p className="text-ivory/60 text-[11px] mt-0.5">
                  Anti-spam rate limiting, honeypot validation tokens, and CSRF inquiry protection.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-lg border border-white/5">
              <Sparkles size={16} className="text-gold shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Experience & Preferences:</span>
                <p className="text-ivory/60 text-[11px] mt-0.5">
                  Remembers your consultation form draft across steps and preferred country view.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            onClick={() => handleConsent("all")}
            className="w-full sm:flex-1 h-10 px-4 rounded-xl bg-gold text-[#151210] font-sans font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-gold/90 hover:shadow-[0_4px_20px_rgba(200,169,107,0.4)] hover:-translate-y-0.5"
          >
            Accept All
          </button>
          <button
            onClick={() => handleConsent("essential")}
            className="w-full sm:flex-1 h-10 px-4 rounded-xl border border-white/15 bg-white/5 text-ivory/80 font-sans font-semibold text-xs transition-all hover:bg-white/10 hover:text-white"
          >
            Essential Only
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-ivory/50">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="hover:text-gold transition-colors flex items-center gap-1 underline underline-offset-2"
          >
            {showDetails ? "Hide Details" : "View Cookie Policy Details"}
            <ChevronRight size={12} className={`transition-transform duration-200 ${showDetails ? "rotate-90" : ""}`} />
          </button>
          <span className="text-[10px] text-ivory/40">DPDP & GDPR Compliant</span>
        </div>
      </div>
    </aside>
  );
}
