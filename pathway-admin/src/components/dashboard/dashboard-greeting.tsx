"use client";

import { useAdminProfile } from "@/lib/profile/use-admin-profile";

export function DashboardGreeting() {
  const { profile } = useAdminProfile();
  const firstName = profile.name ? profile.name.split(" ")[0] : "Admin";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#F8F5F1]">
      {getGreeting()}, {firstName}.
    </h1>
  );
}
