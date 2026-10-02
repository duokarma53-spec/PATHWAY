"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { login } from "@/app/login/actions";
import { useSearchParams } from "next/navigation";
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, 
  AlertCircle, Loader2, Smartphone
} from "lucide-react";
import { DownloadAppButton } from "./pwa/install-prompt";
import { BrandLogo } from "./ui/brand-logo";

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


  return (
    <div className={cn("w-full max-w-[480px] mx-auto", className)} {...props}>
      {/* ── Main Luxury Crystal Glass Card ──────────────── */}
      <div className="relative rounded-[36px] bg-[#FAF8F5]/93 sm:bg-[#FAF8F5]/95 backdrop-blur-3xl border border-white/90 p-7 sm:p-10 shadow-[0_32px_80px_-16px_rgba(15,12,9,0.5),0_0_0_1px_rgba(255,255,255,0.85),inset_0_1px_3px_rgba(255,255,255,0.9)] overflow-hidden">
        
        {/* Ambient Warm Golden Corner Diffusions */}
        <div 
          className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-gradient-to-br from-[#D4AF37]/25 to-transparent blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute -bottom-24 -left-24 w-56 h-56 rounded-full bg-gradient-to-tr from-[#C99742]/20 to-transparent blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />

        {/* 24k Gold Polish Top Hairline */}
        <div className="absolute top-0 left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent" />

        {/* ── Brand Header with Bespoke Architectural Insignia ── */}
        <div className="text-center mb-7 relative z-10 flex flex-col items-center">
          <div className="relative mb-3.5 group cursor-pointer">
            <BrandLogo size="lg" withGlow />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-br from-[#FBE6B5] to-[#D4AF37] flex items-center justify-center text-[#1C1714] text-[9px] font-bold shadow-sm">
              ✦
            </span>
          </div>

          <h1 className="text-2xl sm:text-[27px] font-bold tracking-tight text-[#1A1410] font-serif">
            Pathway Education
          </h1>

          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="h-[1px] w-6 bg-[#D4AF37]/50" />
            <span className="text-[10px] font-bold tracking-[0.26em] text-[#9E7227] uppercase">
              EXECUTIVE CRM & PORTAL
            </span>
            <span className="h-[1px] w-6 bg-[#D4AF37]/50" />
          </div>

          <p className="text-xs text-[#73665D] mt-2 max-w-[340px] leading-relaxed">
            Internal Operations Portal for Student Dossiers, University Applications & Live Inquiries
          </p>
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
              className="text-[11px] font-bold uppercase tracking-wider text-[#63554B] block"
            >
              Official Staff Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8988B] group-focus-within:text-[#D4AF37] transition-colors" />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@pathway.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/95 border border-[#DDD3C4] text-[#1E1915] text-xs placeholder:text-[#A8988B] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#C99742] transition-all duration-200 shadow-inner-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="password" 
                className="text-[11px] font-bold uppercase tracking-wider text-[#63554B] block"
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
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8988B] group-focus-within:text-[#D4AF37] transition-colors" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-white/95 border border-[#DDD3C4] text-[#1E1915] text-xs placeholder:text-[#A8988B] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#C99742] transition-all duration-200 shadow-inner-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A8988B] hover:text-[#1E1915] transition-colors p-1"
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
              Keep this secure workstation signed in
            </label>
          </div>

          {/* Luxury Obsidian & 24k Gold Trimmed Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#1E1713] via-[#2D231C] to-[#1E1713] hover:from-[#29201A] hover:to-[#382B22] text-white font-medium text-xs tracking-wider uppercase border border-[#D4AF37]/45 shadow-[0_8px_24px_-4px_rgba(212,175,55,0.35)] transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed mt-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#D4AF37]" />
                <span className="text-[#FBE6B5] font-semibold">Verifying Secure Access...</span>
              </>
            ) : (
              <>
                <span className="text-[#FBE6B5] font-semibold tracking-widest">Enter Executive Workspace</span>
                <ArrowRight className="h-4 w-4 text-[#D4AF37] transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* ── App Download Section ─────────────────────── */}
        <div className="mt-6 pt-5 border-t border-[#E8DFC9] flex flex-col items-center gap-2">
          <div className="text-[11px] text-[#7A6E65] text-center">
            Accessing from your phone? Install the native Progressive Web App:
          </div>
          <DownloadAppButton variant="login" />
        </div>

        {/* ── Security Reassurance ──────────────────── */}
        <div className="mt-4 text-center flex items-center justify-center gap-1.5 text-[10px] text-[#8C7F75]">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>256-Bit SSL Encrypted • Authorized Staff & Operations Personnel Only</span>
        </div>
      </div>

      {/* Forgot Password Security Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#FAF8F5] border border-[#DDD3C4] rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
            <h4 className="font-bold text-sm text-[#1E1915] mb-2 flex items-center gap-2 font-serif">
              <Lock className="h-4 w-4 text-[#C99742]" />
              Reset Owner Password
            </h4>
            <p className="text-xs text-[#6B5E54] mb-4 leading-relaxed">
              To reset your password, go to your <strong>Supabase project → Authentication → Users</strong>, find the owner account and use <strong>&ldquo;Send password reset email&rdquo;</strong>. A reset link will be sent to your registered email.
            </p>
            <div className="p-3 rounded-xl bg-white border border-[#E3D9CC] text-xs text-[#52473F] mb-4 space-y-1">
              <div><strong>Owner Email:</strong> owner@pathway.com</div>
              <div><strong>Supabase Dashboard:</strong> supabase.com/dashboard</div>
            </div>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full h-10 rounded-xl bg-[#201A16] text-[#FBE6B5] text-xs font-semibold hover:bg-black transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
