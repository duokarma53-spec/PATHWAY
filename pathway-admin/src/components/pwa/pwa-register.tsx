"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // Service worker registered successfully
        })
        .catch((err) => {
          console.debug("PWA SW registration failed:", err);
        });
    }
  }, []);

  return null;
}
