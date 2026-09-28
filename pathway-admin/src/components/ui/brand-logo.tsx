"use client";

import React from "react";
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
 */
export function BrandLogo({ size = "sm", className, withGlow = true }: BrandLogoProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl flex items-center justify-center shrink-0 select-none",
        sizeMap[size],
        withGlow && "shadow-[0_8px_20px_rgba(212,175,55,0.28)]",
        className
      )}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
      >
        <defs>
          {/* Deep Obsidian & Espresso Base */}
          <linearGradient id="crestBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#261E18" />
            <stop offset="50%" stop-color="#1A1410" />
            <stop offset="100%" stop-color="#100C09" />
          </linearGradient>

          {/* 24k Radiant Gold Gradient */}
          <linearGradient id="goldLuster" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFF4D6" />
            <stop offset="35%" stop-color="#F2D08A" />
            <stop offset="70%" stop-color="#D4AF37" />
            <stop offset="100%" stop-color="#8C5D23" />
          </linearGradient>

          {/* Platinum / Champagne Highlight */}
          <linearGradient id="champagneGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#F2D08A" stop-opacity="0" />
          </linearGradient>

          {/* Radial Zenith Glow */}
          <radialGradient id="starHalo" cx="50%" cy="26%" r="35%">
            <stop offset="0%" stop-color="#FFEBB8" stop-opacity="0.9" />
            <stop offset="50%" stop-color="#D4AF37" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#D4AF37" stop-opacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Shield / Beveled Hexagon */}
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="24"
          fill="url(#crestBase)"
        />
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="24"
          stroke="url(#goldLuster)"
          stroke-width="2.5"
          stroke-opacity="0.85"
        />
        <rect
          x="7.5"
          y="7.5"
          width="85"
          height="85"
          rx="20"
          stroke="#FAF8F5"
          stroke-width="0.75"
          stroke-opacity="0.18"
        />

        {/* Soft Radial Ambient Star Bloom */}
        <circle cx="50" cy="27" r="22" fill="url(#starHalo)" />

        {/* Grand Architectural Archway (The Gateway) */}
        <path
          d="M 28 80 L 28 48 C 28 35.8 37.8 26 50 26 C 62.2 26 72 35.8 72 48 L 72 80"
          stroke="url(#goldLuster)"
          stroke-width="4.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        {/* Inner Archway Contour */}
        <path
          d="M 37 80 L 37 51 C 37 43.8 42.8 38 50 38 C 57.2 38 63 43.8 63 51 L 63 80"
          stroke="url(#goldLuster)"
          stroke-width="1.8"
          stroke-dasharray="2 3"
          stroke-opacity="0.6"
        />

        {/* Ascending Central Pathway Line */}
        <path
          d="M 50 82 L 50 54"
          stroke="url(#goldLuster)"
          stroke-width="2.5"
          stroke-linecap="round"
        />

        {/* Perspective Pathway Floor Rays */}
        <path
          d="M 44 80 L 48 64 M 56 80 L 52 64"
          stroke="url(#goldLuster)"
          stroke-width="1.5"
          stroke-opacity="0.7"
          stroke-linecap="round"
        />

        {/* The Guiding Polaris 8-Point Star at the Zenith Arch */}
        {/* Vertical beam */}
        <path
          d="M 50 14 L 52.2 24.5 L 50 35 L 47.8 24.5 Z"
          fill="url(#goldLuster)"
        />
        {/* Horizontal beam */}
        <path
          d="M 38 24.5 L 48 22.8 L 62 24.5 L 48 26.2 Z"
          fill="url(#goldLuster)"
        />
        {/* Diagonal flares */}
        <path
          d="M 43 18 L 47.5 23 L 57 31 L 52.5 26 Z"
          fill="#FFF2D6"
          opacity="0.8"
        />
        <path
          d="M 57 18 L 52.5 23 L 43 31 L 47.5 26 Z"
          fill="#FFF2D6"
          opacity="0.8"
        />

        {/* Core brilliant diamond center */}
        <circle cx="50" cy="24.5" r="2.2" fill="#FFFFFF" />

        {/* Glass reflection top hairline */}
        <path
          d="M 12 16 Q 50 8 88 16"
          stroke="url(#champagneGlow)"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </div>
  );
}
