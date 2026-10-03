"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { showLocalNativeNotification } from "@/lib/notifications/push-service";

// Play a pleasant 2-tone chime using Web Audio API
function playChime() {
  try {
    const AudioContext =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.15);
    gain2.gain.setValueAtTime(0.15, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.7);
  } catch (e) {
    // Quiet audio failure if autoplay not yet allowed
  }
}

// Global in-memory set to prevent duplicate popups across page transitions
const globalNotifiedSet = new Set<string>();

export function LeadNotificationListener() {
  const router = useRouter();
  const isInitialized = useRef(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notifyNewLead = (lead: any) => {
    if (!lead) return;
    const leadId = lead.id ? String(lead.id) : `${lead.full_name}-${lead.phone}`;

    // Never notify if already seen in memory or session storage
    if (globalNotifiedSet.has(leadId)) return;

    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(sessionStorage.getItem("pathway_notified_leads") || "[]");
        if (stored.includes(leadId)) {
          globalNotifiedSet.add(leadId);
          return;
        }
        stored.push(leadId);
        sessionStorage.setItem("pathway_notified_leads", JSON.stringify(stored));
      } catch {}
    }

    globalNotifiedSet.add(leadId);

    const studentName = lead.full_name || "New Student";
    const destination = lead.destination || "Study Abroad";
    const course = lead.course || "Higher Education";

    // 1. Play chime
    playChime();

    // 2. In-app toast banner
    toast.success("🔔 New Website Inquiry Received!", {
      description: `${studentName} interested in ${destination} (${course})`,
      action: {
        label: "Open Inquiries",
        onClick: () => router.push("/inquiries"),
      },
      duration: 7000,
    });

    // 3. Native phone notification
    showLocalNativeNotification({
      title: `🔔 New Inquiry: ${studentName}`,
      body: `Interested in ${destination} (${course}). Tap to open and reply.`,
      tag: `lead-${leadId}`,
      url: "/inquiries",
    });

    // 4. Notify open inquiry tables to refresh
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("pathway_new_lead", { detail: lead }));
    }
  };

  useEffect(() => {
    const supabase = createClient();

    // On initial mount, fetch all existing leads and mark them as already seen
    // This ensures NO notifications pop up for past historical leads
    if (!isInitialized.current) {
      isInitialized.current = true;
      supabase
        .from("leads")
        .select("id, full_name, phone")
        .then(({ data }) => {
          if (data) {
            data.forEach((l) => {
              const id = l.id ? String(l.id) : `${l.full_name}-${l.phone}`;
              globalNotifiedSet.add(id);
            });
          }
        })
        .catch(() => {});
    }

    // 1. Real-time Supabase postgres INSERT channel
    // Fires ONLY when a REAL new lead is inserted into the database
    const channel = supabase
      .channel("leads_realtime_stream")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "leads",
        },
        (payload) => {
          notifyNewLead(payload.new);
        }
      )
      .subscribe();

    // 2. BroadcastChannel for same-browser instant tab sync
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel("pathway_leads_channel");
        bc.onmessage = (event) => {
          if (event.data?.type === "NEW_LEAD") {
            notifyNewLead(event.data.lead);
          }
        };
      }
    } catch {}

    return () => {
      supabase.removeChannel(channel);
      if (bc) bc.close();
    };
  }, []);

  return null;
}
