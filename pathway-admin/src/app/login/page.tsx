import { LoginForm } from "@/components/login-form";
import { Suspense } from "react";
import Image from "next/image";
import { Globe2, Award, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden bg-[#FAF8F5]">
      {/* ── 1. Soothing Real Architectural Photo Background ──────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <Image
          src="/images/united_kingdom.jpg"
          alt="Educational Architecture"
          fill
          priority
          className="object-cover object-center opacity-[0.14] filter blur-[1px] saturate-[0.85] scale-105"
        />
        {/* Warm linen gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/80 via-[#FAF8F5]/60 to-[#F5F2EB]/95" />
      </div>

      {/* ── 2. Ambient Liquid UI Orbs ────────────────────────────────────── */}
      <div className="liquid-mesh-bg pointer-events-none z-[1]" aria-hidden="true">
        <div className="liquid-orb-1" style={{ top: "10%", left: "15%", opacity: 0.6 }} />
        <div className="liquid-orb-2" style={{ bottom: "10%", right: "15%", opacity: 0.5 }} />
      </div>

      {/* ── 3. Tactile Paper Grain Texture ───────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none z-[2] opacity-[0.028]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── 4. Elegant Subtle Floating Badges (Desktop/Tablet) ───────────── */}
      <div className="hidden lg:flex fixed top-8 left-8 z-10 items-center gap-2.5 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-glass-sm">
        <Globe2 className="h-4 w-4 text-liquid-amber" />
        <span className="text-xs font-medium text-espresso-light">
          UK • Canada • Australia • USA • Germany
        </span>
      </div>

      <div className="hidden lg:flex fixed bottom-8 right-8 z-10 items-center gap-2.5 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-glass-sm">
        <Award className="h-4 w-4 text-liquid-amber" />
        <span className="text-xs font-medium text-espresso-light">
          99.2% Visa Success • 450+ Partner Universities
        </span>
      </div>

      {/* ── 5. Centered Luxury Glassmorphic Login ─────────────────────────── */}
      <main className="relative z-10 w-full flex items-center justify-center my-auto">
        <Suspense 
          fallback={
            <div className="w-full max-w-[440px] h-[520px] rounded-[32px] bg-white/70 backdrop-blur-xl border border-white/80 animate-pulse flex items-center justify-center text-xs text-espresso-light">
              Loading workspace...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>

      {/* ── 6. Minimal Clean Footer ──────────────────────────────────────── */}
      <footer className="relative z-10 mt-6 text-center text-[11px] text-espresso-light/60">
        &copy; {new Date().getFullYear()} Pathway Education Consultancy. All rights reserved.
      </footer>
    </div>
  );
}
