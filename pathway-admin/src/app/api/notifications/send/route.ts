import { NextRequest, NextResponse } from "next/server";
import webPush from "web-push";
import { subscriptionsStore } from "../subscribe/route";

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BHB9KrgJlCV5QwlIK6ZSEu3FEaF3XiPXBr1vCYIJbrL37HheTWPLIxSBFZGJB-IR7RKEtUAp_qVNpefmdN0k9M0";

const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY ||
  "UJHurt0sk-bQZ9zu4yUmeECRnkBZJR0334TLJ_DtPz0";

webPush.setVapidDetails(
  "mailto:admin@pathwayeducation.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export async function POST(req: NextRequest) {
  try {
    const { title, body, url, tag } = await req.json();

    const payload = JSON.stringify({
      title: title || "🔔 New Pathway Inquiry",
      body: body || "A student submitted an inquiry to Pathway CRM.",
      url: url || "/inquiries",
      tag: tag || `pathway-${Date.now()}`,
    });

    const results = [];
    const deadEndpoints: string[] = [];

    for (const [endpoint, sub] of subscriptionsStore.entries()) {
      try {
        await webPush.sendNotification(sub, payload);
        results.push({ endpoint, status: "sent" });
      } catch (err: any) {
        console.error("Push delivery error for endpoint:", endpoint, err?.statusCode);
        if (err?.statusCode === 410 || err?.statusCode === 404) {
          deadEndpoints.push(endpoint);
        }
        results.push({ endpoint, status: "failed", error: err?.message });
      }
    }

    // Clean up expired subscriptions
    deadEndpoints.forEach((ep) => subscriptionsStore.delete(ep));

    return NextResponse.json({
      success: true,
      delivered: results.filter((r) => r.status === "sent").length,
      failed: results.filter((r) => r.status === "failed").length,
      totalSubscribers: subscriptionsStore.size,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send notification";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
