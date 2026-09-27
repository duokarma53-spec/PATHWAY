"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { login } from "@/app/login/actions";
import { useSearchParams } from "next/navigation";
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, 
  Sparkles, CheckCircle2, AlertCircle, Loader2, KeyRound, Smartphone
} from "lucide-react";
import { DownloadAppButton } from "./pwa/install-prompt";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("message");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const fillDemo = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("pathway2025");
  };

  return (
    <div className={cn("w-full max-w-[460px] mx-auto", className)} {...props}>
      {/* ── Main Luxury Crystal Glass Card ──────────────── */}
      <div className="relative rounded-[36px] bg-[#FAF8F5]/94 backdrop-blur-3xl border border-white/90 p-8 sm:p-11 shadow-[0_32px_80px_-16px_rgba(20,16,12,0.45),0_0_0_1px_rgba(255,255,255,0.8),inset_0_1px_2px_rgba(255,255,255,0.9)] overflow-hidden">
        
        {/* Ambient Warm Golden Corner Accents */}
        <div 
          className="absolute -top-24 -right-24 w-52 h-52 rounded-full bg-gradient-to-br from-[#D4AF37]/25 to-transparent blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute -bottom-24 -left-24 w-52 h-52 rounded-full bg-gradient-to-tr from-[#C99742]/20 to-transparent blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />

        {/* Fine gold top hairline */}
        <div className="absolute top-0 left-12 right-12 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />

        {/* ── Brand Header ──────────────────────────── */}
        <div className="text-center mb-8 relative z-10">
          {/* Gold Sculpted Medallion */}
          <div className="relative inline-block mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#FBE6B5] via-[#D4AF37] to-[#8F5C1B] p-[1.5px] shadow-[0_8px_24px_rgba(212,175,55,0.35)] transform hover:scale-105 transition-transform duration-300">
              <div className="h-full w-full rounded-[14.5px] bg-gradient-to-b from-[#2E251E] to-[#171310] flex items-center justify-center text-white border border-[#D4AF37]/30">
                <span className="font-serif font-bold text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2D6] via-[#F3D59B] to-[#C99742]">
                  P
                </span>
              </div>
            </div>
            {/* Sparkle badge */}
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#1C1714] text-[9px] font-bold shadow-xs">
              ✦
            </span>
          </div>

          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#1E1915] font-serif">
            Pathway Education
          </h1>

          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="h-[1px] w-6 bg-[#D4AF37]/50" />
            <span className="text-[10px] font-bold tracking-[0.28em] text-[#A67C2E] uppercase">
              CONSULTANCY CRM & PORTAL
            </span>
            <span className="h-[1px] w-6 bg-[#D4AF37]/50" />
          </div>

          <p className="text-xs text-[#7A6E65] mt-2">
            Sign in to access student dossiers, admissions & pipelines
          </p>
        </div>

        {/* ── VIP Quick Access Badges ─────────────────── */}
        <div className="mb-6 p-3 rounded-2xl bg-white/70 border border-[#E8DFC9] shadow-xs">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[10.5px] font-bold text-[#8C6B28] uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="h-3 w-3 text-[#D4AF37]" />
              Quick Demo Access
            </span>
            <span className="text-[10px] text-[#9C8F84]">Click to auto-fill</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => fillDemo("admin@pathway.com")}
              className={cn(
                "py-2 px-2 rounded-xl text-[11px] font-medium transition-all text-center truncate border",
                email === "admin@pathway.com"
                  ? "bg-[#251E19] text-[#FBE6B5] border-[#D4AF37] shadow-sm font-semibold"
                  : "bg-white/80 hover:bg-white text-[#3D342D] border-[#E3D9CC] hover:border-[#D4AF37]/60"
              )}
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo("counsellor@pathway.com")}
              className={cn(
                "py-2 px-2 rounded-xl text-[11px] font-medium transition-all text-center truncate border",
                email === "counsellor@pathway.com"
                  ? "bg-[#251E19] text-[#FBE6B5] border-[#D4AF37] shadow-sm font-semibold"
                  : "bg-white/80 hover:bg-white text-[#3D342D] border-[#E3D9CC] hover:border-[#D4AF37]/60"
              )}
            >
              🎓 Counsellor
            </button>
            <button
              type="button"
              onClick={() => fillDemo("frontdesk@pathway.com")}
              className={cn(
                "py-2 px-2 rounded-xl text-[11px] font-medium transition-all text-center truncate border",
                email === "frontdesk@pathway.com"
                  ? "bg-[#251E19] text-[#FBE6B5] border-[#D4AF37] shadow-sm font-semibold"
                  : "bg-white/80 hover:bg-white text-[#3D342D] border-[#E3D9CC] hover:border-[#D4AF37]/60"
              )}
            >
              📋 Reception
            </button>
          </div>
        </div>

        {/* ── Error Banner ──────────────────────────── */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span className="font-medium">{decodeURIComponent(errorMessage)}</span>
          </div>
        )}

        {/* ── Form ──────────────────────────────────── */}
        <form 
          action={login} 
          onSubmit={() => setIsSubmitting(true)}
          className="space-y-4 relative z-10"
        >
          {/* Email */}
          <div className="space-y-1.5">
            <label 
              htmlFor="email" 
              className="text-[11px] font-bold uppercase tracking-wider text-[#6B5E54] block"
            >
              Staff Official Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8988B]" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@pathway.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/90 border border-[#DDD3C4] text-[#1E1915] text-xs placeholder:text-[#A8988B] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#C99742] transition-all duration-200 shadow-inner-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="password" 
                className="text-[11px] font-bold uppercase tracking-wider text-[#6B5E54] block"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-[#A67C2E] hover:text-[#805C1C] font-semibold transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8988B]" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-white/90 border border-[#DDD3C4] text-[#1E1915] text-xs placeholder:text-[#A8988B] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#C99742] transition-all duration-200 shadow-inner-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A8988B] hover:text-[#1E1915] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 pt-1">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-[#C99742] text-[#A67C2E] focus:ring-[#D4AF37]/40 accent-[#A67C2E] cursor-pointer"
            />
            <label htmlFor="remember" className="text-xs text-[#6B5E54] cursor-pointer select-none">
              Keep this workstation signed in
            </label>
          </div>

          {/* Luxury Obsidian + Gold Trim Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#201A16] via-[#2F2620] to-[#201A16] hover:from-[#2B231E] hover:to-[#382C24] text-white font-medium text-xs tracking-wider uppercase border border-[#D4AF37]/40 shadow-[0_8px_20px_-4px_rgba(212,175,55,0.3)] transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed mt-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#D4AF37]" />
                <span className="text-[#FBE6B5]">Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span className="text-[#FBE6B5]">Enter Workspace</span>
                <ArrowRight className="h-4 w-4 text-[#D4AF37] transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* ── App Download Pill ─────────────────────── */}
        <div className="mt-7 pt-5 border-t border-[#E8DFC9] flex flex-col items-center gap-2">
          <div className="text-[11px] text-[#7A6E65] text-center">
            Accessing from your smartphone?
          </div>
          <DownloadAppButton variant="login" />
        </div>

        {/* ── Bank-Grade Footnote ──────────────────── */}
        <div className="mt-4 text-center flex items-center justify-center gap-1.5 text-[10px] text-[#8C7F75]">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>256-Bit SSL Encrypted • Internal Personnel Only</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#FAF8F5] border border-[#DDD3C4] rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
            <h4 className="font-bold text-sm text-[#1E1915] mb-2 flex items-center gap-2 font-serif">
              <Lock className="h-4 w-4 text-[#C99742]" />
              Staff Account Security
            </h4>
            <p className="text-xs text-[#6B5E54] mb-4 leading-relaxed">
              Staff accounts are provisioned and managed by Pathway System Administrators. Please contact Hatim Patel or your supervisor to reset your workspace access.
            </p>
            <div className="p-3 rounded-xl bg-white border border-[#E3D9CC] text-xs text-[#52473F] mb-4 space-y-1">
              <div><strong>Admin Support:</strong> support@pathway.com</div>
              <div><strong>Internal Helpline:</strong> +91 98765 43210</div>
            </div>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full h-10 rounded-xl bg-[#201A16] text-[#FBE6B5] text-xs font-semibold hover:bg-black transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
