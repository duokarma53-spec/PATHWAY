"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight, Lock, CheckCircle2, ChevronDown,
  Phone, MessageCircle, MapPin, Clock, Loader2,
  Sparkles, GraduationCap, Globe, BookOpen, ShieldCheck, Check
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";

// ── Supabase client ─────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dhfuflpfgmgfipchitpq.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZnVmbHBmZ21nZmlwY2hpdHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTgwMTIsImV4cCI6MjEwNjA5NDAxMn0.aUQtsiG6sSQtNBOYx84o4mvA6jcrrTlINymq4QkMrk0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Option Constants ────────────────────────────────────────────────────────
const QUALIFICATION_OPTIONS = [
  { value: "12th", label: "12th Standard (HSC / CBSE / ISC)" },
  { value: "bachelors", label: "Bachelor's Degree (Pursuing / Completed)" },
  { value: "diploma", label: "Diploma / Polytechnic" },
  { value: "masters", label: "Master's Degree (Postgraduate)" },
  { value: "10th", label: "10th Standard (SSC)" },
  { value: "other", label: "Other / Working Professional" },
];

const DESTINATION_OPTIONS = [
  { value: "UK", label: "United Kingdom", flag: "🇬🇧" },
  { value: "Canada", label: "Canada", flag: "🇨🇦" },
  { value: "Australia", label: "Australia", flag: "🇦🇺" },
  { value: "USA", label: "United States", flag: "🇺🇸" },
  { value: "Germany", label: "Germany", flag: "🇩🇪" },
  { value: "Ireland", label: "Ireland", flag: "🇮🇪" },
  { value: "New Zealand", label: "New Zealand", flag: "🇳🇿" },
  { value: "Dubai/UAE", label: "Dubai / UAE", flag: "🇦🇪" },
  { value: "Not decided", label: "Not decided (Need Guidance)", flag: "🌐" },
];

const STUDY_LEVEL_OPTIONS = [
  { value: "masters", label: "Master's (Postgraduate)" },
  { value: "bachelors", label: "Bachelor's (Undergraduate)" },
  { value: "pg_diploma", label: "PG Diploma / Co-op" },
  { value: "phd", label: "Doctorate / PhD" },
];

const INTAKE_OPTIONS = [
  { value: "Sep 2026", label: "September 2026 (Fall)" },
  { value: "Jan 2026", label: "January 2026 (Spring)" },
  { value: "Sep 2027", label: "September 2027" },
  { value: "Jan 2027", label: "January 2027" },
  { value: "flexible", label: "Flexible / Need Advice" },
];

const BUDGET_OPTIONS = [
  { value: "under_15L", label: "Under ₹15 Lakhs / year" },
  { value: "15L_25L", label: "₹15 Lakhs – ₹25 Lakhs / year" },
  { value: "25L_40L", label: "₹25 Lakhs – ₹40 Lakhs / year" },
  { value: "above_40L", label: "₹40 Lakhs+ / year" },
  { value: "scholarship", label: "Need 100% Scholarship" },
];

const ENGLISH_TEST_OPTIONS = [
  { value: "taken", label: "Already Taken (IELTS / PTE / TOEFL)" },
  { value: "preparing", label: "Currently Preparing / Booked" },
  { value: "need_coaching", label: "Need Coaching & Study Material" },
  { value: "waiver_desired", label: "Seeking English Test Waiver (MOI)" },
];

const SOURCE_OPTIONS = [
  { value: "Google", label: "Google Search" },
  { value: "Instagram", label: "Instagram" },
  { value: "WhatsApp", label: "WhatsApp" },
  { value: "Referral", label: "Friend / Family Recommendation" },
  { value: "Walk-in", label: "Visited Dahod Office" },
  { value: "Education Fair", label: "Education Fair / Seminar" },
  { value: "Other", label: "Other" },
];

// ── Ergonomic Input Field Component ─────────────────────────────────────────
interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

