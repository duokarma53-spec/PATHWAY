"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("pathway_cookie_consent");
      if (!consent) {
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleConsent = (choice: "accepted" | "declined") => {
    try {
      localStorage.setItem("pathway_cookie_consent", choice);
      localStorage.setItem("pathway_cookie_consent_timestamp", Date.now().toString());
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie consent"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-[320px] w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      <div className="bg-[#1A1512]/95 backdrop-blur-md text-white/90 rounded-xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.28)] border border-white/10 flex flex-col gap-3 font-sans">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs text-white/75 leading-relaxed">
            We use cookies to ensure site security, improve navigation, and deliver seamless consultation services.
          </p>
          <button
            onClick={() => handleConsent("declined")}
            className="text-white/40 hover:text-white transition-colors p-0.5 -mr-1 -mt-0.5"
            aria-label="Close cookie notice"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleConsent("accepted")}
            className="px-3.5 py-1.5 rounded-lg bg-gold text-[#1A1512] text-xs font-semibold hover:bg-gold/90 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => handleConsent("declined")}
            className="px-3 py-1.5 rounded-lg text-white/60 hover:text-white text-xs font-medium transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </aside>
  );
}
