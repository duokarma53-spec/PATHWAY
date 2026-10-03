import { LoginForm } from "@/components/login-form";
import { Suspense } from "react";
import { Globe2, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Sign In | Pathway Education CRM",
  description: "Internal Operations Portal for Pathway Education Consultancy.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">

      {/* ── Rich layered background ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(160deg, #2B1F14 0%, #1A1208 35%, #0F0C07 65%, #1C1409 100%)",
        }}
      />

      {/* ── Warm amber orb — top right ── */}
      <div
        aria-hidden="true"
        className="fixed z-0 pointer-events-none"
        style={{
          width: "60vw",
          height: "60vw",
          top: "-20%",
          right: "-15%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(192,120,56,0.22) 0%, rgba(192,120,56,0.08) 45%, transparent 70%)",
          filter: "blur(40px)",
          animation: "loginOrb1 22s ease-in-out infinite alternate",
        }}
      />

      {/* ── Sage orb — bottom left ── */}
      <div
        aria-hidden="true"
        className="fixed z-0 pointer-events-none"
        style={{
          width: "45vw",
          height: "45vw",
          bottom: "-12%",
          left: "-10%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(151,168,122,0.16) 0%, rgba(151,168,122,0.05) 50%, transparent 72%)",
          filter: "blur(50px)",
          animation: "loginOrb2 28s ease-in-out infinite alternate-reverse",
        }}
      />

      {/* ── Deep warm center orb — subtle ── */}
      <div
        aria-hidden="true"
        className="fixed z-0 pointer-events-none"
        style={{
          width: "35vw",
          height: "35vw",
          top: "30%",
          left: "25%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212,149,106,0.10) 0%, transparent 65%)",
          filter: "blur(60px)",
          animation: "loginOrb3 18s ease-in-out infinite alternate",
        }}
      />

      {/* ── Fine noise texture overlay ── */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.032]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── Top bar ── */}
      <header
        className="hidden lg:flex fixed top-0 left-0 right-0 z-10 items-center justify-between px-8 h-12"
        style={{
          background: "rgba(15,12,7,0.65)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(192,120,56,0.18)",
        }}
      >
        <div className="flex items-center gap-2 text-[12px] text-[#8C7E72]">
          <Globe2 className="h-3.5 w-3.5 text-[#7A6E64] shrink-0" />
          <span className="font-medium tracking-wide">
            UK · Canada · Australia · USA · Germany · Ireland
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#C07838] font-semibold tracking-widest uppercase">
          <ShieldCheck className="h-3.5 w-3.5 text-[#9DB88A] shrink-0" />
          <span>Authorized Access Only</span>
        </div>
      </header>

      {/* ── Centered form ── */}
      <main className="relative z-10 w-full flex items-center justify-center my-auto py-8 lg:pt-16">
        <Suspense
          fallback={
            <div className="w-full max-w-[440px] h-[520px] rounded-[24px] animate-pulse"
              style={{ background: "rgba(255,252,248,0.08)" }}
            />
          }
        >
          <LoginForm />
        </Suspense>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 mt-auto pb-5 text-center">
        <p className="text-[11px] text-[#5C5048] font-medium" suppressHydrationWarning>
          © 2026 Pathway Education Consultancy · All rights reserved
        </p>
      </footer>

      {/* ── Keyframe animations ── */}
      <style>{`
        @keyframes loginOrb1 {
          0%   { transform: translate(0, 0)     scale(1);    }
          33%  { transform: translate(-3%, 5%)  scale(1.07); }
          66%  { transform: translate(4%, -3%)  scale(0.95); }
          100% { transform: translate(-2%, 4%)  scale(1.04); }
        }
        @keyframes loginOrb2 {
          0%   { transform: translate(0, 0)     scale(1);    }
          33%  { transform: translate(5%, -4%)  scale(1.05); }
          66%  { transform: translate(-3%, 6%)  scale(0.97); }
          100% { transform: translate(4%, -2%)  scale(1.06); }
        }
        @keyframes loginOrb3 {
          0%   { transform: translate(0, 0)     scale(1);    }
          50%  { transform: translate(3%, -5%)  scale(1.08); }
          100% { transform: translate(-4%, 3%)  scale(0.94); }
        }
      `}</style>
    </div>
  );
}
