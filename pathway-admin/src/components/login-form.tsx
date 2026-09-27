"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { login } from "@/app/login/actions";
import { useSearchParams } from "next/navigation";
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, 
  Sparkles, CheckCircle2, AlertCircle, Loader2 
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
    <div className={cn("w-full max-w-[440px] mx-auto", className)} {...props}>
      {/* ── Main Glass Card ──────────────────────────── */}
      <div className="relative rounded-[32px] bg-white/80 backdrop-blur-2xl border border-white/80 p-8 sm:p-10 shadow-[0_24px_64px_-16px_rgba(45,40,36,0.12),0_1px_2px_rgba(45,40,36,0.04)] overflow-hidden">
        {/* Subtle decorative inner corner glow */}
        <div 
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-liquid-amber/20 to-transparent blur-2xl pointer-events-none" 
          aria-hidden="true" 
        />

        {/* ── Brand Header ──────────────────────────── */}
        <div className="text-center mb-7 relative z-10">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-[#D9A05B] via-[#C68D48] to-[#9E6B2D] text-white font-serif font-bold text-2xl shadow-warm border border-white/40 mb-3.5 transform hover:scale-105 transition-transform duration-300">
            P
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">
            Pathway
          </h1>
          <p className="text-[10px] font-bold tracking-[0.24em] text-liquid-amber uppercase mt-0.5">
            Consultancy Management CRM
          </p>
          <p className="text-xs text-espresso-light mt-2">
            Sign in to access student pipelines & applications
          </p>
        </div>

        {/* ── Quick Demo Login Switcher ─────────────────── */}
        <div className="mb-6 p-3 rounded-2xl bg-linen/50 border border-linen-dark/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10.5px] font-semibold text-espresso-light uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-liquid-amber" />
              Quick Demo Access
            </span>
            <span className="text-[9.5px] text-espresso-light/60">One-click fill</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => fillDemo("admin@pathway.com")}
              className={cn(
                "py-1.5 px-2 rounded-xl text-[11px] font-medium border transition-all text-center truncate",
                email === "admin@pathway.com"
                  ? "bg-espresso text-white border-espresso shadow-xs"
                  : "bg-surface/80 hover:bg-white text-foreground border-linen-dark/60 hover:border-liquid-amber/50"
              )}
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo("counsellor@pathway.com")}
              className={cn(
                "py-1.5 px-2 rounded-xl text-[11px] font-medium border transition-all text-center truncate",
                email === "counsellor@pathway.com"
                  ? "bg-espresso text-white border-espresso shadow-xs"
                  : "bg-surface/80 hover:bg-white text-foreground border-linen-dark/60 hover:border-liquid-amber/50"
              )}
            >
              🎓 Counsellor
            </button>
            <button
              type="button"
              onClick={() => fillDemo("frontdesk@pathway.com")}
              className={cn(
                "py-1.5 px-2 rounded-xl text-[11px] font-medium border transition-all text-center truncate",
                email === "frontdesk@pathway.com"
                  ? "bg-espresso text-white border-espresso shadow-xs"
                  : "bg-surface/80 hover:bg-white text-foreground border-linen-dark/60 hover:border-liquid-amber/50"
              )}
            >
              📋 Reception
            </button>
          </div>
        </div>

        {/* ── Error Banner ──────────────────────────── */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">{decodeURIComponent(errorMessage)}</span>
          </div>
        )}

        {/* ── Form ──────────────────────────────────── */}
        <form 
          action={login} 
          onSubmit={() => setIsSubmitting(true)}
          className="space-y-4"
        >
          {/* Email */}
          <div className="space-y-1.5">
            <label 
              htmlFor="email" 
              className="text-[11.5px] font-semibold uppercase tracking-wider text-espresso-light block"
            >
              Staff Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-espresso-light/60" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@pathway.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface/70 border border-linen-dark/70 text-foreground text-xs placeholder:text-espresso-light/40 focus:outline-none focus:ring-2 focus:ring-liquid-amber/40 focus:border-liquid-amber transition-all duration-200"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="password" 
                className="text-[11.5px] font-semibold uppercase tracking-wider text-espresso-light block"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-liquid-amber hover:text-amber-800 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-espresso-light/60" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-surface/70 border border-linen-dark/70 text-foreground text-xs placeholder:text-espresso-light/40 focus:outline-none focus:ring-2 focus:ring-liquid-amber/40 focus:border-liquid-amber transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-espresso-light/60 hover:text-foreground transition-colors"
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
              className="h-4 w-4 rounded border-linen-dark text-liquid-amber focus:ring-liquid-amber/40 accent-liquid-amber cursor-pointer"
            />
            <label htmlFor="remember" className="text-xs text-espresso-light cursor-pointer select-none">
              Keep me signed in on this device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-2xl bg-espresso hover:bg-[#1A1614] text-white font-medium text-xs tracking-wide shadow-warm transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-liquid-amber" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Workspace</span>
                <ArrowRight className="h-4 w-4 text-liquid-amber transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* ── App Download Prompt in Login ──────────────── */}
        <div className="mt-6 pt-5 border-t border-linen-dark/50 flex flex-col items-center gap-2.5">
          <div className="text-[11px] text-espresso-light text-center">
            Accessing from your mobile phone or tablet?
          </div>
          <DownloadAppButton variant="login" />
        </div>

        {/* ── Security Note ──────────────────────────── */}
        <div className="mt-5 text-center flex items-center justify-center gap-1.5 text-[10px] text-espresso-light/60">
          <ShieldCheck className="h-3 w-3 text-emerald-600" />
          <span>256-bit SSL Encrypted • Internal Personnel Only</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-surface/95 border border-linen-dark rounded-3xl p-6 shadow-glass-xl backdrop-blur-2xl">
            <h4 className="font-bold text-sm text-foreground mb-2 flex items-center gap-2">
              <Lock className="h-4 w-4 text-liquid-amber" />
              Reset Staff Password
            </h4>
            <p className="text-xs text-espresso-light mb-4 leading-relaxed">
              Staff accounts are managed by Pathway Super Administrators. Please contact Hatim or your IT manager to reset your credentials.
            </p>
            <div className="p-3 rounded-xl bg-linen/60 text-xs text-espresso-light mb-4">
              <strong>Admin Support:</strong> support@pathway.com<br />
              <strong>Internal Helpline:</strong> +91 98765 43210
            </div>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full h-10 rounded-xl bg-espresso text-white text-xs font-medium hover:bg-black transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
