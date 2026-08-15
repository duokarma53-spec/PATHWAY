import { cn } from "@/lib/utils";
import React from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="text-sm font-bold uppercase tracking-wider text-sage">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-navy">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-lg text-midnight/80 leading-relaxed font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
}
