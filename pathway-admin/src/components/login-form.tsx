"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { login } from "@/app/login/actions";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { DownloadAppButton } from "./pwa/install-prompt";
import { BrandLogo } from "./ui/brand-logo";

const SESSION_START_KEY = "pathway_session_start";

/* ─── Inline styles as typed constants ─── */
const INPUT_BASE: React.CSSProperties = {
  background: "rgba(255,250,244,0.06)",
  border: "1px solid rgba(192,140,80,0.18)",
  boxShadow: "inset 0 1px 4px rgba(0,0,0,0.18), inset 0 0 0 0 rgba(192,120,56,0)",
  color: "rgba(255,248,238,0.92)",
  WebkitTextFillColor: "rgba(255,248,238,0.92)",
};
const INPUT_FOCUS: React.CSSProperties = {
  background: "rgba(255,250,244,0.09)",
  border: "1px solid rgba(192,120,56,0.52)",
  boxShadow:
    "inset 0 1px 4px rgba(0,0,0,0.14), 0 0 0 3px rgba(192,120,56,0.13), 0 0 18px rgba(192,120,56,0.06)",
  color: "rgba(255,248,238,0.95)",
  WebkitTextFillColor: "rgba(255,248,238,0.95)",
};

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("message");

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted]           = useState(false);

  const formRef     = React.useRef<HTMLFormElement>(null);
  const emailRef    = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={cn(
        "w-full max-w-[460px] mx-auto transition-all duration-700",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
      {...props}
    >
      {/* ══════════════════════════════════════════════
          OUTER GLOW HALO
      ══════════════════════════════════════════════ */}
      <div className="relative">

        {/* Soft amber halo behind the card */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{
            inset: "-32px",
            borderRadius: "44px",
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(192,120,56,0.22) 0%, rgba(192,120,56,0.06) 45%, transparent 68%)",
            filter: "blur(18px)",
          }}
        />

        {/* Bottom depth shadow */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{
            left: "10%",
            right: "10%",
            bottom: "-28px",
            height: "28px",
            borderRadius: "50%",
            background: "rgba(0,0,0,0.55)",
            filter: "blur(24px)",
          }}
        />

        {/* ══════════════════════════════════════════
            GLASS CARD
        ══════════════════════════════════════════ */}
        <div
          className="relative overflow-hidden rounded-[28px]"
          style={{
            /* Frosted glass surface */
            background:
              "linear-gradient(145deg, rgba(255,252,246,0.11) 0%, rgba(240,230,215,0.07) 50%, rgba(255,248,238,0.09) 100%)",
            backdropFilter: "blur(40px) saturate(160%)",
            WebkitBackdropFilter: "blur(40px) saturate(160%)",
            /* Multi-layer border: top edge highlight + outer ring */
            border: "1px solid rgba(200,160,90,0.22)",
            /* Depth shadow stack */
            boxShadow: [
              "inset 0 1px 0 rgba(255,230,180,0.20)",      /* top specular highlight */
              "inset 0 -1px 0 rgba(80,50,20,0.12)",        /* bottom inner shadow */
              "inset 1px 0 0 rgba(255,220,160,0.08)",      /* left edge glint */
              "0 4px 16px rgba(0,0,0,0.35)",               /* near shadow */
              "0 16px 48px rgba(0,0,0,0.30)",              /* mid shadow */
              "0 48px 96px rgba(0,0,0,0.20)",              /* far ambient */
              "0 0 0 1px rgba(80,50,20,0.18)",             /* hairline outer ring */
            ].join(", "),
          }}
        >

          {/* ── Subtle inner reflection — top arc ── */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              borderRadius: "28px 28px 80% 80% / 28px 28px 40px 40px",
              background:
                "linear-gradient(180deg, rgba(255,235,190,0.08) 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          {/* ── Amber gradient top accent bar ── */}
          <div
            style={{
              height: "2.5px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(192,120,56,0.6) 15%, #D4956A 42%, #C07838 58%, rgba(151,168,122,0.7) 82%, transparent 100%)",
            }}
          />

          {/* ══════════════════════════════════════
              HEADER
          ══════════════════════════════════════ */}
          <div className="px-9 pt-9 pb-7">

            {/* Brand row */}
            <div className="flex items-center gap-3.5 mb-8">
              {/* Logo with glass ring */}
              <div
                className="relative rounded-full shrink-0"
                style={{
                  padding: "2px",
                  background:
                    "linear-gradient(135deg, rgba(220,160,80,0.55), rgba(192,120,56,0.20), rgba(151,168,122,0.30))",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.35), 0 0 0 1px rgba(200,150,70,0.15)",
                }}
              >
                <BrandLogo size="sm" withGlow={false} className="ring-0 border-0 shadow-none" />
              </div>

              <div className="flex flex-col leading-none">
                <span
                  className="font-bold uppercase tracking-[0.12em]"
                  style={{ fontSize: "13px", color: "rgba(255,240,218,0.92)" }}
                >
                  Pathway Education
                </span>
                <span
                  className="font-semibold uppercase tracking-[0.26em]"
                  style={{ fontSize: "8.5px", color: "rgba(192,120,56,0.80)", marginTop: "3px" }}
                >
                  Executive CRM &amp; Portal
                </span>
              </div>
            </div>

            {/* Heading */}
            <h1
              className="font-bold leading-[1.12] tracking-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(24px, 4vw, 30px)",
                color: "rgba(255,248,235,0.96)",
                textShadow: "0 2px 20px rgba(192,120,56,0.15)",
              }}
            >
              Welcome back
            </h1>
            <p
              className="mt-2 font-medium"
              style={{ fontSize: "13px", color: "rgba(180,155,125,0.80)" }}
            >
              Internal Operations Portal for Student Dossiers,<br className="hidden sm:block" /> University Applications &amp; Live Inquiries
            </p>
          </div>

          {/* Divider */}
          <div
            className="mx-9"
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(192,120,56,0.18) 30%, rgba(192,120,56,0.22) 50%, rgba(192,120,56,0.18) 70%, transparent)",
            }}
          />

          {/* ══════════════════════════════════════
              FORM BODY
          ══════════════════════════════════════ */}
          <div className="px-9 py-8 space-y-6">

            {/* Error banner */}
            {errorMessage && (
              <div
                className="flex items-start gap-3 p-4 rounded-2xl text-[12.5px] animate-in fade-in slide-in-from-top-2 duration-300"
                style={{
                  background: "rgba(220,60,60,0.12)",
                  border: "1px solid rgba(220,80,80,0.25)",
                  color: "rgba(255,160,140,0.92)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "rgba(255,120,100,0.85)" }} />
                <span className="font-medium">{decodeURIComponent(errorMessage)}</span>
              </div>
            )}

            {/* Form */}
            <form
              ref={formRef}
              action={login}
              onSubmit={() => {
                setIsSubmitting(true);
                if (typeof window !== "undefined") {
                  localStorage.setItem(SESSION_START_KEY, String(Date.now()));
                }
              }}
              className="space-y-5"
            >

              {/* ── Email field ── */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block font-bold uppercase tracking-[0.12em]"
                  style={{ fontSize: "10.5px", color: "rgba(192,155,100,0.75)" }}
                >
                  Official Staff Email
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-[15px] w-[15px] transition-colors duration-200 pointer-events-none"
                    style={{ color: "rgba(160,120,70,0.60)" }}
                  />
                  <input
                    ref={emailRef}
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@pathway.com"
                    className="w-full h-[48px] pl-11 pr-4 rounded-2xl text-[13px] font-medium placeholder:font-normal transition-all duration-200 focus:outline-none"
                    style={{
                      ...INPUT_BASE,
                      caretColor: "rgba(192,120,56,0.9)",
                    }}
                    onFocus={(e) => Object.assign(e.currentTarget.style, INPUT_FOCUS)}
                    onBlur={(e) => Object.assign(e.currentTarget.style, INPUT_BASE)}
                  />
                  {/* Placeholder colour override (can't be done via style prop) */}
                  <style>{`
                    #email::placeholder { color: rgba(140,110,70,0.38); }
                    #password::placeholder { color: rgba(140,110,70,0.38); }
                    #email:-webkit-autofill,
                    #password:-webkit-autofill {
                      -webkit-box-shadow: 0 0 0 100px rgba(30,20,10,0.95) inset !important;
                      -webkit-text-fill-color: rgba(255,248,238,0.92) !important;
                      caret-color: rgba(192,120,56,0.9);
                    }
                  `}</style>
                </div>
              </div>

              {/* ── Password field ── */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block font-bold uppercase tracking-[0.12em]"
                  style={{ fontSize: "10.5px", color: "rgba(192,155,100,0.75)" }}
                >
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-[15px] w-[15px] transition-colors duration-200 pointer-events-none"
                    style={{ color: "rgba(160,120,70,0.60)" }}
                  />
                  <input
                    ref={passwordRef}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-[48px] pl-11 pr-12 rounded-2xl text-[13px] font-medium transition-all duration-200 focus:outline-none"
                    style={{
                      ...INPUT_BASE,
                      caretColor: "rgba(192,120,56,0.9)",
                    }}
                    onFocus={(e) => Object.assign(e.currentTarget.style, INPUT_FOCUS)}
                    onBlur={(e) => Object.assign(e.currentTarget.style, INPUT_BASE)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-150"
                    style={{ color: "rgba(160,120,70,0.55)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(212,149,106,0.85)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(160,120,70,0.55)")}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword
                      ? <EyeOff className="h-4 w-4" />
                      : <Eye className="h-4 w-4" />
                    }
                  </button>
                </div>
              </div>

              {/* ── Remember me ── */}
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded cursor-pointer appearance-none transition-all duration-150"
                    style={{
                      border: "1px solid rgba(192,120,56,0.30)",
                      background: rememberMe
                        ? "rgba(192,120,56,0.80)"
                        : "rgba(255,250,244,0.06)",
                      boxShadow: rememberMe
                        ? "0 0 8px rgba(192,120,56,0.25)"
                        : "none",
                    }}
                  />
                  {rememberMe && (
                    <svg
                      className="absolute left-0.5 top-0.5 pointer-events-none"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <polyline
                        points="2,6.5 5,9.5 10,3"
                        stroke="rgba(255,248,238,0.95)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <label
                  htmlFor="remember"
                  className="cursor-pointer select-none font-medium"
                  style={{ fontSize: "12px", color: "rgba(180,150,110,0.70)" }}
                >
                  Keep this secure workstation signed in
                </label>
              </div>

              {/* ── Submit CTA ── */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full h-[52px] rounded-2xl overflow-hidden font-semibold tracking-[0.04em] flex items-center justify-center gap-2.5 transition-all duration-250 active:scale-[0.982] disabled:opacity-50 disabled:cursor-not-allowed group mt-1"
                style={{
                  fontSize: "14px",
                  color: "rgba(255,245,225,0.97)",
                  background:
                    "linear-gradient(135deg, #8B5B2A 0%, #C07838 40%, #D4956A 72%, #A8672E 100%)",
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.35), 0 6px 24px rgba(192,120,56,0.28), inset 0 1px 0 rgba(255,220,160,0.30)",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(0,0,0,0.40), 0 10px 36px rgba(192,120,56,0.38), inset 0 1px 0 rgba(255,220,160,0.35)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.35), 0 6px 24px rgba(192,120,56,0.28), inset 0 1px 0 rgba(255,220,160,0.30)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Gloss overlay */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 48%, transparent 49%)",
                  }}
                />
                {/* Hover shimmer sweep */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 35%, rgba(255,220,160,0.18) 50%, transparent 65%)",
                  }}
                />

                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Authenticating…</span>
                  </>
                ) : (
                  <>
                    <span>Enter Executive Workspace</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ══════════════════════════════════════
              FOOTER STRIP
          ══════════════════════════════════════ */}
          <div
            className="px-9 pb-8 pt-1 space-y-4"
            style={{ borderTop: "1px solid rgba(192,120,56,0.10)" }}
          >
            {/* PWA install */}
            <div className="pt-4">
              <p
                className="text-center mb-3 font-medium"
                style={{ fontSize: "11px", color: "rgba(160,130,95,0.60)" }}
              >
                Accessing from your phone? Install the native Progressive Web App:
              </p>
              <DownloadAppButton variant="login" />
            </div>

            {/* SSL badge */}
            <div
              className="flex items-center justify-center gap-1.5 font-medium"
              style={{ fontSize: "10.5px", color: "rgba(140,115,82,0.55)" }}
            >
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" style={{ color: "rgba(151,168,122,0.55)" }} />
              <span>256-bit SSL Encrypted · Authorized Staff &amp; Operations Personnel Only</span>
            </div>
          </div>
        </div>
        {/* end glass card */}
      </div>
    </div>
  );
}
