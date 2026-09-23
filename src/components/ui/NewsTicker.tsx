"use client";

import React, { useEffect, useState, useRef } from "react";
import { Newspaper, RefreshCw } from "lucide-react";

interface NewsItem {
  title: string;
  link: string;
}

// Static fallback headlines relevant to education consultancy
const FALLBACK_NEWS: NewsItem[] = [
  { title: "JEE Main 2026 Session 1 Registration Open — Apply Before Deadline", link: "https://jeemain.nta.ac.in" },
  { title: "NEET UG 2026 Dates Announced by NTA — Check Official Schedule", link: "https://neet.nta.ac.in" },
  { title: "Canada Student Visa Processing Times Reduced to 8 Weeks", link: "https://www.canada.ca/en/immigration-refugees-citizenship.html" },
  { title: "UK Welcomes Indian Students: Post-Study Work Visa Extended to 3 Years", link: "https://www.gov.uk/student-visa" },
  { title: "IELTS Score Now Accepted for Over 11,000 Universities Worldwide", link: "https://www.ielts.org" },
  { title: "Germany Offers Free Tuition Public Universities — Applications Open for 2026", link: "https://www.daad.de/en" },
  { title: "Australia's Simplified Student Visa Process for Indian Applicants", link: "https://immi.homeaffairs.gov.au" },
  { title: "Singapore PR Pathway: How Indian Students Can Settle After Graduation", link: "https://www.ica.gov.sg" },
  { title: "MBBS Abroad: Top Countries for Indian Medical Students in 2026", link: "#" },
  { title: "Passport Seva Kendra Expands Services in Gujarat — Faster Renewals", link: "https://passportindia.gov.in" },
];

const RSS_URL = encodeURIComponent(
  "https://news.google.com/rss/search?q=JEE+NEET+study+abroad+india+student+visa+education&hl=en-IN&gl=IN&ceid=IN:en"
);
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${RSS_URL}&count=15`;

export function NewsTicker() {
  const news = FALLBACK_NEWS;
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Duplicate items so the marquee loops seamlessly
  const tickerItems = [...news, ...news];

  return (
    <div className="w-full bg-navy text-white text-xs font-sans h-9 flex items-center overflow-hidden border-b border-white/10 relative z-[51]">
      {/* Label */}
      <div className="shrink-0 flex items-center gap-2 bg-gold text-navy font-bold uppercase tracking-widest px-4 h-full whitespace-nowrap">
        <Newspaper size={12} strokeWidth={2.5} />
        <span className="hidden sm:inline">Latest News</span>
      </div>

      {/* Scrolling ticker */}
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={marqueeRef}
          className="flex items-center gap-0 whitespace-nowrap"
          style={{
            animation: `pathway-ticker ${tickerItems.length * 4}s linear infinite`,
          }}
        >
          {tickerItems.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 text-white/80 hover:text-gold transition-colors duration-200 shrink-0 border-r border-white/10 last:border-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
              {item.title}
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
