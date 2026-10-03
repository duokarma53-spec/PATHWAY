"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { login } from "@/app/login/actions";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { DownloadAppButton } from "./pwa/install-prompt";
import { BrandLogo } from "./ui/brand-logo";

const SESSION_START_KEY = "pathway_session_start";

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
  const formRef     = React.useRef<HTMLFormElement>(null);
  const emailRef    = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={cn("w-full max-w-[440px] mx-auto", className)} {...props}>
      {/* ── Outer glow ring ── */}
      <div className="relative">
        {/* Ambient glow behind card */}
        <div
          aria-hidden="true"
          className="absolute -inset-px rounded-[28px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(192,120,56,0.18) 0%, transparent 70%)",
            filter: "blur(2px)",
          }}
        />

        {/* ── Main card ── */}
        <div
          className="relative rounded-[24px] overflow-hidden"
          style={{
            background: "rgba(255,252,248,0.82)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(208,196,180,0.55)",
            boxShadow:
              "0 2px 2px rgba(80,60,40,0.04), 0 8px 32px rgba(80,60,40,0.10), 0 32px 64px rgba(80,60,40,0.08), inset 0 1px 0 rgba(255,255,255,0.95)",
          }}
        >
          {/* ── Decorative top bar ── */}
          <div
            style={{
              height: "3px",
              background:
                "linear-gradient(90deg, #C07838 0%, #D4956A 40%, #9DB88A 100%)",
            }}
          />

          {/* ── Header ── */}
          <div className="px-9 pt-8 pb-6">
            <div className="flex items-center gap-3 mb-7">
              <BrandLogo size="sm" withGlow />
              <div className="flex flex-col leading-tight">
                <span className="text-[14px] font-bold tracking-[0.10em] text-[#1A1410] uppercase">
                  Pathway
                </span>
                <span className="text-[9px] font-semibold tracking-[0.22em] text-[#C07838] uppercase">
                  Education · CRM
                </span>
              </div>
            </div>

            <h1
              className="text-[26px] font-bold tracking-tight text-[#1A1410] leading-[1.15]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Staff Portal
            </h1>
            <p className="text-[13px] text-[#9E8E7E] mt-1.5 font-medium">
              Authorized personnel only — enter credentials to continue
            </p>
          </div>

          {/* ── Divider ── */}
          <div className="mx-9 h-px bg-gradient-to-r from-transparent via-[#E0D8CE] to-transparent" />

          {/* ── Form body ── */}
          <div className="px-9 py-7 space-y-5">

            {/* Error banner */}
            {errorMessage && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-[12.5px] animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{decodeURIComponent(errorMessage)}</span>
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
              className="space-y-4"
            >
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-[11px] font-bold text-[#6B5E54] block tracking-[0.10em] uppercase"
                >
                  Official Staff Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C0B5AB] group-focus-within:text-[#C07838] transition-colors duration-200" />
                  <input
                    ref={emailRef}
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@pathway.com"
                    className="w-full h-[46px] pl-11 pr-4 rounded-xl text-[13px] text-[#1E1915] placeholder:text-[#C8BDB5] transition-all duration-200 focus:outline-none"
                    style={{
                      background: "rgba(247,243,238,0.70)",
                      border: "1px solid rgba(208,196,180,0.65)",
                      boxShadow: "inset 0 1px 3px rgba(80,60,40,0.05)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.background = "rgba(253,250,246,0.95)";
                      e.currentTarget.style.border = "1px solid rgba(192,120,56,0.50)";
                      e.currentTarget.style.boxShadow =
                        "inset 0 1px 3px rgba(80,60,40,0.04), 0 0 0 3px rgba(192,120,56,0.09)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.background = "rgba(247,243,238,0.70)";
                      e.currentTarget.style.border = "1px solid rgba(208,196,180,0.65)";
                      e.currentTarget.style.boxShadow =
                        "inset 0 1px 3px rgba(80,60,40,0.05)";
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-[11px] font-bold text-[#6B5E54] block tracking-[0.10em] uppercase"
                >
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C0B5AB] group-focus-within:text-[#C07838] transition-colors duration-200" />
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
                    className="w-full h-[46px] pl-11 pr-11 rounded-xl text-[13px] text-[#1E1915] placeholder:text-[#C8BDB5] transition-all duration-200 focus:outline-none"
                    style={{
                      background: "rgba(247,243,238,0.70)",
                      border: "1px solid rgba(208,196,180,0.65)",
                      boxShadow: "inset 0 1px 3px rgba(80,60,40,0.05)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.background = "rgba(253,250,246,0.95)";
                      e.currentTarget.style.border = "1px solid rgba(192,120,56,0.50)";
                      e.currentTarget.style.boxShadow =
                        "inset 0 1px 3px rgba(80,60,40,0.04), 0 0 0 3px rgba(192,120,56,0.09)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.background = "rgba(247,243,238,0.70)";
                      e.currentTarget.style.border = "1px solid rgba(208,196,180,0.65)";
                      e.currentTarget.style.boxShadow =
                        "inset 0 1px 3px rgba(80,60,40,0.05)";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B0A49A] hover:text-[#5C4E42] transition-colors p-1 rounded-md"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2.5 pt-0.5">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-[#D0C8BE] accent-[#C07838] cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-[12px] text-[#7D7168] cursor-pointer select-none font-medium"
                >
                  Keep this secure workstation signed in
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[48px] rounded-xl text-[13.5px] font-semibold tracking-[0.05em] flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.985] disabled:opacity-60 disabled:cursor-not-allowed mt-2 group relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #1A1410 0%, #332B22 55%, #453A2E 100%)",
                  color: "#FDFAF6",
                  boxShadow:
                    "0 2px 8px rgba(26,20,16,0.25), 0 6px 20px rgba(26,20,16,0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(26,20,16,0.30), 0 10px 32px rgba(26,20,16,0.20)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(26,20,16,0.25), 0 6px 20px rgba(26,20,16,0.15)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Shimmer overlay */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)",
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
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-150" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ── Footer ── */}
          <div
            className="px-9 pb-7 pt-1 space-y-3.5"
            style={{
              borderTop: "1px solid rgba(224,216,206,0.6)",
            }}
          >
            <div className="pt-4">
              <p className="text-[11px] text-[#A09286] text-center mb-2.5 font-medium">
                Accessing from your phone? Install the native Progressive Web App:
              </p>
              <DownloadAppButton variant="login" />
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#B0A49A] font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-[#9DB88A]" />
              <span>256-bit SSL Encrypted · Authorized Staff &amp; Operations Personnel Only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
