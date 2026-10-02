"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  withGlow?: boolean;
}

const sizeMap = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
};

/**
 * Bespoke Luxury Insignia for Pathway Education
 * Features:
 * - Architectural Grand Keystone Arch (gateway to world universities)
 * - Guiding Polaris North Star at zenith
 * - Ascending golden meridian lines
 * - Beveled jewelry-grade 24k gold leaf finish
 * 
 * Mobile Compatible (iOS Safari & Android):
 * - Uses useId() so duplicate instances (e.g. desktop sidebar + mobile drawer)
 *   never collide or reference hidden SVG defs.
 * - Standard camelCase SVG attributes for full WebKit / Blink engine compatibility.
 */
export function BrandLogo({ size = "sm", className, withGlow = true }: BrandLogoProps) {
  const rawId = useId();
  // Sanitize id for SVG attribute selectors
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "");

  const crestBaseId = `crestBase_${id}`;
  const goldLusterId = `goldLuster_${id}`;
  const champagneGlowId = `champGlow_${id}`;
  const starHaloId = `starHalo_${id}`;

  return (
    <div
      className={cn(
        "relative rounded-xl flex items-center justify-center shrink-0 select-none bg-[#1A1410] border border-[#D4AF37]/40 overflow-hidden",
        sizeMap[size],
        withGlow && "shadow-[0_4px_16px_rgba(212,175,55,0.3)]",
        className
      )}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
      >
        <defs>
          {/* Deep Obsidian & Espresso Base */}
          <linearGradient id={crestBaseId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#261E18" />
            <stop offset="50%" stopColor="#1A1410" />
            <stop offset="100%" stopColor="#100C09" />
          </linearGradient>

          {/* 24k Radiant Gold Gradient */}
          <linearGradient id={goldLusterId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF4D6" />
            <stop offset="35%" stopColor="#F2D08A" />
            <stop offset="70%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8C5D23" />
          </linearGradient>

          {/* Platinum / Champagne Highlight */}
          <linearGradient id={champagneGlowId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#F2D08A" stopOpacity={0} />
          </linearGradient>

          {/* Radial Zenith Glow */}
          <radialGradient id={starHaloId} cx="50%" cy="26%" r="35%">
            <stop offset="0%" stopColor="#FFEBB8" stopOpacity={0.9} />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Outer Shield / Beveled Hexagon */}
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="22"
          fill={`url(#${crestBaseId})`}
        />
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="22"
          stroke={`url(#${goldLusterId})`}
          strokeWidth="2.5"
          strokeOpacity={0.85}
        />
        <rect
          x="7.5"
          y="7.5"
          width="85"
          height="85"
          rx="18"
          stroke="#FAF8F5"
          strokeWidth="0.75"
          strokeOpacity={0.18}
        />

        {/* Soft Radial Ambient Star Bloom */}
        <circle cx="50" cy="27" r="22" fill={`url(#${starHaloId})`} />

        {/* Grand Architectural Archway (The Gateway) */}
        <path
          d="M 28 80 L 28 48 C 28 35.8 37.8 26 50 26 C 62.2 26 72 35.8 72 48 L 72 80"
          stroke={`url(#${goldLusterId})`}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner Archway Contour */}
        <path
          d="M 37 80 L 37 51 C 37 43.8 42.8 38 50 38 C 57.2 38 63 43.8 63 51 L 63 80"
          stroke={`url(#${goldLusterId})`}
          strokeWidth="1.8"
          strokeDasharray="2 3"
          strokeOpacity={0.6}
        />

        {/* Ascending Central Pathway Line */}
        <path
          d="M 50 82 L 50 54"
          stroke={`url(#${goldLusterId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Perspective Pathway Floor Rays */}
        <path
          d="M 44 80 L 48 64 M 56 80 L 52 64"
          stroke={`url(#${goldLusterId})`}
          strokeWidth="1.5"
          strokeOpacity={0.7}
          strokeLinecap="round"
        />

        {/* The Guiding Polaris 8-Point Star at the Zenith Arch */}
        {/* Vertical beam */}
        <path
          d="M 50 14 L 52.2 24.5 L 50 35 L 47.8 24.5 Z"
          fill={`url(#${goldLusterId})`}
        />
        {/* Horizontal beam */}
        <path
          d="M 38 24.5 L 48 22.8 L 62 24.5 L 48 26.2 Z"
          fill={`url(#${goldLusterId})`}
        />
        {/* Diagonal flares */}
        <path
          d="M 43 18 L 47.5 23 L 57 31 L 52.5 26 Z"
          fill="#FFF2D6"
          opacity={0.8}
        />
        <path
          d="M 57 18 L 52.5 23 L 43 31 L 47.5 26 Z"
          fill="#FFF2D6"
          opacity={0.8}
        />

        {/* Core brilliant diamond center */}
        <circle cx="50" cy="24.5" r="2.2" fill="#FFFFFF" />

        {/* Glass reflection top hairline */}
        <path
          d="M 12 16 Q 50 8 88 16"
          stroke={`url(#${champagneGlowId})`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
