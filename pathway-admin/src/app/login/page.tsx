import { LoginForm } from "@/components/login-form";
import { Suspense } from "react";
import Image from "next/image";
import { Globe2, Award } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden bg-[#181412]">
      {/* ── 1. Rich Atmospheric Architectural Photography ──────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <Image
          src="/images/united_kingdom.jpg"
          alt="Educational Architecture & University Heritage"
          fill
          priority
          className="object-cover object-center scale-105 filter blur-[2px] saturate-[1.1] transition-transform duration-1000"
        />
        {/* Deep luxury cognac & espresso gradient overlay with warm vignette */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[#1C1714]/85 via-[#221B17]/70 to-[#120E0C]/90" 
        />
        <div 
          className="absolute inset-0 bg-radial from-transparent via-[#14100D]/40 to-[#0F0C0A]/80" 
        />
      </div>

      {/* ── 2. Glowing Liquid UI Amber & Champagne Orbs ─────────────────── */}
      <div className="liquid-mesh-bg pointer-events-none z-[1]" aria-hidden="true">
        <div 
          className="liquid-orb-1" 
          style={{ 
            top: "15%", 
            left: "20%", 
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.45) 0%, rgba(201, 151, 66, 0.2) 60%, transparent 80%)",
            filter: "blur(60px)",
            transform: "scale(1.2)"
          }} 
        />
        <div 
          className="liquid-orb-2" 
          style={{ 
            bottom: "12%", 
            right: "18%", 
            background: "radial-gradient(circle, rgba(230, 169, 88, 0.4) 0%, rgba(166, 124, 46, 0.2) 60%, transparent 80%)",
            filter: "blur(70px)",
            transform: "scale(1.3)"
          }} 
        />
      </div>

      {/* ── 3. Tactile Film Grain Overlay ───────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none z-[2] opacity-[0.035]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── 4. Floating Luxury Editorial Accents (Desktop/Tablet) ──────── */}
      <div className="hidden lg:flex fixed top-8 left-8 z-10 items-center gap-2.5 px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 text-[#E6D7C3] shadow-2xl">
        <Globe2 className="h-4 w-4 text-[#D4AF37]" />
        <span className="text-xs font-medium tracking-wide">
          UK • Canada • Australia • USA • Germany • Ireland
        </span>
      </div>

      <div className="hidden lg:flex fixed bottom-8 right-8 z-10 items-center gap-2.5 px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 text-[#E6D7C3] shadow-2xl">
        <Award className="h-4 w-4 text-[#D4AF37]" />
        <span className="text-xs font-medium tracking-wide">
          450+ Partner Universities • 99.2% Visa Success Rate
        </span>
      </div>

      {/* ── 5. Centered Luxury Glassmorphic Form ──────────────────────────── */}
      <main className="relative z-10 w-full flex items-center justify-center my-auto py-6">
        <Suspense 
          fallback={
            <div className="w-full max-w-[460px] h-[580px] rounded-[36px] bg-[#FAF8F5]/90 backdrop-blur-2xl border border-white/80 animate-pulse flex items-center justify-center text-xs text-[#7A6E65]">
              Loading executive workspace...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>

      {/* ── 6. Minimal Luxury Footer ─────────────────────────────────────── */}
      <footer className="relative z-10 mt-2 text-center text-[11px] text-[#A8988B]/80 font-medium">
        &copy; {new Date().getFullYear()} Pathway Education Consultancy. All rights reserved.
      </footer>
    </div>
  );
}
