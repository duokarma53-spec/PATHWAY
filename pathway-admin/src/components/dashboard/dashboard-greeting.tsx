"use client";

import { useAdminProfile } from "@/lib/profile/use-admin-profile";

export function DashboardGreeting() {
  const { profile } = useAdminProfile();
  const firstName = profile.name ? profile.name.split(" ")[0] : "Owner";

  return (
    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif">
      Good morning, {firstName}.
    </h1>
  );
}
