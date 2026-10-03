import { LoginForm } from "@/components/login-form";
import { Suspense } from "react";
import { ShieldCheck } from "lucide-react";
import { WorldMapBackground } from "@/components/world-map-background";
import { GlobalNetworkPill } from "@/components/global-network-pill";

export const metadata = {
  title: "Sign In | Pathway Education CRM",
  description: "Internal Operations Portal for Pathway Education Consultancy.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">

      {/* ══════════════════════════════════════════════
          BACKGROUND — Deep cinematic dark canvas
      ══════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, #1C120A 0%, #0D0906 55%, #060504 100%)",
        }}
      />

      {/* ── Cartographic World Map & Geodesic Flight Paths ── */}
      <WorldMapBackground />

      {/* ── Primary amber corona — top-right ── */}
      <div
        aria-hidden="true"
        className="login-orb login-orb-1 fixed z-0 pointer-events-none"
        style={{
          width: "70vw",
          height: "70vw",
          top: "-25vw",
          right: "-20vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 40%, rgba(220,140,60,0.22) 0%, rgba(192,120,56,0.10) 35%, rgba(180,100,40,0.03) 60%, transparent 75%)",
          filter: "blur(30px)",
        }}
      />

      {/* ── Secondary sage bloom — bottom-left ── */}
      <div
        aria-hidden="true"
        className="login-orb login-orb-2 fixed z-0 pointer-events-none"
        style={{
          width: "55vw",
          height: "55vw",
          bottom: "-18vw",
          left: "-15vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 55% 55%, rgba(130,155,100,0.14) 0%, rgba(100,130,80,0.06) 45%, transparent 68%)",
          filter: "blur(40px)",
        }}
      />

      {/* ── Tertiary warm center bloom ── */}
      <div
        aria-hidden="true"
        className="login-orb login-orb-3 fixed z-0 pointer-events-none"
        style={{
          width: "40vw",
          height: "40vw",
          top: "35%",
          left: "18%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(200,130,60,0.09) 0%, rgba(180,110,40,0.03) 50%, transparent 70%)",
          filter: "blur(55px)",
        }}
      />

      {/* ── Subtle deep indigo shadow accent — bottom-right ── */}
      <div
        aria-hidden="true"
        className="fixed z-0 pointer-events-none"
        style={{
          width: "38vw",
          height: "38vw",
          bottom: "0",
          right: "-5vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(80,55,30,0.20) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── Horizontal light sweep across center ── */}
      <div
        aria-hidden="true"
        className="fixed z-0 pointer-events-none"
        style={{
          position: "fixed",
          top: "42%",
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(192,120,56,0.08) 30%, rgba(212,149,106,0.12) 50%, rgba(192,120,56,0.08) 70%, transparent 100%)",
          filter: "blur(8px)",
          transform: "scaleY(18)",
        }}
      />

      {/* ── Film grain texture ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          opacity: 0.038,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* ══════════════════════════════════════════════
          TOP BAR
      ══════════════════════════════════════════════ */}
      <header
        className="hidden lg:flex fixed top-0 left-0 right-0 z-20 items-center justify-between px-8 xl:px-10 h-[48px]"
        style={{
          background: "rgba(8,6,4,0.68)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(192,120,56,0.14)",
          boxShadow: "0 1px 0 rgba(255,200,100,0.03)",
        }}
      >
        <GlobalNetworkPill />

        <div className="flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.18em] uppercase"
          style={{ color: "rgba(192,120,56,0.75)" }}
        >
          <ShieldCheck className="h-3 w-3 shrink-0" style={{ color: "rgba(151,168,122,0.7)" }} />
          <span>Authorized Access Only</span>
        </div>
      </header>

      {/* ══════════════════════════════════════════════
          MAIN FORM AREA
      ══════════════════════════════════════════════ */}
      <main className="relative z-10 w-full flex items-center justify-center px-4 sm:px-6 py-10 lg:pt-16 min-h-screen">
        <Suspense
          fallback={
            <div
              className="w-full max-w-[460px] h-[560px] rounded-[28px] animate-pulse"
              style={{ background: "rgba(255,248,240,0.04)" }}
            />
          }
        >
          <LoginForm />
        </Suspense>
      </main>

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 pb-4 text-center pointer-events-none">
        <p
          className="text-[10.5px] font-medium"
          style={{ color: "rgba(120,100,80,0.55)" }}
          suppressHydrationWarning
        >
          © 2026 Pathway Education Consultancy · All rights reserved
        </p>
      </footer>

      {/* ══════════════════════════════════════════════
          KEYFRAMES
      ══════════════════════════════════════════════ */}
      <style>{`
        .login-orb { will-change: transform; }

        .login-orb-1 {
          animation: loginOrb1 24s ease-in-out infinite alternate;
        }
        .login-orb-2 {
          animation: loginOrb2 30s ease-in-out infinite alternate-reverse;
        }
        .login-orb-3 {
          animation: loginOrb3 20s ease-in-out infinite alternate;
        }

        @keyframes loginOrb1 {
          0%   { transform: translate(0px, 0px)   scale(1);    }
          25%  { transform: translate(-2vw, 3vh)  scale(1.06); }
          50%  { transform: translate(1vw, -4vh)  scale(0.96); }
          75%  { transform: translate(3vw, 1vh)   scale(1.03); }
          100% { transform: translate(-1vw, 2vh)  scale(1.05); }
        }
        @keyframes loginOrb2 {
          0%   { transform: translate(0px, 0px)   scale(1);    }
          33%  { transform: translate(3vw, -2vh)  scale(1.04); }
          66%  { transform: translate(-2vw, 4vh)  scale(0.97); }
          100% { transform: translate(2vw, -3vh)  scale(1.05); }
        }
        @keyframes loginOrb3 {
          0%   { transform: translate(0px, 0px)   scale(1);    }
          40%  { transform: translate(2vw, -3vh)  scale(1.08); }
          100% { transform: translate(-3vw, 2vh)  scale(0.93); }
        }

        @keyframes loginCardIn {
          0%   { opacity: 0; transform: translateY(24px) scale(0.978); }
          100% { opacity: 1; transform: translateY(0)    scale(1);     }
        }
        .login-card-enter {
          animation: loginCardIn 0.65s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes inputGlowPulse {
          0%, 100% { box-shadow: inset 0 1px 3px rgba(80,60,40,0.04), 0 0 0 3px rgba(192,120,56,0.10); }
          50%       { box-shadow: inset 0 1px 3px rgba(80,60,40,0.04), 0 0 0 3px rgba(192,120,56,0.16); }
        }
      `}</style>
    </div>
  );
}
