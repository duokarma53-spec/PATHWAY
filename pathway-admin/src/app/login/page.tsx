import { LoginForm } from "@/components/login-form";
import { Suspense } from "react";
import Image from "next/image";
import { Globe2, Award, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: "Login | Pathway Education CRM",
  description: "Internal Executive Operations and Admissions Portal for Pathway Education Consultancy.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden bg-[#120E0C]">
      {/* ── 1. Heritage Architectural Photography with Rich Midnight Vignette ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <Image
          src="/images/united_kingdom.jpg"
          alt="Oxford & Cambridge Heritage Architecture"
          fill
          priority
          className="object-cover object-center scale-105 filter blur-[1.5px] brightness-[0.7] saturate-[1.15] transition-transform duration-1000"
        />
        {/* Layered luxury espresso, cognac and radial vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#140F0D]/90 via-[#1C1512]/75 to-[#0E0A08]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(212,175,55,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,12,10,0.9)_0%,transparent_75%)]" />
      </div>

      {/* ── 2. Atmospheric Liquid UI Floating Amber & Champagne Light Orbs ── */}
      <div className="pointer-events-none z-[1] absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Top-left golden bloom */}
        <div 
          className="absolute w-[450px] h-[450px] rounded-full"
          style={{ 
            top: "5%", 
            left: "15%", 
            background: "radial-gradient(circle, rgba(220, 180, 80, 0.22) 0%, rgba(180, 130, 45, 0.08) 50%, transparent 75%)",
            filter: "blur(70px)",
            animation: "pulse 8s ease-in-out infinite alternate"
          }} 
        />
        {/* Bottom-right warm amber bloom */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{ 
            bottom: "8%", 
            right: "12%", 
            background: "radial-gradient(circle, rgba(235, 170, 75, 0.2) 0%, rgba(140, 90, 30, 0.06) 55%, transparent 75%)",
            filter: "blur(80px)",
            animation: "pulse 10s ease-in-out infinite alternate"
          }} 
        />
        {/* Subtle center halo behind form */}
        <div 
          className="absolute w-[350px] h-[350px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ 
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
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
      <header className="hidden lg:flex fixed top-8 left-8 right-8 z-10 items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/45 backdrop-blur-xl border border-white/12 text-[#E8DAC8] shadow-2xl pointer-events-auto">
          <Globe2 className="h-4 w-4 text-[#E6B85C]" />
          <span className="text-xs font-medium tracking-wide">
            Global Study Destinations: UK • Canada • Australia • USA • Germany • Ireland
          </span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-xl border border-[#D4AF37]/25 text-[#E8DAC8] shadow-2xl pointer-events-auto">
          <Sparkles className="h-3.5 w-3.5 text-[#E6B85C]" />
          <span className="text-[11px] font-semibold tracking-wider text-[#FBE6B5] uppercase">
            Executive Portal v2.6
          </span>
        </div>
      </header>

      {/* ── 5. Centered Luxury Glassmorphic Form ──────────────────────────── */}
      <main className="relative z-10 w-full flex items-center justify-center my-auto py-8">
        <Suspense 
          fallback={
            <div className="w-full max-w-[480px] h-[600px] rounded-[36px] bg-[#FAF8F5]/90 backdrop-blur-2xl border border-white/80 animate-pulse flex items-center justify-center text-xs text-[#7A6E65]">
              Loading executive workspace...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>

      {/* ── 6. Bottom Editorial Accents & Minimal Footer ─────────────────── */}
      <footer className="relative z-10 mt-auto pb-4 text-center space-y-2 pointer-events-none">
        <div className="hidden sm:flex items-center justify-center gap-6 text-[11px] text-[#A8988B]/90 font-medium">
          <span className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-[#D4AF37]" />
            450+ Direct Partner Universities
          </span>
          <span className="h-1 w-1 rounded-full bg-[#D4AF37]/50" />
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            99.2% Visa Clearance Success
          </span>
        </div>
        <p className="text-[11px] text-[#8C7D70] font-medium" suppressHydrationWarning>
          &copy; 2026 Pathway Education Consultancy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
