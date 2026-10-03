"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  withGlow?: boolean;
}

const sizeMap = {
  xs: "w-7 h-7 min-w-[28px]",
  sm: "w-9 h-9 min-w-[36px]",
  md: "w-11 h-11 min-w-[44px]",
  lg: "w-16 h-16 min-w-[64px]",
  xl: "w-24 h-24 min-w-[96px]",
};

/**
 * Official Pathway Education Consultancy Brand Logo
 * High-definition circular emblem with luxury gold rim and ambient bloom
 */
export function BrandLogo({ size = "sm", className, withGlow = true }: BrandLogoProps) {
  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center shrink-0 select-none bg-white p-0.5 border border-[#D4AF37]/60 overflow-hidden transition-all duration-300",
        sizeMap[size],
        withGlow && "shadow-[0_4px_16px_rgba(212,175,55,0.35)]",
        className
      )}
    >
      <img
        src="/images/logo.png"
        alt="Pathway Education Consultancy"
        className="w-full h-full object-contain rounded-full"
      />
    </div>
  );
}
