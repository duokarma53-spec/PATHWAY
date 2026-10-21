"use client";

// Declaration merging for standard W3C Web Notification specification properties
// supported by modern Service Workers but omitted in standard lib.dom.d.ts
declare global {
  interface NotificationOptions {
    renotify?: boolean;
    vibrate?: number | number[];
  }
}

export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BHB9KrgJlCV5QwlIK6ZSEu3FEaF3XiPXBr1vCYIJbrL37HheTWPLIxSBFZGJB-IR7RKEtUAp_qVNpefmdN0k9M0";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export type PushPermissionState = "granted" | "denied" | "default" | "unsupported";

export function getPushPermissionState(): PushPermissionState {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission as PushPermissionState;
}

/**
 * Request native notification permission and subscribe device to PushManager
 */
export async function requestPushPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return false;
    }

    // Register with PushManager if service worker is active
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      
      try {
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          const convertedVapidKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          });
        }

        // Send subscription to server
        if (subscription) {
          await fetch("/api/notifications/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subscription),
          }).catch(() => {});
        }
      } catch (pushErr) {
        console.debug("PushManager subscription note:", pushErr);
      }

      // Show immediate welcome notification on the phone
      await showLocalNativeNotification({
        title: "🔔 Pathway Mobile Alerts Activated!",
        body: "You will now receive instant push alerts on this phone whenever a new inquiry or student activity arrives.",
        url: "/inquiries",
      });
    }

    return true;
  } catch (err) {
    console.error("Error requesting notification permission:", err);
    return false;
  }
}

/**
 * Trigger an immediate native phone notification (appears in phone's lock screen & notification shade)
 */
export async function showLocalNativeNotification({
  title,
  body,
  url = "/inquiries",
  tag = "pathway-alert",
}: {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}): Promise<void> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration && registration.showNotification) {
        await registration.showNotification(title, {
          body,
          icon: "/icon.svg",
          badge: "/icon.svg",
          tag,
          renotify: true,
          vibrate: [250, 100, 250, 100, 250],
          data: { url },
        });
        return;
      }
    }

    // Fallback for regular desktop browser tabs
    new Notification(title, {
      body,
      icon: "/icon.svg",
      tag,
    });
  } catch (err) {
    console.error("Failed to show native notification:", err);
  }
}

/**
 * Trigger a simulated sample inquiry notification for testing on mobile
 */
export async function sendTestPhoneNotification(): Promise<void> {
  await showLocalNativeNotification({
    title: "⚡ New Website Inquiry Received!",
    body: "Harpreet Kaur (+91 98140...) inquired about UK Master's in Artificial Intelligence.",
    url: "/inquiries",
    tag: `test-inquiry-${Date.now()}`,
  });
}

/**
 * Play subtle audio chime for incoming leads
 */
export function playNotificationSound(): void {
  if (typeof window === "undefined") return;
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch (e) {
    // AudioContext might be blocked by autoplay policies until user interacts
  }
}
