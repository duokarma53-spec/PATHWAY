"use client";

import React from "react";

export function WorldMapBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
    >
      <svg
        className="w-full h-full opacity-40"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle gradient for continent fills */}
          <linearGradient id="continentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(212,149,106,0.07)" />
            <stop offset="50%" stopColor="rgba(192,120,56,0.04)" />
            <stop offset="100%" stopColor="rgba(140,85,35,0.02)" />
          </linearGradient>

          {/* Golden flight path gradients */}
          <linearGradient id="flightArcGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,200,120,0.85)" />
            <stop offset="50%" stopColor="rgba(212,149,106,0.5)" />
            <stop offset="100%" stopColor="rgba(192,120,56,0.15)" />
          </linearGradient>

          {/* Glow filter for map hubs and light beams */}
          <filter id="hubGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Dotted pattern for map texture */}
          <pattern id="geoDots" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="rgba(212,149,106,0.14)" />
          </pattern>
        </defs>

        {/* ── Background Dotted Texture ── */}
        <rect width="1200" height="600" fill="url(#geoDots)" opacity="0.45" />

        {/* ── Cartographic Graticule (Latitude & Longitude grid lines) ── */}
        <g stroke="rgba(192,120,56,0.09)" strokeWidth="0.75" strokeDasharray="3 5">
          {/* Latitude lines */}
          <line x1="0" y1="80" x2="1200" y2="80" />   {/* 60° N */}
          <line x1="0" y1="180" x2="1200" y2="180" /> {/* 30° N */}
          <line x1="0" y1="300" x2="1200" y2="300" stroke="rgba(212,149,106,0.16)" strokeDasharray="6 6" /> {/* Equator */}
          <line x1="0" y1="420" x2="1200" y2="420" /> {/* 30° S */}
          <line x1="0" y1="520" x2="1200" y2="520" /> {/* 60° S */}

          {/* Longitude lines */}
          <line x1="150" y1="0" x2="150" y2="600" />  {/* 135° W */}
          <line x1="300" y1="0" x2="300" y2="600" />  {/* 90° W */}
          <line x1="450" y1="0" x2="450" y2="600" />  {/* 45° W */}
          <line x1="600" y1="0" x2="600" y2="600" stroke="rgba(212,149,106,0.16)" strokeDasharray="6 6" />  {/* Prime Meridian (0°) */}
          <line x1="750" y1="0" x2="750" y2="600" />  {/* 45° E */}
          <line x1="900" y1="0" x2="900" y2="600" />  {/* 90° E */}
          <line x1="1050" y1="0" x2="1050" y2="600" /> {/* 135° E */}
        </g>

        {/* ── Coordinate Labels ── */}
        <g fill="rgba(180,140,100,0.28)" fontSize="8.5" fontFamily="monospace" letterSpacing="0.1em">
          <text x="12" y="84">60° N</text>
          <text x="12" y="184">30° N</text>
          <text x="12" y="304">00° EQUATOR</text>
          <text x="12" y="424">30° S</text>
          <text x="606" y="588">0° MERIDIAN</text>
          <text x="852" y="588">75° E (INDIA)</text>
          <text x="340" y="588">75° W (AMERICAS)</text>
        </g>

        {/* ── Continent Outlines & Fills (Stylized Equirectangular) ── */}
        <g
          fill="url(#continentGradient)"
          stroke="rgba(212,149,106,0.22)"
          strokeWidth="1.1"
          strokeLinejoin="round"
        >
          {/* North America */}
          <path d="M120 70 L170 50 L220 55 L260 70 L310 60 L360 85 L370 120 L350 140 L380 160 L350 190 L330 180 L310 210 L280 230 L270 280 L250 270 L230 240 L190 220 L160 170 L130 140 L110 100 Z" />
          {/* Greenland */}
          <path d="M420 40 L480 35 L500 70 L470 105 L430 95 L415 65 Z" />
          {/* Caribbean / Florida accent */}
          <path d="M340 220 Q350 230 365 240 L355 245 Z" />

          {/* South America */}
          <path d="M290 280 L340 285 L380 310 L410 350 L390 410 L360 470 L340 520 L320 530 L310 490 L300 420 L280 350 L270 310 Z" />

          {/* Europe */}
          <path d="M570 140 L600 110 L630 110 L650 90 L680 95 L690 130 L660 150 L640 180 L610 185 L580 180 L560 160 Z" />
          {/* Scandinavia */}
          <path d="M620 90 L640 45 L670 50 L660 90 L640 100 Z" />
          {/* United Kingdom & Ireland (distinct islands) */}
          <path d="M572 115 L582 105 L590 115 L586 135 L576 138 Z" fill="rgba(255,200,120,0.12)" stroke="rgba(255,200,120,0.4)" strokeWidth="1.2" />
          <path d="M558 120 L566 115 L568 128 L560 132 Z" fill="rgba(255,200,120,0.12)" stroke="rgba(255,200,120,0.4)" strokeWidth="1.2" />

          {/* Africa */}
          <path d="M560 195 L630 190 L680 230 L730 280 L710 350 L680 430 L640 470 L600 450 L560 370 L530 290 L530 220 Z" />
          {/* Madagascar */}
          <path d="M730 380 L745 375 L740 430 L725 435 Z" />

          {/* Asia & Middle East */}
          <path d="M690 130 L740 100 L810 80 L880 75 L960 85 L1020 110 L1040 160 L990 180 L960 220 L920 230 L890 280 L850 310 L820 280 L790 270 L750 240 L720 220 L680 190 Z" />
          
          {/* India Subcontinent (Distinct, prominent silhouette) */}
          <path
            d="M815 220 L860 215 L885 240 L880 270 L850 330 L825 290 L810 260 Z"
            fill="rgba(255,200,120,0.14)"
            stroke="rgba(255,200,120,0.5)"
            strokeWidth="1.4"
          />
          {/* Sri Lanka */}
          <circle cx="855" cy="342" r="3" fill="rgba(255,200,120,0.25)" />

          {/* Japan & Southeast Asia */}
          <path d="M1020 180 L1035 170 L1045 210 L1030 230 Z" />
          <path d="M920 280 L950 300 L960 350 L930 370 L910 320 Z" />
          <path d="M960 360 L1010 370 L1030 400 L980 410 Z" />

          {/* Australia */}
          <path
            d="M1020 420 L1080 400 L1130 420 L1150 470 L1130 520 L1070 530 L1020 490 L1005 450 Z"
            fill="rgba(255,200,120,0.12)"
            stroke="rgba(255,200,120,0.4)"
            strokeWidth="1.2"
          />
          {/* New Zealand */}
          <path d="M1165 510 L1180 500 L1185 540 L1170 550 Z" />
        </g>

        {/* ── GEODESIC FLIGHT ARCS (From Dahod HQ to Study Destinations) ── */}
        <g fill="none">
          {/* HQ: Dahod, Gujarat, India (847, 224) */}

          {/* Arc 1: Dahod (847, 224) -> London, UK (580, 128) */}
          <path
            d="M847 224 Q710 80 580 128"
            stroke="url(#flightArcGold)"
            strokeWidth="1.8"
            strokeDasharray="6 4"
            className="flight-path flight-path-1"
          />

          {/* Arc 2: Dahod (847, 224) -> Dublin, Ireland (564, 122) */}
          <path
            d="M847 224 Q700 70 564 122"
            stroke="url(#flightArcGold)"
            strokeWidth="1.5"
            strokeDasharray="5 5"
            className="flight-path flight-path-2"
          />

          {/* Arc 3: Dahod (847, 224) -> Frankfurt, Germany (629, 133) */}
          <path
            d="M847 224 Q735 95 629 133"
            stroke="url(#flightArcGold)"
            strokeWidth="1.6"
            strokeDasharray="6 4"
            className="flight-path flight-path-3"
          />

          {/* Arc 4: Dahod (847, 224) -> Toronto, Canada (340, 155) */}
          <path
            d="M847 224 Q570 30 340 155"
            stroke="url(#flightArcGold)"
            strokeWidth="1.7"
            strokeDasharray="7 5"
            className="flight-path flight-path-4"
          />

          {/* Arc 5: Dahod (847, 224) -> New York, USA (353, 164) */}
          <path
            d="M847 224 Q580 45 353 164"
            stroke="url(#flightArcGold)"
            strokeWidth="1.6"
            strokeDasharray="6 5"
            className="flight-path flight-path-5"
          />

          {/* Arc 6: Dahod (847, 224) -> Sydney, Australia (1110, 460) */}
          <path
            d="M847 224 Q980 320 1110 460"
            stroke="url(#flightArcGold)"
            strokeWidth="1.8"
            strokeDasharray="6 4"
            className="flight-path flight-path-6"
          />
        </g>

        {/* ── Pulsing Animated Beacons on Global Hubs ── */}
        {/* 1. HQ - Dahod, India (Origin) */}
        <g transform="translate(847, 224)">
          <circle r="14" fill="rgba(255,180,60,0.12)" className="beacon-ping" />
          <circle r="7" fill="rgba(255,180,60,0.3)" />
          <circle r="3.5" fill="#FFE082" filter="url(#hubGlow)" />
          <text x="10" y="4" fill="#FFE082" fontSize="9" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.08em">
            HQ · DAHOD
          </text>
        </g>

        {/* 2. London, UK */}
        <g transform="translate(580, 128)">
          <circle r="10" fill="rgba(212,149,106,0.15)" className="beacon-ping" />
          <circle r="5" fill="rgba(212,149,106,0.4)" />
          <circle r="2.8" fill="#FDBA74" filter="url(#hubGlow)" />
          <text x="-8" y="-9" fill="rgba(255,230,200,0.85)" fontSize="8" fontWeight="600" fontFamily="sans-serif">
            LONDON · UK
          </text>
        </g>

        {/* 3. Dublin, Ireland */}
        <g transform="translate(564, 122)">
          <circle r="3" fill="rgba(212,149,106,0.4)" />
          <circle r="1.8" fill="#FDBA74" />
          <text x="-48" y="-2" fill="rgba(255,230,200,0.75)" fontSize="7" fontFamily="sans-serif">
            DUBLIN
          </text>
        </g>

        {/* 4. Frankfurt / Germany */}
        <g transform="translate(629, 133)">
          <circle r="9" fill="rgba(212,149,106,0.15)" className="beacon-ping" />
          <circle r="4.5" fill="rgba(212,149,106,0.4)" />
          <circle r="2.5" fill="#FDBA74" filter="url(#hubGlow)" />
          <text x="8" y="12" fill="rgba(255,230,200,0.8)" fontSize="8" fontWeight="600" fontFamily="sans-serif">
            FRANKFURT · DE
          </text>
        </g>

        {/* 5. Toronto, Canada */}
        <g transform="translate(340, 155)">
          <circle r="11" fill="rgba(212,149,106,0.15)" className="beacon-ping" />
          <circle r="5" fill="rgba(212,149,106,0.4)" />
          <circle r="2.8" fill="#FDBA74" filter="url(#hubGlow)" />
          <text x="-64" y="-8" fill="rgba(255,230,200,0.85)" fontSize="8" fontWeight="600" fontFamily="sans-serif">
            TORONTO · CA
          </text>
        </g>

        {/* 6. New York, USA */}
        <g transform="translate(353, 164)">
          <circle r="9" fill="rgba(212,149,106,0.15)" className="beacon-ping" />
          <circle r="4.5" fill="rgba(212,149,106,0.4)" />
          <circle r="2.5" fill="#FDBA74" filter="url(#hubGlow)" />
          <text x="8" y="14" fill="rgba(255,230,200,0.85)" fontSize="8" fontWeight="600" fontFamily="sans-serif">
            NEW YORK · US
          </text>
        </g>

        {/* 7. Sydney, Australia */}
        <g transform="translate(1110, 460)">
          <circle r="12" fill="rgba(212,149,106,0.15)" className="beacon-ping" />
          <circle r="5.5" fill="rgba(212,149,106,0.4)" />
          <circle r="3" fill="#FDBA74" filter="url(#hubGlow)" />
          <text x="-76" y="16" fill="rgba(255,230,200,0.85)" fontSize="8" fontWeight="600" fontFamily="sans-serif">
            SYDNEY · AU
          </text>
        </g>

        {/* ── Antique Modern Cartographic Compass Rose (Top-Left) ── */}
        <g transform="translate(90, 85)" opacity="0.32">
          {/* Compass Rings */}
          <circle cx="0" cy="0" r="32" stroke="rgba(212,149,106,0.4)" strokeWidth="0.8" fill="none" />
          <circle cx="0" cy="0" r="28" stroke="rgba(212,149,106,0.25)" strokeWidth="0.5" strokeDasharray="2 3" fill="none" />
          <circle cx="0" cy="0" r="14" stroke="rgba(212,149,106,0.3)" strokeWidth="0.6" fill="none" />

          {/* North, South, East, West pointers */}
          <polygon points="0,-28 4,-8 0,-2 -4,-8" fill="#FDBA74" opacity="0.9" />
          <polygon points="0,28 3,8 0,2 -3,8" fill="rgba(212,149,106,0.4)" />
          <polygon points="28,0 8,3 2,0 8,-3" fill="rgba(212,149,106,0.4)" />
          <polygon points="-28,0 -8,3 -2,0 -8,-3" fill="rgba(212,149,106,0.4)" />

          {/* Diagonal ticks */}
          <line x1="-16" y1="-16" x2="16" y2="16" stroke="rgba(212,149,106,0.3)" strokeWidth="0.6" />
          <line x1="-16" y1="16" x2="16" y2="-16" stroke="rgba(212,149,106,0.3)" strokeWidth="0.6" />

          <text x="-3" y="-32" fill="#FFE082" fontSize="7" fontWeight="bold" fontFamily="serif">N</text>
          <text x="-2" y="38" fill="rgba(212,149,106,0.6)" fontSize="6" fontFamily="serif">S</text>
          <text x="32" y="2" fill="rgba(212,149,106,0.6)" fontSize="6" fontFamily="serif">E</text>
          <text x="-39" y="2" fill="rgba(212,149,106,0.6)" fontSize="6" fontFamily="serif">W</text>
        </g>
      </svg>

      {/* Radial vignette overlay to keep center login card readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(13,9,6,0.68) 0%, rgba(8,6,4,0.88) 60%, rgba(4,3,2,0.97) 100%)",
        }}
      />

      {/* Flight animation keyframes */}
      <style>{`
        @keyframes flightDash {
          0% {
            stroke-dashoffset: 80;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .flight-path {
          animation: flightDash 18s linear infinite;
        }
        .flight-path-1 { animation-duration: 16s; }
        .flight-path-2 { animation-duration: 20s; }
        .flight-path-3 { animation-duration: 18s; }
        .flight-path-4 { animation-duration: 24s; }
        .flight-path-5 { animation-duration: 22s; }
        .flight-path-6 { animation-duration: 26s; }

        @keyframes beaconPulse {
          0% {
            r: 4;
            opacity: 0.8;
          }
          70% {
            r: 16;
            opacity: 0;
          }
          100% {
            r: 18;
            opacity: 0;
          }
        }
        .beacon-ping {
          animation: beaconPulse 2.8s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }
      `}</style>
    </div>
  );
}
