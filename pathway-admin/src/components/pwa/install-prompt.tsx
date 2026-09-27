"use client";

import { useState, useEffect } from "react";
import { usePWAInstall } from "@/hooks/use-pwa-install";
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileInstallGate() {
  const { isInstalled, isIOS, isMobile, isInstallable, installApp } = usePWAInstall();
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
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

  if (isInstalled || !isOpen || hasDismissed) {
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-espresso/40 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="w-full sm:max-w-md bg-surface/95 border-t sm:border border-linen-dark/60 rounded-t-[32px] sm:rounded-3xl p-6 sm:p-8 shadow-glass-xl backdrop-blur-2xl transition-all duration-300 transform translate-y-0"
        style={{ paddingBottom: "max(1.75rem, env(safe-area-inset-bottom))" }}
      >
        {/* Header & Monogram */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-liquid-amber to-amber-700 flex items-center justify-center text-white font-bold text-xl shadow-warm border border-white/30">
              P
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-liquid-amber">
                  Required on Phone
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-foreground font-serif tracking-tight">
                Pathway Admin App
              </h3>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="h-8 w-8 rounded-full flex items-center justify-center text-espresso-light/60 hover:text-foreground hover:bg-black/5 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-espresso-light leading-relaxed mb-5">
          For enhanced performance, instant lead notifications, and secure mobile counselling, this CRM must be installed to your phone’s home screen.
        </p>

        {/* Feature Pills */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-linen/50 border border-linen-dark/30">
            <Zap className="h-3.5 w-3.5 text-liquid-amber shrink-0" />
            <span className="text-[11px] font-medium text-foreground">Instant Loading</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-linen/50 border border-linen-dark/30">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-medium text-foreground">Secure Biometrics</span>
          </div>
        </div>

        {/* Installation Instruction / Action */}
        {installedSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center flex flex-col items-center gap-1">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            <span className="font-semibold text-sm">App Installed Successfully</span>
            <span className="text-xs text-emerald-700">Open Pathway from your home screen</span>
          </div>
        ) : isIOS ? (
          /* iOS Safari Guide */
          <div className="space-y-2.5 p-4 rounded-2xl bg-white/70 border border-linen-dark/40 shadow-sm mb-4">
            <div className="text-[11px] font-semibold text-espresso uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5 text-liquid-amber" />
              How to install on iPhone:
            </div>
            <div className="flex items-center gap-3 text-xs text-espresso-light">
              <span className="h-5 w-5 rounded-full bg-linen-dark/50 flex items-center justify-center font-bold text-[10px] text-espresso shrink-0">1</span>
              <span>Tap the <strong className="text-foreground inline-flex items-center gap-1">Share <Share2 className="h-3 w-3 inline text-blue-600" /></strong> button in Safari toolbar.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-espresso-light">
              <span className="h-5 w-5 rounded-full bg-linen-dark/50 flex items-center justify-center font-bold text-[10px] text-espresso shrink-0">2</span>
              <span>Scroll down and tap <strong className="text-foreground inline-flex items-center gap-1">Add to Home Screen <PlusSquare className="h-3 w-3 inline text-emerald-600" /></strong>.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-espresso-light">
              <span className="h-5 w-5 rounded-full bg-linen-dark/50 flex items-center justify-center font-bold text-[10px] text-espresso shrink-0">3</span>
              <span>Tap <strong className="text-foreground">Add</strong> in top-right. Launch from home screen!</span>
            </div>
          </div>
        ) : (
          /* Android / Chrome Native Install */
          <div className="mb-4">
            <Button
              onClick={handleInstallClick}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-liquid-amber to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold text-sm shadow-warm flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download & Install App
            </Button>
          </div>
        )}

        {/* Temporary bypass button */}
        <div className="text-center pt-1">
          <button
            onClick={handleDismiss}
            className="text-[11px] font-medium text-espresso-light/70 hover:text-espresso underline underline-offset-4 transition-colors"
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
  const { isInstalled, isInstallable, installApp, isIOS } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already running standalone, hide the download button
  if (isInstalled) return null;

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
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/70 hover:bg-white/90 border border-linen-dark/50 text-[11px] font-medium text-espresso shadow-sm transition-all duration-200 hover:shadow-warm hover:border-liquid-amber/50 ${className}`}
        >
          <Smartphone className="h-3.5 w-3.5 text-liquid-amber" />
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
        <div className={`p-3 mx-2 my-2 rounded-2xl bg-gradient-to-br from-white/60 to-linen/40 border border-linen-dark/50 shadow-glass-sm ${className}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-lg bg-liquid-amber/15 text-liquid-amber flex items-center justify-center">
              <Download className="h-3.5 w-3.5" />
            </div>
            <div className="text-[11px] font-semibold text-foreground">Get Mobile App</div>
          </div>
          <p className="text-[10px] text-espresso-light mb-2.5 leading-tight">
            Install Pathway CRM directly to your phone or desktop.
          </p>
          <button
            onClick={handleClick}
            className="w-full py-1.5 px-2 rounded-xl bg-surface hover:bg-white text-espresso font-medium text-[11px] border border-linen-dark shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Smartphone className="h-3 w-3 text-liquid-amber" />
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
        className={`hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-xl border border-linen-dark/60 bg-surface/60 hover:bg-white text-espresso text-xs font-medium shadow-glass-sm transition-all duration-200 hover:border-liquid-amber/50 hover:text-liquid-amber ${className}`}
      >
        <Download className="h-3.5 w-3.5 text-liquid-amber" />
        <span className="text-[11px]">Install App</span>
      </Button>
      {showIOSModal && <InstallGuideModal onClose={() => setShowIOSModal(false)} />}
    </>
  );
}

function InstallGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-surface/95 border border-linen-dark rounded-3xl p-6 shadow-glass-xl backdrop-blur-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-liquid-amber" />
            <h4 className="font-bold text-sm text-foreground">Install Pathway App</h4>
          </div>
          <button onClick={onClose} className="text-espresso-light hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-espresso-light mb-4">
          Install Pathway Admin directly to your home screen or desktop application list for one-click access:
        </p>
        <div className="space-y-2.5 text-xs text-espresso-light bg-linen/50 p-3 rounded-2xl border border-linen-dark/30 mb-4">
          <div className="flex items-start gap-2">
            <span className="font-bold text-foreground">iOS:</span> Tap <Share2 className="h-3.5 w-3.5 inline text-blue-600" /> Share in Safari, then select <strong>Add to Home Screen</strong>.
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-foreground">Chrome:</span> Tap the <Download className="h-3.5 w-3.5 inline text-liquid-amber" /> install icon in address bar, or browser menu &rarr; <strong>Install App</strong>.
          </div>
        </div>
        <Button onClick={onClose} className="w-full h-10 rounded-xl bg-liquid-amber hover:bg-amber-700 text-white text-xs">
          Got it
        </Button>
      </div>
    </div>
  );
}
