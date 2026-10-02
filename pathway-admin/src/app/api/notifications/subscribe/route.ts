import { NextRequest, NextResponse } from "next/server";

// Store subscriptions in-memory (and optionally persist in Supabase)
export const subscriptionsStore = new Map<string, any>();

export async function POST(req: NextRequest) {
  try {
    const subscription = await req.json();
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Invalid subscription data" }, { status: 400 });
    }

    subscriptionsStore.set(subscription.endpoint, subscription);
    return NextResponse.json({ success: true, total: subscriptionsStore.size });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save subscription";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    total: subscriptionsStore.size,
    vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BHB9KrgJlCV5QwlIK6ZSEu3FEaF3XiPXBr1vCYIJbrL37HheTWPLIxSBFZGJB-IR7RKEtUAp_qVNpefmdN0k9M0",
  });
}
