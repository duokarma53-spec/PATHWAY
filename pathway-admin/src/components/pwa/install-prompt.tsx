"use client";

import { useState, useEffect } from "react";
import { usePWAInstall } from "@/hooks/use-pwa-install";
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/brand-logo";

export function MobileInstallGate() {
  const [mounted, setMounted] = useState(false);
  const { isInstalled, isIOS, isMobile, isInstallable, installApp } = usePWAInstall();
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only prompt on mobile devices that are not already running in standalone PWA mode
    if (isMobile && !isInstalled) {
      const dismissed = sessionStorage.getItem("pwa_prompt_dismissed");
      if (!dismissed) {
        // Slight delay for smooth appearance after page load
        const timer = setTimeout(() => setIsOpen(true), 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [isMobile, isInstalled]);

  if (!mounted || isInstalled || !isOpen || hasDismissed) {
    return null;
  }

  const handleDismiss = () => {
    sessionStorage.setItem("pwa_prompt_dismissed", "true");
    setHasDismissed(true);
    setIsOpen(false);
  };

  const handleInstallClick = async () => {
    const success = await installApp();
    if (success) {
      setInstalledSuccess(true);
      setTimeout(() => setIsOpen(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="w-full sm:max-w-md bg-white dark:bg-[#1E1713] text-slate-900 dark:text-white border-t sm:border border-slate-200 dark:border-white/10 rounded-t-[32px] sm:rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 transform translate-y-0"
        style={{ paddingBottom: "max(1.75rem, env(safe-area-inset-bottom))" }}
      >
        {/* Header & Monogram */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                  Mobile App Experience
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
                Pathway Education CRM
              </h3>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed mb-5 font-medium">
          For fast full-screen access, instant lead alerts, and secure biometric counselling, install Pathway directly to your home screen.
        </p>

        {/* Feature Pills */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-900 dark:text-white">Instant Offline Load</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-900 dark:text-white">Encrypted & Secure</span>
          </div>
        </div>

        {/* Installation Instruction / Action */}
        {installedSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-center flex flex-col items-center gap-1.5">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            <span className="font-bold text-sm">App Installed Successfully!</span>
            <span className="text-xs text-emerald-700 font-medium">Open Pathway from your phone home screen</span>
          </div>
        ) : isIOS ? (
          /* iOS Safari Guide */
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm mb-4">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Smartphone className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              How to install on iPhone / iPad:
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-800 dark:text-slate-200 font-medium">
              <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
              <span>Tap the <strong className="text-slate-900 dark:text-white inline-flex items-center gap-1 font-bold">Share <Share2 className="h-3.5 w-3.5 inline text-blue-600" /></strong> button in Safari toolbar.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-800 dark:text-slate-200 font-medium">
              <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
              <span>Scroll down and tap <strong className="text-slate-900 dark:text-white inline-flex items-center gap-1 font-bold">Add to Home Screen <PlusSquare className="h-3.5 w-3.5 inline text-emerald-600" /></strong>.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-800 dark:text-slate-200 font-medium">
              <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
              <span>Tap <strong className="text-slate-900 dark:text-white font-bold">Add</strong> in top-right corner. Ready!</span>
            </div>
          </div>
        ) : (
          /* Android / Chrome Native Install */
          <div className="mb-4">
            <Button
              onClick={handleInstallClick}
              className="w-full h-12 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download & Install App
            </Button>
          </div>
        )}

        {/* Dismiss button */}
        <div className="text-center pt-2">
          <button
            onClick={handleDismiss}
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-4 transition-colors py-1 px-3"
          >
            Continue in browser for now
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Download App Button for Topbar, Sidebar, or Login Page
 */
export function DownloadAppButton({
  variant = "topbar",
  className = ""
}: {
  variant?: "topbar" | "sidebar" | "login" | "banner";
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const { isInstalled, isInstallable, installApp, isIOS } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isInstalled) return null;

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }
    if (isInstallable) {
      await installApp();
    } else {
      setShowIOSModal(true);
    }
  };

  if (variant === "login") {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 border border-slate-200 dark:border-white/15 text-xs font-semibold text-slate-800 dark:text-white shadow-sm transition-all duration-200 ${className}`}
        >
          <Smartphone className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span>Install Admin App</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </button>

        {showIOSModal && <InstallGuideModal onClose={() => setShowIOSModal(false)} />}
      </>
    );
  }

  if (variant === "sidebar") {
    return (
      <>
        <div className={`p-3 mx-2 my-2 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm ${className}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-6 w-6 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Download className="h-3.5 w-3.5" />
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Get Mobile App</div>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-2.5 leading-snug font-medium">
            Install Pathway CRM directly to your phone for quick access.
          </p>
          <button
            onClick={handleClick}
            className="w-full py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white font-semibold text-xs border border-slate-200 dark:border-white/10 shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Smartphone className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Install App</span>
          </button>
        </div>
        {showIOSModal && <InstallGuideModal onClose={() => setShowIOSModal(false)} />}
      </>
    );
  }

  // Topbar variant (compact button)
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className={`hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 hover:bg-white dark:bg-white/5 text-slate-800 dark:text-white text-xs font-semibold shadow-xs transition-all duration-200 hover:text-amber-600 ${className}`}
      >
        <Download className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
        <span className="text-xs">Install App</span>
      </Button>
      {showIOSModal && <InstallGuideModal onClose={() => setShowIOSModal(false)} />}
    </>
  );
}

function InstallGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-[#1E1713] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Install Pathway App</h4>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-200 font-medium mb-4 leading-relaxed">
          Install Pathway Admin directly to your home screen or desktop application list for one-click access:
        </p>
        <div className="space-y-2.5 text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-200 dark:border-white/10 mb-4 font-medium">
          <div className="flex items-start gap-2">
            <span className="font-bold text-slate-900 dark:text-white">iOS:</span> Tap <Share2 className="h-3.5 w-3.5 inline text-blue-600" /> Share in Safari, then select <strong>Add to Home Screen</strong>.
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-slate-900 dark:text-white">Android / Chrome:</span> Tap browser menu &rarr; <strong>Install App</strong> or <strong>Add to Home screen</strong>.
          </div>
        </div>
        <Button onClick={onClose} className="w-full h-10 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs">
          Got it
        </Button>
      </div>
    </div>
  );
}
