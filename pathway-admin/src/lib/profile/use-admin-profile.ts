"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface AdminProfile {
  name: string;
  email: string;
  role: string;
  phone: string;
  company: string;
}

const DEFAULT_PROFILE: AdminProfile = {
  name: "Owner",
  email: "admin@pathway.edu",
  role: "SUPER ADMIN",
  phone: "+91 98765 43210",
  company: "Pathway Education Consultancy",
};

const STORAGE_KEY = "pathway_admin_profile";

export function getProfileInitials(name: string): string {
  if (!name || name.trim() === "") return "OW";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function useAdminProfile() {
  const [profile, setProfile] = useState<AdminProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  // Load profile from localStorage and Supabase on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    let loaded = false;
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        setProfile((prev) => ({ ...prev, ...parsed }));
        loaded = true;
      } catch (e) {
        // ignore parse error
      }
    }

    // Try fetching from Supabase auth session
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        const userMeta = data.user.user_metadata || {};
        const merged: AdminProfile = {
          name: userMeta.full_name || userMeta.name || (loaded ? profile.name : "Owner"),
          email: data.user.email || profile.email,
          role: userMeta.role || profile.role,
          phone: userMeta.phone || profile.phone,
          company: userMeta.company || profile.company,
        };
        setProfile(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // Listen for cross-component updates
    const handleUpdate = (e: Event) => {
      const updated = (e as CustomEvent<AdminProfile>).detail;
      if (updated) {
        setProfile(updated);
      }
    };

    window.addEventListener("pathway_profile_updated", handleUpdate);
    return () => window.removeEventListener("pathway_profile_updated", handleUpdate);
  }, []);

  const updateProfile = async (newProfile: Partial<AdminProfile>) => {
    const updated: AdminProfile = { ...profile, ...newProfile };
    setProfile(updated);

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("pathway_profile_updated", { detail: updated }));
    }

    // Persist to Supabase auth user metadata if logged in
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        email: updated.email !== profile.email ? updated.email : undefined,
        data: {
          full_name: updated.name,
          role: updated.role,
          phone: updated.phone,
          company: updated.company,
        },
      });
    } catch (e) {
      // Quiet fail if offline/mock auth
    }

    return updated;
  };

  return {
    profile,
    loading,
    updateProfile,
    initials: getProfileInitials(profile.name),
  };
}
