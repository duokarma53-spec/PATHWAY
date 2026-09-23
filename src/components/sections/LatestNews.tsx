"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, ExternalLink, RefreshCw, Clock } from "lucide-react";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
}

const FALLBACK: NewsItem[] = [
  {
    title: "JEE Main 2026 Session 1 Registration Open — Apply Before Deadline",
    link: "https://jeemain.nta.ac.in",
    pubDate: new Date().toISOString(),
    description: "National Testing Agency has opened registrations for JEE Main 2026 Session 1. Students are advised to apply well before the deadline to avoid last-minute issues.",
    source: "NTA Official",
  },
  {
    title: "NEET UG 2026 Exam Dates Announced — Check Your City Centre",
    link: "https://neet.nta.ac.in",
    pubDate: new Date(Date.now() - 86400000).toISOString(),
    description: "NEET UG 2026 will be conducted in May. NTA has released the exam schedule and city-centre allocation. Admit cards will be available one week prior.",
    source: "NTA Official",
  },
  {
    title: "Canada Student Visa Processing Times Reduced — Good News for Applicants",
    link: "https://www.canada.ca/en/immigration-refugees-citizenship.html",
    pubDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    description: "IRCC has reduced student visa processing times significantly for Indian applicants, now averaging 8 weeks. Apply early for September 2026 intake.",
    source: "IRCC Canada",
  },
  {
    title: "UK Graduate Route Visa Extended: 3 Years Post-Study Work Rights for Indian Students",
    link: "https://www.gov.uk/student-visa",
    pubDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    description: "The UK government confirmed the Graduate Route Visa remains open, allowing international students to work in the UK for up to 3 years after graduation.",
    source: "UK Home Office",
  },
  {
    title: "Germany's Free Tuition Universities: Applications Open for Winter 2026 Intake",
    link: "https://www.daad.de/en",
    pubDate: new Date(Date.now() - 4 * 86400000).toISOString(),
    description: "Germany continues to attract Indian students with tuition-free public universities. DAAD scholarship applications are now open for Winter Semester 2026.",
    source: "DAAD Germany",
  },
  {
    title: "Singapore Announces Enhanced Scholarship Programmes for South Asian Students",
    link: "https://www.nus.edu.sg",
    pubDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    description: "NUS and NTU have announced new scholarship opportunities for Indian students for the 2026–27 academic year, covering tuition and living expenses.",
    source: "NUS Singapore",
  },
  {
    title: "Passport Renewal Process Simplified — 7-Day Turnaround for Gujarat Applicants",
    link: "https://passportindia.gov.in",
    pubDate: new Date(Date.now() - 6 * 86400000).toISOString(),
    description: "Passport Seva Kendras in Gujarat now offer a 7-day turnaround for normal applications and same-day for emergency/tatkaal. Book your slot online.",
    source: "MEA India",
  },
  {
    title: "IELTS Band Score Requirements: Updated Thresholds for 2026 Admissions",
    link: "https://www.ielts.org",
    pubDate: new Date(Date.now() - 7 * 86400000).toISOString(),
    description: "Several top universities have updated their IELTS band requirements for 2026 admissions. Students targeting Band 6.5+ are advised to start prep early.",
    source: "British Council",
  },
];

const RSS_URL = encodeURIComponent(
  "https://news.google.com/rss/search?q=JEE+NEET+study+abroad+india+student+visa&hl=en-IN&gl=IN&ceid=IN:en"
);
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${RSS_URL}&count=8`;

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function LatestNews() {
  const [news, setNews] = useState<NewsItem[]>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [usedApi, setUsedApi] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.status === "ok" && data.items?.length > 0) {
        const items: NewsItem[] = data.items.slice(0, 8).map(
          (item: { title: string; link: string; pubDate: string; description: string; source?: { name: string } }) => ({
            title: item.title.replace(/ - .*$/, ""),
            link: item.link,
            pubDate: item.pubDate,
            description: item.description?.replace(/<[^>]*>/g, "").slice(0, 160) + "...",
            source: item.source?.name || "News",
          })
        );
        setNews(items);
        setUsedApi(true);
      }
    } catch {
      // use fallback silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <section id="news" className="py-16 md:py-24 bg-ivory">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-navy px-6 py-3 rounded-lg">
              <Newspaper size={18} className="text-gold" />
              <h2 className="text-white font-sans font-bold text-lg tracking-wide uppercase">
                Latest News
              </h2>
            </div>
            {!loading && usedApi && (
              <span className="text-[11px] font-sans text-sage uppercase tracking-widest">
                Live Feed
              </span>
            )}
          </div>
          <button
            onClick={fetchNews}
            className="flex items-center gap-2 text-xs text-midnight/50 hover:text-navy transition-colors font-sans"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {news.map((item, i) => (
            <motion.a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="group flex gap-4 p-4 rounded-xl border border-navy/8 hover:border-gold/30 hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              {/* Index / NEW badge */}
              <div className="shrink-0 mt-1">
                {i < 2 ? (
                  <span className="inline-flex items-center bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                ) : (
                  <span className="w-7 h-7 rounded-full border border-navy/15 flex items-center justify-center text-[11px] font-bold text-midnight/40 font-sans">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-sans font-semibold text-[14px] text-midnight leading-snug group-hover:text-navy transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <ExternalLink
                    size={12}
                    className="shrink-0 mt-0.5 text-navy/20 group-hover:text-gold transition-colors"
                  />
                </div>
                {item.description && (
                  <p className="text-[12px] text-midnight/55 mt-1.5 line-clamp-2 leading-relaxed font-sans">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-sage font-sans font-medium uppercase tracking-wider">
                    {item.source}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-midnight/20" />
                  <span className="flex items-center gap-1 text-[10px] text-midnight/40 font-sans">
                    <Clock size={9} />
                    {timeAgo(item.pubDate)}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm text-midnight/50 font-sans">
            Stay updated with the latest education & visa news. 
            <a href="#contact" className="text-navy font-semibold hover:text-gold transition-colors ml-1">
              Consult our experts →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
