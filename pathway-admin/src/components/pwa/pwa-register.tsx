"use client";

import { useEffect, useRef, useState } from "react";
import { Download, X, BellRing } from "lucide-react";

// Extend Window type for beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function PwaRegister() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showNotifBanner, setShowNotifBanner] = useState(false);
  const [installed, setInstalled] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // ── 1. Service Worker Registration ──────────────────────────────────────
    if ("serviceWorker" in navigator) {
      // Purge stale caches
      if ("caches" in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => {
            if (!key.includes("v2026-10-03-pwa-install-fix")) caches.delete(key);
          });
        });
      }

      navigator.serviceWorker
        .register("/sw.js", { updateViaCache: "none" })
        .then((reg) => {
          reg.update();
          reg.addEventListener("updatefound", () => {
            const w = reg.installing;
            if (w) {
              w.addEventListener("statechange", () => {
                if (w.state === "installed" && navigator.serviceWorker.controller) {
                  w.postMessage({ type: "SKIP_WAITING" });
                }
              });
            }
          });

          // ── 2. Notification Permission ─────────────────────────────────
          // Ask for notification permission after SW is ready
          if ("Notification" in window && Notification.permission === "default") {
            // Small delay so page has time to render first
            setTimeout(() => setShowNotifBanner(true), 2000);
          }
        })
        .catch((err) => console.debug("SW registration failed:", err));

      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    // ── 3. Capture the install prompt ──────────────────────────────────────
    // Check if already installed (standalone mode)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true);

    if (isStandalone) {
      setInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault(); // Prevent browser's default mini-infobar
      deferredPrompt.current = e;
      setInstallPrompt(e);
      // Show our custom install banner
      setShowInstallBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setShowInstallBanner(false);
      deferredPrompt.current = null;
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    const prompt = deferredPrompt.current;
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
      setShowInstallBanner(false);
    }
    deferredPrompt.current = null;
    setInstallPrompt(null);
  };

  const handleRequestNotifications = async () => {
    setShowNotifBanner(false);
    if (!("Notification" in window)) return;
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted" && "serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        // Show a welcome notification to confirm it works
        reg.showNotification("🔔 Pathway CRM Notifications Enabled", {
          body: "You'll receive alerts for new student inquiries and updates.",
          icon: "/images/logo.png",
          badge: "/images/logo.png",
          tag: "pathway-notif-welcome",
        });
      }
    } catch (err) {
      console.debug("Notification permission error:", err);
    }
  };

  if (installed) return null;

  return (
    <>
      {/* ── Install App Banner ──────────────────────────────────────────── */}
      {showInstallBanner && !installed && (
        <div
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3
            bg-[#1A1F2E] border border-[#D4AF37]/30 text-white rounded-2xl px-4 py-3
            shadow-2xl shadow-black/40 backdrop-blur-xl
            animate-in slide-in-from-bottom-4 duration-400
            max-w-sm w-[calc(100vw-2.5rem)]"
        >
          <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
            <img src="/images/logo.png" alt="Pathway" className="h-7 w-7 object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white leading-tight">Install Pathway CRM</p>
            <p className="text-[10px] text-white/60 leading-tight mt-0.5">
              Add to your home screen for quick access
            </p>
          </div>
          <button
            onClick={handleInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4AF37] text-[#1A1F2E] text-[11px] font-bold shrink-0 hover:bg-[#e8c84a] transition-colors"
          >
            <Download className="h-3 w-3" />
            Install
          </button>
          <button
            onClick={() => setShowInstallBanner(false)}
            className="text-white/40 hover:text-white/80 transition-colors shrink-0 ml-1"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Notification Permission Banner ──────────────────────────────── */}
      {showNotifBanner && (
        <div
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3
            bg-[#1A1F2E] border border-[#D4AF37]/30 text-white rounded-2xl px-4 py-3
            shadow-2xl shadow-black/40 backdrop-blur-xl
            animate-in slide-in-from-top-4 duration-400
            max-w-sm w-[calc(100vw-2.5rem)]"
        >
          <div className="h-9 w-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
            <BellRing className="h-4 w-4 text-[#D4AF37]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white leading-tight">Enable Notifications</p>
            <p className="text-[10px] text-white/60 leading-tight mt-0.5">
              Get alerts for new inquiries &amp; updates
            </p>
          </div>
          <button
            onClick={handleRequestNotifications}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4AF37] text-[#1A1F2E] text-[11px] font-bold shrink-0 hover:bg-[#e8c84a] transition-colors"
          >
            Allow
          </button>
          <button
            onClick={() => setShowNotifBanner(false)}
            className="text-white/40 hover:text-white/80 transition-colors shrink-0 ml-1"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}
