import { LoginForm } from "@/components/login-form";
import { Suspense } from "react";
import { Globe2, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Sign In | Pathway Education CRM",
  description: "Internal Operations Portal for Pathway Education Consultancy.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden bg-[#F7F3EE]">

      {/* ── Ambient liquid mesh background — same system as the admin dashboard ── */}
      <div className="liquid-mesh-bg" aria-hidden="true">
        <div className="liquid-orb-3" />
      </div>

      {/* ── Subtle film grain to add tactile depth ── */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.022]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── Top bar — matching admin panel topbar tone ── */}
      <header className="hidden lg:flex fixed top-0 left-0 right-0 z-10 items-center justify-between px-8 h-12 glass-topbar">
        <div className="flex items-center gap-2 text-[12px] text-[#7D7168]">
          <Globe2 className="h-3.5 w-3.5 text-[#9E8E7E] shrink-0" />
          <span className="font-medium tracking-wide">
            UK · Canada · Australia · USA · Germany · Ireland
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#9E8E7E] font-medium tracking-widest uppercase">
          <ShieldCheck className="h-3.5 w-3.5 text-[#9DB88A] shrink-0" />
          <span>Authorized Access Only</span>
        </div>
      </header>

      {/* ── Centered form ── */}
      <main className="relative z-10 w-full flex items-center justify-center my-auto py-8 lg:pt-16">
        <Suspense
          fallback={
            <div className="w-full max-w-[420px] h-[520px] rounded-2xl glass-card animate-pulse" />
          }
        >
          <LoginForm />
        </Suspense>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 mt-auto pb-5 text-center">
        <p className="text-[11px] text-[#B0A49A] font-medium" suppressHydrationWarning>
          © 2026 Pathway Education Consultancy · All rights reserved
        </p>
      </footer>
    </div>
  );
}
