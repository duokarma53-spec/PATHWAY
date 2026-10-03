"use client";

import React, { useState } from "react";
import { Compass, MapPin } from "lucide-react";

interface DestinationHub {
  code: string;
  country: string;
  flag: string;
  city: string;
  highlight: string;
  coordinates: string;
}

const HUBS: DestinationHub[] = [
  { code: "UK", country: "United Kingdom", flag: "🇬🇧", city: "London", highlight: "160+ Partner Universities", coordinates: "51.5°N 0.1°W" },
  { code: "CA", country: "Canada", flag: "🇨🇦", city: "Toronto", highlight: "SDS & Direct Intakes", coordinates: "43.6°N 79.4°W" },
  { code: "AU", country: "Australia", flag: "🇦🇺", city: "Sydney", highlight: "Go8 & Regional Programs", coordinates: "33.8°S 151.2°E" },
  { code: "US", country: "United States", flag: "🇺🇸", city: "New York", highlight: "Ivy & STEM Work Extensions", coordinates: "40.7°N 74.0°W" },
  { code: "DE", country: "Germany", flag: "🇩🇪", city: "Frankfurt", highlight: "TU9 & Zero-Tuition Public", coordinates: "50.1°N 8.7°E" },
  { code: "IE", country: "Ireland", flag: "🇮🇪", city: "Dublin", highlight: "2-Yr Post-Study Work Visa", coordinates: "53.3°N 6.3°W" },
];

export function GlobalNetworkPill() {
  const [activeHub, setActiveHub] = useState<DestinationHub | null>(null);

  return (
    <div className="relative flex items-center">
      {/* ── Main Map Aesthetic Capsule ── */}
      <div
        className="flex items-center gap-2.5 px-3 py-1 rounded-full border transition-all duration-300"
        style={{
          background: "rgba(24, 16, 10, 0.65)",
          borderColor: "rgba(192, 120, 56, 0.22)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,220,180,0.06)",
        }}
      >
        {/* Live Radar Beacon Ping */}
        <div className="relative flex items-center justify-center w-3 h-3">
          <span
            className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full opacity-75"
            style={{ background: "#D4956A" }}
          />
          <span
            className="relative inline-flex rounded-full h-1.5 w-1.5"
            style={{ background: "#FDBA74" }}
          />
        </div>

        {/* Compass / Map Icon & Title */}
        <div className="flex items-center gap-1.5">
          <Compass className="h-3 w-3 text-[#D4956A] shrink-0 animate-[spin_40s_linear_infinite]" />
          <span className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#D4956A]">
            Global Corridors
          </span>
        </div>

        <span className="w-[1px] h-3 bg-[#C07838]/25" />

        {/* Interactive Hub Chips */}
        <div className="flex items-center gap-1">
          {HUBS.map((hub) => {
            const isHovered = activeHub?.code === hub.code;
            return (
              <button
                key={hub.code}
                type="button"
                onMouseEnter={() => setActiveHub(hub)}
                onMouseLeave={() => setActiveHub(null)}
                className="relative group flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-medium transition-all duration-200"
                style={{
                  background: isHovered ? "rgba(192, 120, 56, 0.25)" : "rgba(255, 255, 255, 0.03)",
                  color: isHovered ? "#FFE082" : "rgba(212, 180, 150, 0.75)",
                  border: isHovered ? "1px solid rgba(212, 149, 106, 0.45)" : "1px solid transparent",
                }}
              >
                <span className="text-[11px] leading-none">{hub.flag}</span>
                <span className="tracking-wider">{hub.code}</span>
              </button>
            );
          })}
        </div>

        <span className="w-[1px] h-3 bg-[#C07838]/25 hidden xl:block" />

        {/* Dahod HQ Coordinates */}
        <div className="hidden xl:flex items-center gap-1 text-[9.5px] font-mono tracking-wider text-[#A08570]/70">
          <MapPin className="h-2.5 w-2.5 text-[#C07838]/70" />
          <span>HQ 22.8°N 74.2°E</span>
        </div>
      </div>

      {/* ── Floating Tooltip for Active Destination Hub ── */}
      {activeHub && (
        <div
          role="tooltip"
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 rounded-xl border backdrop-blur-md pointer-events-none z-30 transition-all duration-200 animate-in fade-in zoom-in-95"
          style={{
            background: "rgba(14, 10, 6, 0.92)",
            borderColor: "rgba(192, 120, 56, 0.35)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.55), 0 0 15px rgba(192,120,56,0.15)",
            minWidth: "190px",
          }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-[#C07838]/15 pb-1 mb-1">
            <span className="text-[11px] font-bold text-[#FFE082] flex items-center gap-1.5">
              <span>{activeHub.flag}</span>
              <span>{activeHub.country}</span>
            </span>
            <span className="text-[9px] font-mono text-[#D4956A]">
              {activeHub.city}
            </span>
          </div>
          <p className="text-[10px] text-[#D8C7B5] leading-snug">
            {activeHub.highlight}
          </p>
          <p className="text-[8.5px] font-mono text-[#8C7662] mt-1 flex items-center gap-1">
            <span>Coordinates:</span>
            <span className="text-[#C07838]">{activeHub.coordinates}</span>
          </p>
        </div>
      )}
    </div>
  );
}
