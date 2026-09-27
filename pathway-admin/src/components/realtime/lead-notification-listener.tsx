"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Play a pleasant 2-tone luxury chime using Web Audio API
function playChime() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    
    // First tone (E5 - 659.25 Hz)
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

    // Second tone (A5 - 880 Hz)
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
    // Audio autoplay restrictions might silence chime if no interaction yet
  }
}

export function LeadNotificationListener() {
  const router = useRouter();
  const seenIds = useRef<Set<string>>(new Set());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notifyNewLead = (lead: any) => {
    const leadIdentifier = lead.id || `${lead.full_name}-${lead.phone}`;
    if (seenIds.current.has(leadIdentifier)) return;
    seenIds.current.add(leadIdentifier);

    // Play subtle audible chime
    playChime();

    // Show rich Sonner notification
    toast.success("🔔 New Website Inquiry Received!", {
      description: `${lead.full_name || "Prospective Student"} interested in ${lead.destination || "Study Abroad"} (${lead.course || "Undergraduate/Postgraduate"})`,
      action: {
        label: "Open Inquiries",
        onClick: () => router.push("/inquiries"),
      },
      duration: 8000,
    });

    // Notify open components to auto-refresh table state
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("pathway_new_lead", { detail: lead }));
    }
  };

  useEffect(() => {
    const supabase = createClient();

    // 1. Supabase Postgres Realtime Subscription
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
      .subscribe((status) => {
        console.debug("Supabase realtime subscription status:", status);
      });

    // 2. Cross-tab Broadcast Channel (instant local fallback)
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
    } catch (e) {
      // Ignore broadcast channel errors
    }

    // 3. Periodic Background Lead Sync (every 10 seconds)
    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        if (!error && data && data.length > 0) {
          // If first run, populate seenIds
          if (seenIds.current.size === 0) {
            data.forEach((l) => seenIds.current.add(l.id || `${l.full_name}-${l.phone}`));
          } else {
            // Check for new leads
            data.forEach((l) => {
              const id = l.id || `${l.full_name}-${l.phone}`;
              if (!seenIds.current.has(id)) {
                notifyNewLead(l);
              }
            });
          }
        }
      } catch (err) {
        // quiet error
      }
    }, 8000);

    return () => {
      supabase.removeChannel(channel);
      if (bc) bc.close();
      clearInterval(pollInterval);
    };
  }, []);

  return null;
}
