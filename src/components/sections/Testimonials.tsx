"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dhfuflpfgmgfipchitpq.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZnVmbHBmZ21nZmlwY2hpdHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTgwMTIsImV4cCI6MjEwNjA5NDAxMn0.aUQtsiG6sSQtNBOYx84o4mvA6jcrrTlINymq4QkMrk0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Static fallbacks shown while loading or if DB has no testimonials yet
const FALLBACK_TESTIMONIALS = [
  {
    id: "fb-1",
    title: "Pathway made what felt overwhelming feel completely manageable.",
    subtitle: "Riya M. • BSc Computer Science, United Kingdom",
  },
  {
    id: "fb-2",
    title: "The personalized attention I received was incredible. They helped me find the right fit.",
    subtitle: "Rahul S. • MSc Engineering, Canada",
  },
  {
    id: "fb-3",
    title: "Navigating medical admissions abroad seemed impossible until I found Pathway.",
    subtitle: "Ayesha K. • MBBS, Kyrgyzstan",
  },
];

interface Testimonial {
  id: string;
  title: string;
  subtitle: string;
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const { data, error } = await supabase
          .from("website_content")
          .select("id, title, subtitle")
          .eq("category", "Testimonial")
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setTestimonials(data);
        } else {
          // Use fallbacks if no DB testimonials yet
          setTestimonials(FALLBACK_TESTIMONIALS);
        }
      } catch {
        setTestimonials(FALLBACK_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  const list = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev === list.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? list.length - 1 : prev - 1));
  };

  // Reset index if testimonials change and index is out of range
  useEffect(() => {
    if (currentIndex >= list.length) setCurrentIndex(0);
  }, [list, currentIndex]);

  const current = list[currentIndex];

  return (
    <section className="py-24 md:py-32 bg-ivory relative border-t border-navy/5">
      <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Header Area */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-[1px] bg-gold" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/60">
                  Student Success
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-navy leading-[1.1] tracking-tight mb-8">
                Stories that <br />
                <span className="italic text-midnight/60">matter.</span>
              </h2>
            </div>

            {/* Navigation Controls - Desktop */}
            <div className="hidden lg:flex items-center gap-4 mt-auto">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all duration-300 group"
                aria-label="Previous testimonial"
              >
                <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all duration-300 group"
                aria-label="Next testimonial"
              >
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Testimonial Content */}
          <div className="lg:col-span-8 relative min-h-[300px] flex items-center">
            <span className="absolute -top-12 -left-8 text-[120px] font-serif text-navy/5 select-none leading-none">
              &ldquo;
            </span>

            {loading ? (
              <div className="flex items-center gap-3 text-navy/30">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-sm font-sans">Loading testimonials…</span>
              </div>
            ) : current ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="relative z-10 w-full"
                >
                  <h3 className="font-serif text-2xl md:text-4xl text-navy leading-snug mb-10 md:mb-16">
                    &ldquo;{current.title}&rdquo;
                  </h3>

                  {current.subtitle && (
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-full bg-navy/10 border border-navy/5 flex items-center justify-center overflow-hidden shrink-0">
                        <span className="font-sans font-medium text-navy/50 text-sm">
                          {current.subtitle.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-sm tracking-widest uppercase text-navy">
                          {current.subtitle.split("•")[0]?.trim()}
                        </h4>
                        {current.subtitle.includes("•") && (
                          <p className="text-midnight/60 font-sans text-xs mt-1">
                            {current.subtitle.split("•").slice(1).join("•").trim()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Dots indicator */}
                  {list.length > 1 && (
                    <div className="flex items-center gap-1.5 mt-8">
                      {list.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          className={`rounded-full transition-all duration-300 ${
                            idx === currentIndex
                              ? "w-5 h-1.5 bg-navy"
                              : "w-1.5 h-1.5 bg-navy/20 hover:bg-navy/40"
                          }`}
                          aria-label={`Go to testimonial ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : null}
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex lg:hidden items-center gap-4 -mt-4">
            <button
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all duration-300"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all duration-300"
            >
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