function FormField({ id, label, required, hint, error, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5 text-left", className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-navy/80 flex items-center gap-1">
          {label}
          {required && <span className="text-[#C8A96B] font-black">*</span>}
        </label>
        {hint && <span className="text-[11px] text-navy/40 font-medium">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-[11px] font-semibold text-rose-600 mt-1">{error}</p>}
    </div>
  );
}

export function Contact() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State matching full schema
  const [formData, setFormData] = useState({
    // Step 1: Personal & Academic Profile
    full_name: "",
    phone: "",
    email: "",
    city: "",
    qualification: "",
    grade: "",
    institution: "",
    // Step 2: Study Abroad Aspirations & Preferences
    destination: "UK",
    study_level: "masters",
    course: "",
    intake: "Sep 2026",
    budget: "15L_25L",
    english_test: "preparing",
    source: "Google",
    message: "",
  });

  const [honeypot, setHoneypot] = useState("");
  const [formStartedAt, setFormStartedAt] = useState<number | null>(null);

  const startTracking = () => {
    if (!formStartedAt) setFormStartedAt(Date.now());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    startTracking();
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectField = (field: string, val: string) => {
    startTracking();
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  // Step 1 validation
  const isStep1Valid = Boolean(
    formData.full_name.trim().length >= 2 &&
    formData.phone.trim().replace(/\D/g, "").length >= 10 &&
    formData.qualification &&
    formData.city.trim().length >= 2
  );

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep1Valid) {
      setErrorMessage("Please complete your Name, Phone Number, City, and Current Qualification to proceed.");
      return;
    }
    setErrorMessage(null);
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Bot defense: Honeypot check
    if (honeypot.trim() !== "") {
      console.warn("Honeypot trap triggered.");
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 600);
      return;
    }

    // Velocity check
    const elapsedSeconds = formStartedAt ? (Date.now() - formStartedAt) / 1000 : 0;
    if (elapsedSeconds > 0 && elapsedSeconds < 2) {
      setErrorMessage("Please take a moment to review your details and submit again.");
      setIsSubmitting(false);
      return;
    }

    const sanitize = (val: string | null | undefined) => {
      if (!val) return "";
      return val.replace(/<[^>]*>?/gm, "").trim();
    };

    const cleanDigits = formData.phone.replace(/\D/g, "");
    const safeEmail = formData.email.trim()
      ? sanitize(formData.email)
      : `${cleanDigits || "student" + Date.now()}@pathway-lead.com`;

    // Map destination for clean analytics
    const DEST_MAPPING: Record<string, string> = {
      "UK": "United Kingdom",
      "USA": "United States",
      "Canada": "Canada",
      "Australia": "Australia",
      "Ireland": "Ireland",
      "Germany": "Germany",
      "New Zealand": "New Zealand",
      "Dubai/UAE": "Dubai / UAE",
      "Not decided": "Not decided",
    };

    const SOURCE_MAPPING: Record<string, string> = {
      "Google": "Google Search / SEO",
      "Instagram": "Instagram / Social",
      "WhatsApp": "Website Inquiry",
      "Referral": "Direct Referral",
      "Walk-in": "Walk-in",
      "Education Fair": "Education Fair",
      "Other": "Website Inquiry",
    };

    const studyLevelDisplay = STUDY_LEVEL_OPTIONS.find((s) => s.value === formData.study_level)?.label || formData.study_level;
    const budgetDisplay = BUDGET_OPTIONS.find((b) => b.value === formData.budget)?.label || formData.budget;
    const englishTestDisplay = ENGLISH_TEST_OPTIONS.find((e) => e.value === formData.english_test)?.label || formData.english_test;

    // Build structured JSON metadata for notes column
    const structuredNotes = JSON.stringify({
      study_level: studyLevelDisplay,
      budget: budgetDisplay,
      english_test: englishTestDisplay,
      institution: sanitize(formData.institution),
      city: sanitize(formData.city),
      grade: sanitize(formData.grade),
      user_message: sanitize(formData.message),
    });

    const leadPayload = {
      full_name: sanitize(formData.full_name),
      phone: sanitize(formData.phone),
      email: safeEmail,
      city: sanitize(formData.city) || null,
      country: "India",
      qualification: formData.qualification || null,
      grade: sanitize(formData.grade) || null,
      destination: DEST_MAPPING[formData.destination] || formData.destination || null,
      course: sanitize(formData.course) || studyLevelDisplay || "General Counselling",
      intake: formData.intake || null,
      lead_source: SOURCE_MAPPING[formData.source] || "Website Inquiry",
      message: sanitize(formData.message) || `Interested in ${studyLevelDisplay} in ${DEST_MAPPING[formData.destination] || formData.destination} for ${formData.intake}.`,
      notes: structuredNotes,
      status: "new",
    };

    try {
      const { data, error } = await supabase.from("leads").insert([leadPayload]).select();

      if (error) {
        console.error("Supabase insert error:", error);
        setErrorMessage("Unable to save consultation inquiry right now. Please call or WhatsApp our office directly.");
        setIsSubmitting(false);
        return;
      }

      const confirmedLead = data && data[0] ? data[0] : leadPayload;

      // Broadcast event across browser tabs to instantly alert CRM
      try {
        if (typeof window !== "undefined") {
          const bc = new BroadcastChannel("pathway_leads_channel");
          bc.postMessage({ type: "NEW_LEAD", lead: confirmedLead });
          const existing = JSON.parse(localStorage.getItem("pathway_local_leads") || "[]");
          localStorage.setItem("pathway_local_leads", JSON.stringify([confirmedLead, ...existing]));
          window.dispatchEvent(new CustomEvent("pathway_new_lead", { detail: confirmedLead }));
        }
      } catch (e) {
        // broadcast silent fallback
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      console.error("Submission failed:", err);
      setErrorMessage("Something went wrong. Please check your connection or contact us via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-28 bg-[#F7F5EF] relative overflow-hidden">
      {/* Decorative Gold Rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full border border-[#C8A96B]/15" />
        <div className="absolute -top-12 -right-12 w-[420px] h-[420px] rounded-full border border-[#C8A96B]/15" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C8A96B]/25 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-[1280px] relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          
          {/* ── Left Column: Value Proposition & Direct Contact ── */}
          <div className="w-full lg:w-[38%] space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#C8A96B] bg-[#C8A96B]/15 px-3.5 py-1.5 rounded-full border border-[#C8A96B]/30">
                <Sparkles size={13} className="text-[#C8A96B]" /> Complimentary Consultation
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-navy font-bold leading-tight">
                Your future abroad starts with one conversation.
              </h2>
              <p className="font-sans text-sm md:text-base text-navy/70 leading-relaxed">
                Connect with our certified admissions mentors. We provide unbiased university matching, profile evaluation, scholarship discovery, and comprehensive visa assistance.
              </p>
            </div>

            {/* Value Guarantees */}
            <div className="p-4 rounded-2xl bg-white/70 border border-navy/10 space-y-2 text-xs text-navy/80">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>100% Free Profile Assessment & Course Shortlisting</span>
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>No Hidden Fees • Ethical Consultancy Process</span>
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Certified Counselors with 98% Visa Success Rate</span>
              </div>
            </div>

            {/* Quick Contact Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 pt-2">
              <a
                href="tel:+917506284722"
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/80 border border-navy/10 hover:border-[#C8A96B]/60 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#C8A96B]/15 flex items-center justify-center text-[#C8A96B] group-hover:scale-110 transition-transform shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-navy/50">Call Admissions Direct</p>
                  <p className="text-navy font-bold text-sm tracking-wide">+91 75062 84722</p>
                </div>
              </a>

              <a
                href="https://wa.me/919409161562?text=Hello%20Pathway%20Consultancy%2C%20I%20would%20like%20to%20book%20a%20study%20abroad%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/80 border border-navy/10 hover:border-emerald-500/50 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shrink-0">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-navy/50">WhatsApp Official</p>
                  <p className="text-navy font-bold text-sm tracking-wide">+91 94091 61562</p>
                </div>
              </a>

              <a
                href="https://www.instagram.com/pathwayeduconsultancy?stkn=YnY3M2R0MzFwNzk="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/80 border border-navy/10 hover:border-pink-500/50 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-500/15 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform shrink-0">
                  <InstagramIcon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-navy/50">Instagram Official</p>
                  <p className="text-navy font-bold text-sm tracking-wide truncate group-hover:text-pink-600 transition-colors">@pathwayeduconsultancy</p>
                </div>
              </a>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/60 border border-navy/5 text-xs text-navy/70">
                <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/60 shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-navy/50">Working Hours</p>
                  <p className="text-navy font-semibold text-xs">Mon – Sat, 9:00 AM – 6:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/60 border border-navy/5 text-xs text-navy/70">
                <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/60 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-navy/50">Consultancy Headquarters</p>
                  <p className="text-navy font-semibold text-xs">Dahod, Gujarat (Serving Students Across India)</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Ergonomic Multi-Step Form ── */}
          <div className="w-full lg:w-[62%]">
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-navy/10 shadow-[0_20px_60px_-15px_rgba(11,31,51,0.09)] p-6 sm:p-10 md:p-12 relative">

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="form-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Header */}
                    <div className="mb-6 border-b border-navy/10 pb-5">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-[#C8A96B] uppercase tracking-widest flex items-center gap-1.5">
                          <BookOpen size={14} /> Student Consultation Intake
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-navy/5 text-navy/60">
                          {step === 1 ? "Step 1 of 2 (50%)" : "Step 2 of 2 (Almost Done!)"}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl md:text-3xl font-bold text-navy">
                        {step === 1 ? "Tell us about your academic profile." : "Where do you envision studying?"}
                      </h3>
                      <p className="text-xs md:text-sm text-navy/60 mt-1">
                        {step === 1
                          ? "We need your contact and basic background to pair you with the right regional counselor."
                          : "Select your preferred country, intake, and budget so we can prepare custom university options."}
                      </p>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-navy/5 rounded-full mt-4 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#C8A96B] to-navy rounded-full transition-all duration-500 ease-out"
                          style={{ width: step === 1 ? "50%" : "100%" }}
                        />
                      </div>
                    </div>

                    {/* Step indicator buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className={cn(
                          "flex items-center gap-2.5 p-3 rounded-2xl text-left border text-xs font-bold transition-all",
                          step === 1
                            ? "bg-[#C8A96B]/15 border-[#C8A96B] text-navy shadow-sm"
                            : "bg-navy/5 border-transparent text-navy/60 hover:bg-navy/10"
                        )}
                      >
                        <span className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0",
                          step === 1 ? "bg-navy text-white" : isStep1Valid ? "bg-emerald-600 text-white" : "bg-navy/20 text-navy"
                        )}>
                          {isStep1Valid && step === 2 ? <Check size={12} strokeWidth={3} /> : "1"}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate">Profile & Contact</p>
                          <p className="text-[10px] font-normal text-navy/50">Identity & Education</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (isStep1Valid) setStep(2);
                          else setErrorMessage("Please complete your required details in Step 1 first.");
                        }}
                        className={cn(
                          "flex items-center gap-2.5 p-3 rounded-2xl text-left border text-xs font-bold transition-all",
                          step === 2
                            ? "bg-[#C8A96B]/15 border-[#C8A96B] text-navy shadow-sm"
                            : "bg-navy/5 border-transparent text-navy/60 hover:bg-navy/10"
                        )}
                      >
                        <span className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0",
                          step === 2 ? "bg-navy text-white" : "bg-navy/20 text-navy"
                        )}>
                          2
                        </span>
                        <div className="min-w-0">
                          <p className="truncate">Study Plans & Budget</p>
                          <p className="text-[10px] font-normal text-navy/50">Destination & Intake</p>
                        </div>
                      </button>
                    </div>

                    {/* Honeypot trap */}
                    <div className="hidden opacity-0 pointer-events-none absolute -left-[9999px]" aria-hidden="true" tabIndex={-1}>
                      <label htmlFor="sec_hp_token">Leave blank</label>
                      <input
                        id="sec_hp_token"
                        type="text"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <AnimatePresence mode="wait">
                      {/* ════════════ STEP 1: Academic Profile & Contact ════════════ */}
                      {step === 1 && (
                        <motion.form
                          key="step-1-form"
                          onSubmit={handleNextStep}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 15 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-5"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                            {/* Full Name */}
                            <FormField id="form_full_name" label="Full Name" required hint="As on passport">
                              <input
                                id="form_full_name"
                                name="full_name"
                                type="text"
                                required
                                value={formData.full_name}
                                onChange={handleInputChange}
                                placeholder="e.g. Moiz Dheela"
                                className="w-full h-12 px-4 rounded-xl border border-navy/20 bg-white font-sans text-sm text-navy placeholder:text-navy/35 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/30 transition-all"
                              />
                            </FormField>

                            {/* Phone Number */}
                            <FormField id="form_phone" label="Mobile / WhatsApp Number" required hint="For instant updates">
                              <div className="relative flex items-center">
                                <span className="absolute left-3 text-xs font-bold text-navy/60 pointer-events-none border-r border-navy/20 pr-2">
                                  🇮🇳 +91
                                </span>
                                <input
                                  id="form_phone"
                                  name="phone"
                                  type="tel"
                                  required
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  placeholder="98765 43210"
                                  className="w-full h-12 pl-20 pr-4 rounded-xl border border-navy/20 bg-white font-sans text-sm text-navy placeholder:text-navy/35 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/30 transition-all"
                                />
                              </div>
                            </FormField>

                            {/* Email Address */}
                            <FormField id="form_email" label="Email Address" hint="Optional but recommended">
                              <input
                                id="form_email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="name@example.com"
                                className="w-full h-12 px-4 rounded-xl border border-navy/20 bg-white font-sans text-sm text-navy placeholder:text-navy/35 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/30 transition-all"
                              />
                            </FormField>

                            {/* Current City */}
                            <FormField id="form_city" label="Current City / Town" required hint="Your hometown">
                              <input
                                id="form_city"
                                name="city"
                                type="text"
                                required
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="e.g. Dahod, Ahmedabad, Surat, Mumbai"
                                className="w-full h-12 px-4 rounded-xl border border-navy/20 bg-white font-sans text-sm text-navy placeholder:text-navy/35 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/30 transition-all"
                              />
                            </FormField>

                            {/* Qualification */}
                            <FormField id="form_qualification" label="Current / Highest Qualification" required>
                              <div className="relative">
                                <select
                                  id="form_qualification"
                                  name="qualification"
                                  required
                                  value={formData.qualification}
                                  onChange={handleInputChange}
                                  className="w-full h-12 px-4 pr-10 rounded-xl border border-navy/20 bg-white font-sans text-sm text-navy focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/30 appearance-none cursor-pointer transition-all"
                                >
                                  <option value="">Select your qualification...</option>
                                  {QUALIFICATION_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" />
                              </div>
                            </FormField>

                            {/* Percentage / CGPA */}
                            <FormField id="form_grade" label="Percentage / CGPA" hint="Optional">
                              <input
                                id="form_grade"
                                name="grade"
                                type="text"
                                value={formData.grade}
                                onChange={handleInputChange}
                                placeholder="e.g. 78% or 8.2 CGPA"
                                className="w-full h-12 px-4 rounded-xl border border-navy/20 bg-white font-sans text-sm text-navy placeholder:text-navy/35 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/30 transition-all"
                              />
                            </FormField>
                          </div>

                          {errorMessage && (
                            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
                              {errorMessage}
                            </div>
                          )}

                          <div className="pt-2">
                            <button
                              type="submit"
                              disabled={!isStep1Valid}
                              className="w-full h-13 px-8 rounded-2xl bg-navy text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#C8A96B] hover:text-navy shadow-md hover:shadow-xl active:scale-[0.99] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                              Continue to Study Plans & Preferences
                              <ArrowUpRight size={18} />
                            </button>
                          </div>
                        </motion.form>
                      )}

                      {/* ════════════ STEP 2: Study Abroad Aspirations ════════════ */}
                      {step === 2 && (
                        <motion.form
                          key="step-2-form"
                          onSubmit={handleFinalSubmit}
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-6"
                        >
                          {/* Destination Selection Chips */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-navy/80 flex items-center justify-between">
                              <span>Preferred Country Destination <span className="text-[#C8A96B]">*</span></span>
                              <span className="text-[11px] font-medium text-navy/40">Select primary choice</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {DESTINATION_OPTIONS.map((dest) => (
                                <button
                                  type="button"
                                  key={dest.value}
                                  onClick={() => handleSelectField("destination", dest.value)}
                                  className={cn(
                                    "flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition-all",
                                    formData.destination === dest.value
                                      ? "bg-navy text-white border-navy shadow-sm"
                                      : "bg-white border-navy/15 text-navy hover:border-[#C8A96B]/50 hover:bg-[#FDFBF7]"
                                  )}
                                >
                                  <span className="text-base">{dest.flag}</span>
                                  <span className="truncate">{dest.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                            {/* Study Level */}
                            <FormField id="form_study_level" label="Target Study Level" required>
                              <div className="relative">
                                <select
                                  id="form_study_level"
                                  name="study_level"
                                  value={formData.study_level}
                                  onChange={handleInputChange}
                                  className="w-full h-12 px-4 pr-10 rounded-xl border border-navy/20 bg-white font-sans text-sm text-navy focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/30 appearance-none cursor-pointer transition-all"
                                >
                                  {STUDY_LEVEL_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" />
                              </div>
                            </FormField>

                            {/* Program / Course of Interest */}
                            <FormField id="form_course" label="Program / Field of Interest" hint="e.g. IT, MBA, BioMed">
                              <input
                                id="form_course"
                                name="course"
                                type="text"
                                value={formData.course}
                                onChange={handleInputChange}
                                placeholder="e.g. Data Science, MBA, Engineering"
                                className="w-full h-12 px-4 rounded-xl border border-navy/20 bg-white font-sans text-sm text-navy placeholder:text-navy/35 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/30 transition-all"
                              />
                            </FormField>

                            {/* Target Intake */}
                            <FormField id="form_intake" label="Target Intake" required>
                              <div className="relative">
                                <select
                                  id="form_intake"
                                  name="intake"
                                  value={formData.intake}
                                  onChange={handleInputChange}
                                  className="w-full h-12 px-4 pr-10 rounded-xl border border-navy/20 bg-white font-sans text-sm text-navy focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/30 appearance-none cursor-pointer transition-all"
                                >
                                  {INTAKE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" />
                              </div>
                            </FormField>

                            {/* Annual Budget Range */}
                            <FormField id="form_budget" label="Approx. Annual Budget" required hint="Tuition & Living">
                              <div className="relative">
                                <select
                                  id="form_budget"
                                  name="budget"
                                  value={formData.budget}
                                  onChange={handleInputChange}
                                  className="w-full h-12 px-4 pr-10 rounded-xl border border-navy/20 bg-white font-sans text-sm text-navy focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/30 appearance-none cursor-pointer transition-all"
                                >
                                  {BUDGET_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" />
                              </div>
                            </FormField>

                            {/* English Proficiency */}
                            <FormField id="form_english_test" label="English Test Status" required>
                              <div className="relative">
                                <select
                                  id="form_english_test"
                                  name="english_test"
                                  value={formData.english_test}
                                  onChange={handleInputChange}
                                  className="w-full h-12 px-4 pr-10 rounded-xl border border-navy/20 bg-white font-sans text-sm text-navy focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/30 appearance-none cursor-pointer transition-all"
                                >
                                  {ENGLISH_TEST_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" />
                              </div>
                            </FormField>

                            {/* How did you hear about us */}
                            <FormField id="form_source" label="How did you find Pathway?" required>
                              <div className="relative">
                                <select
                                  id="form_source"
                                  name="source"
                                  value={formData.source}
                                  onChange={handleInputChange}
                                  className="w-full h-12 px-4 pr-10 rounded-xl border border-navy/20 bg-white font-sans text-sm text-navy focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/30 appearance-none cursor-pointer transition-all"
                                >
                                  {SOURCE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" />
                              </div>
                            </FormField>
                          </div>

                          {/* Message / Special Requests */}
                          <FormField id="form_message" label="Questions or Target Universities (Optional)" hint="Anything specific for our team">
                            <textarea
                              id="form_message"
                              name="message"
                              rows={3}
                              value={formData.message}
                              onChange={handleInputChange}
                              placeholder="e.g. Interested in scholarships, need assistance with IELTS preparation, or want to know top 5 universities for my profile..."
                              className="w-full p-4 rounded-xl border border-navy/20 bg-white font-sans text-sm text-navy placeholder:text-navy/35 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/30 resize-none transition-all"
                            />
                          </FormField>

                          {errorMessage && (
                            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
                              {errorMessage}
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="h-13 px-6 rounded-2xl border border-navy/20 bg-white text-navy font-bold text-sm hover:bg-navy/5 transition-all cursor-pointer"
                            >
                              ← Back to Profile
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmitting || !formData.destination}
                              className="flex-1 h-13 px-8 rounded-2xl bg-[#C8A96B] text-navy font-bold text-sm flex items-center justify-center gap-2 hover:bg-navy hover:text-white shadow-lg hover:shadow-xl active:scale-[0.99] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 size={18} className="animate-spin" />
                                  <span>Submitting Consultation Request...</span>
                                </>
                              ) : (
                                <>
                                  <span>Confirm & Book Free Consultation</span>
                                  <ArrowUpRight size={18} />
                                </>
                              )}
                            </button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {/* Privacy Guarantee Footer */}
                    <div className="flex items-center gap-2 text-navy/40 mt-8 pt-5 border-t border-navy/10 text-xs">
                      <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                      <span>
                        Your information is strictly confidential and protected. Never shared with unauthorized third parties.
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  /* ── Success Screen ── */
                  <motion.div
                    key="success-view"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="py-12 px-4 text-center flex flex-col items-center justify-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center mb-6 shadow-md shadow-emerald-500/10">
                      <CheckCircle2 size={40} className="text-emerald-600" />
                    </div>

                    <span className="text-xs font-bold uppercase tracking-widest text-[#C8A96B] bg-[#C8A96B]/15 px-3.5 py-1 rounded-full mb-3">
                      Consultation Request Confirmed
                    </span>

                    <h3 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-3">
                      You&apos;re all set, {formData.full_name.split(" ")[0]}!
                    </h3>

                    <p className="text-sm text-navy/70 max-w-md mx-auto leading-relaxed mb-8">
                      Thank you for submitting your profile. A certified Pathway counselor is reviewing your preferences for <strong>{formData.destination}</strong> and will reach out to <strong>{formData.phone}</strong> within 24 hours.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                      <a
                        href={`https://wa.me/917506284722?text=Hi%2C%20I%20am%20${encodeURIComponent(formData.full_name)}%20from%20${encodeURIComponent(formData.city)}.%20I%20just%20submitted%20my%20profile%20for%20${encodeURIComponent(formData.destination)}%20(${encodeURIComponent(formData.intake)}).`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 h-12 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#1EBE5D] shadow-md transition-all"
                      >
                        <MessageCircle size={16} /> Connect Immediately on WhatsApp
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            full_name: "",
                            phone: "",
                            email: "",
                            city: "",
                            qualification: "",
                            grade: "",
                            institution: "",
                            destination: "UK",
                            study_level: "masters",
                            course: "",
                            intake: "Sep 2026",
                            budget: "15L_25L",
                            english_test: "preparing",
                            source: "Google",
                            message: "",
                          });
                          setIsSubmitted(false);
                          setStep(1);
                        }}
                        className="h-12 px-6 rounded-xl border border-navy/20 bg-white text-navy font-bold text-xs hover:bg-navy/5 transition-all"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
