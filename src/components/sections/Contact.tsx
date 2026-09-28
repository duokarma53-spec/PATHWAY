"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight, Lock, CheckCircle2, ChevronDown,
  Phone, MessageCircle, MapPin, Clock, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";

// ── Supabase client (public anon key — safe for browser) ────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dhfuflpfgmgfipchitpq.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZnVmbHBmZ21nZmlwY2hpdHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTgwMTIsImV4cCI6MjEwNjA5NDAxMn0.aUQtsiG6sSQtNBOYx84o4mvA6jcrrTlINymq4QkMrk0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Shared UI components ────────────────────────────────────────────────────
type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    isTextArea?: boolean;
  };

function CustomInput({ label, isTextArea, className, required, ...props }: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(Boolean(props.value));
  }, [props.value]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e as React.FocusEvent<HTMLInputElement & HTMLTextAreaElement>);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    if (props.onBlur) props.onBlur(e as React.FocusEvent<HTMLInputElement & HTMLTextAreaElement>);
  };

  const active = isFocused || hasValue;

  return (
    <div className={cn("relative w-full group", isTextArea ? "h-[120px]" : "h-[56px]", className)}>
      <label
        className={cn(
          "absolute left-0 pointer-events-none font-sans transition-all duration-300 ease-out z-10",
          active
            ? "top-1 text-[11px] text-navy/70 font-bold uppercase tracking-widest"
            : isTextArea
              ? "top-4 text-[15px] text-navy/40"
              : "top-1/2 -translate-y-1/2 text-[15px] text-navy/40"
        )}
      >
        {label} {required && "*"}
      </label>

      {isTextArea ? (
        <textarea
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          onFocus={handleFocus as React.FocusEventHandler<HTMLTextAreaElement>}
          onBlur={handleBlur as React.FocusEventHandler<HTMLTextAreaElement>}
          className="w-full h-full bg-transparent border-none outline-none font-sans text-[15px] leading-[1.4] text-navy pt-8 resize-none placeholder:text-transparent focus:placeholder:text-navy/20 transition-all"
        />
      ) : (
        <input
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          onFocus={handleFocus as React.FocusEventHandler<HTMLInputElement>}
          onBlur={handleBlur as React.FocusEventHandler<HTMLInputElement>}
          className="w-full h-full bg-transparent border-none outline-none font-sans text-[15px] leading-[1.4] text-navy placeholder:text-transparent focus:placeholder:text-navy/20 transition-all"
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-navy/10" />
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold origin-left transition-transform duration-300 ease-out",
          isFocused ? "scale-x-100" : "scale-x-0"
        )}
      />
    </div>
  );
}

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  required?: boolean;
}

function CustomSelect({ label, value, onChange, options, required }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const active = isOpen || value;
  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  return (
    <div className="relative w-full h-[56px] group" ref={dropdownRef}>
      <label
        className={cn(
          "absolute left-0 pointer-events-none font-sans transition-all duration-300 ease-out z-10",
          active
            ? "top-1 text-[11px] text-navy/70 font-bold uppercase tracking-widest"
            : "top-1/2 -translate-y-1/2 text-[15px] text-navy/40"
        )}
      >
        {label} {required && "*"}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full flex items-center justify-between bg-transparent border-none outline-none font-sans text-[15px] text-navy"
      >
        <span className={cn("transition-opacity", value ? "opacity-100" : "opacity-0")}>
          {selectedLabel}
        </span>
        <ChevronDown
          size={15}
          className={cn("text-navy/40 transition-transform duration-300 mr-1", isOpen && "rotate-180")}
        />
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-navy/10" />
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold origin-left transition-transform duration-300 ease-out",
          isOpen ? "scale-x-100" : "scale-x-0"
        )}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_8px_32px_-8px_rgba(11,31,51,0.15)] border border-navy/5 overflow-y-auto max-h-[250px] z-50 py-1.5 custom-scrollbar"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-5 py-3 font-sans text-sm transition-colors",
                  value === option.value
                    ? "bg-navy/5 text-navy font-bold"
                    : "text-navy/70 hover:bg-navy/5 hover:text-navy"
                )}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300",
          step >= 1 ? "bg-gold text-navy" : "bg-navy/5 text-navy/40"
        )}>1</div>
        <span className={cn("text-[11px] uppercase tracking-widest font-bold transition-colors", step === 1 ? "text-gold" : "text-navy/30")}>About You</span>
      </div>
      <div className="flex-1 h-[1px] bg-navy/10 max-w-[40px]" />
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300",
          step >= 2 ? "bg-gold text-navy" : "bg-navy/5 text-navy/40"
        )}>2</div>
        <span className={cn("text-[11px] uppercase tracking-widest font-bold transition-colors", step === 2 ? "text-gold" : "text-navy/30")}>Your Plans</span>
      </div>
    </div>
  );
}

// ── Options ─────────────────────────────────────────────────────────────────
const QUALIFICATION_OPTIONS = [
  { value: "10th", label: "10th (SSC)" },
  { value: "12th", label: "12th (HSC)" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" },
  { value: "other", label: "Other" },
];

const DESTINATION_OPTIONS = [
  { value: "UK",        label: "🇬🇧 United Kingdom" },
  { value: "Canada",    label: "🇨🇦 Canada" },
  { value: "Australia", label: "🇦🇺 Australia" },
  { value: "USA",       label: "🇺🇸 United States" },
  { value: "Ireland",   label: "🇮🇪 Ireland" },
  { value: "Germany",   label: "🇩🇪 Germany" },
  { value: "New Zealand",label: "🇳🇿 New Zealand" },
  { value: "Dubai/UAE", label: "🇦🇪 Dubai / UAE" },
  { value: "Not decided", label: "Not decided yet — need guidance" },
];

const INTAKE_OPTIONS = [
  { value: "Jan 2026",  label: "January 2026" },
  { value: "Sep 2026",  label: "September 2026" },
  { value: "Jan 2027",  label: "January 2027" },
  { value: "Sep 2027",  label: "September 2027" },
  { value: "flexible",  label: "Flexible / Not sure" },
];

const SOURCE_OPTIONS = [
  { value: "Google",       label: "Google Search" },
  { value: "Instagram",    label: "Instagram" },
  { value: "Facebook",     label: "Facebook" },
  { value: "WhatsApp",     label: "WhatsApp" },
  { value: "Referral",     label: "Friend / Family referral" },
  { value: "Walk-in",      label: "Walked into the office" },
  { value: "Education Fair",label: "Education Fair / Event" },
  { value: "Other",        label: "Other" },
];

// ── Main Component ───────────────────────────────────────────────────────────
export function Contact() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Step 1 — identity
    full_name: "",
    phone: "",
    email: "",
    qualification: "",
    // Step 2 — study plans
    destination: "",
    course: "",
    intake: "",
    source: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Map user-friendly form sources to database-compliant values
    const SOURCE_MAPPING: Record<string, string> = {
      "Google": "Google Search / SEO",
      "Instagram": "Instagram / Social",
      "Facebook": "Instagram / Social",
      "WhatsApp": "Website Inquiry",
      "Referral": "Direct Referral",
      "Walk-in": "Walk-in",
      "Education Fair": "Education Fair",
      "Other": "Website Inquiry",
    };

    // Standardize destination countries for consistent CRM filtering
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

    const cleanDigits = (formData.phone || "").replace(/\D/g, "");
    const safeEmail = (formData.email && formData.email.trim())
      ? formData.email.trim()
      : `${cleanDigits || "student" + Date.now()}@pathway-lead.com`;

    const newLeadPayload = {
      full_name:     formData.full_name.trim(),
      phone:         formData.phone.trim(),
      email:         safeEmail,
      qualification: formData.qualification || null,
      destination:   DEST_MAPPING[formData.destination] || formData.destination || null,
      course:        formData.course?.trim() || null,
      intake:        formData.intake || null,
      lead_source:   SOURCE_MAPPING[formData.source] || "Website Inquiry",
      message:       formData.message?.trim() || null,
      status:        "new",
      country:       "India",
    };

    try {
      const { data: insertedData, error: supabaseError } = await supabase
        .from("leads")
        .insert([newLeadPayload])
        .select();

      if (supabaseError) {
        console.error("Supabase insert error:", supabaseError);
        setError("Unable to submit inquiry right now. Please check your details or call our office directly.");
        setIsSubmitting(false);
        return;
      }

      const confirmedLead = (insertedData && insertedData[0]) ? insertedData[0] : newLeadPayload;

      // Broadcast across browser tabs to instantly notify Admin CRM
      try {
        if (typeof window !== "undefined") {
          const bc = new BroadcastChannel("pathway_leads_channel");
          bc.postMessage({ type: "NEW_LEAD", lead: confirmedLead });
          const existing = JSON.parse(localStorage.getItem("pathway_local_leads") || "[]");
          localStorage.setItem("pathway_local_leads", JSON.stringify([confirmedLead, ...existing]));
        }
      } catch (bcErr) {
        // ignore broadcast error
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      console.error("Form submission error:", err);
      const msg = err instanceof Error ? err.message : "Submission failed. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-14 md:py-24 bg-[#F7F5EF] relative">
      {/* Gold geometric accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border border-gold/10" />
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full border border-gold/10" />
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-px h-64 bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden lg:block" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-[1280px] relative z-10">

        {/* Mobile quick-contact strip */}
        <div className="flex md:hidden gap-3 mb-8">
          <a href="tel:+917506284722" className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-navy/10 text-navy text-sm font-medium bg-white/40 backdrop-blur-md active:bg-white/60 transition-colors">
            <Phone size={16} className="text-gold" /> Call Us
          </a>
          <a href="https://wa.me/917506284722" target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-sm font-medium backdrop-blur-md active:bg-[#25D366]/20 transition-colors">
            <MessageCircle size={16} /> WhatsApp
          </a>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">

          {/* Left info column */}
          <div className="w-full lg:w-[38%] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Consultation</span>
                <div className="flex-1 h-[1px] bg-gold/40 max-w-[60px]" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl lg:leading-[1.1] text-navy font-bold mb-5">
                Your next chapter starts with a conversation.
              </h2>
              <p className="font-sans text-navy/60 leading-relaxed mb-10 max-w-sm text-sm md:text-base">
                Tell us what you&apos;re looking for. Our counsellors will help you find the right path for your academic journey.
              </p>
            </div>

            <div className="hidden md:flex flex-col gap-4">
              <a href="tel:+917506284722" className="group flex items-center gap-4 p-4 rounded-2xl border border-navy/5 bg-white/40 backdrop-blur-md hover:bg-white/60 hover:border-gold/30 transition-all duration-300 shadow-[0_4px_20px_-10px_rgba(11,31,51,0.05)]">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                  <Phone size={16} className="text-gold" />
                </div>
                <div>
                  <p className="text-[10px] text-navy/50 uppercase tracking-widest font-bold mb-0.5">Call Us</p>
                  <p className="text-navy font-bold text-sm">+91 75062 84722</p>
                </div>
                <ArrowUpRight size={14} className="ml-auto text-navy/30 group-hover:text-gold group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </a>

              <a href="https://wa.me/917506284722" target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-2xl border border-navy/5 bg-white/40 backdrop-blur-md hover:bg-[#25D366]/5 hover:border-[#25D366]/30 transition-all duration-300 shadow-[0_4px_20px_-10px_rgba(11,31,51,0.05)]">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
                  <MessageCircle size={16} className="text-[#25D366]" />
                </div>
                <div>
                  <p className="text-[10px] text-navy/50 uppercase tracking-widest font-bold mb-0.5">WhatsApp</p>
                  <p className="text-navy font-bold text-sm">Quick Response</p>
                </div>
                <ArrowUpRight size={14} className="ml-auto text-navy/30 group-hover:text-[#25D366] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl border border-navy/5 bg-white/40 backdrop-blur-md shadow-[0_4px_20px_-10px_rgba(11,31,51,0.05)]">
                <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-navy/60" />
                </div>
                <div>
                  <p className="text-[10px] text-navy/50 uppercase tracking-widest font-bold mb-0.5">Office Hours</p>
                  <p className="text-navy/80 font-medium text-sm">Mon – Sat, 9 AM – 6 PM</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl border border-navy/5 bg-white/40 backdrop-blur-md shadow-[0_4px_20px_-10px_rgba(11,31,51,0.05)]">
                <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-navy/60" />
                </div>
                <div>
                  <p className="text-[10px] text-navy/50 uppercase tracking-widest font-bold mb-0.5">Location</p>
                  <p className="text-navy/80 font-medium text-sm">Dahod, Gujarat</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="w-full lg:w-[62%] relative">
            <div className="bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/60 p-5 sm:p-7 md:p-12 relative overflow-visible shadow-[0_8px_32px_-8px_rgba(11,31,51,0.08)]">

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="form-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Header */}
                    <div className="mb-8">
                      <span className="inline-block text-[10px] font-bold tracking-widest text-navy mb-4 uppercase bg-gold/20 px-3 py-1.5 rounded-full border border-gold/30">
                        Free Consultation
                      </span>
                      <h3 className="font-serif text-2xl md:text-3xl text-navy font-bold mb-2">
                        Tell us about your plans.
                      </h3>
                      <p className="font-sans text-sm text-navy/60">
                        Takes 60 seconds — we&apos;ll do the rest.
                      </p>
                    </div>

                    <StepIndicator step={step} />

                    <AnimatePresence mode="wait">
                      {/* ── STEP 1: Identity ── */}
                      {step === 1 && (
                        <motion.form
                          key="step1"
                          onSubmit={handleStep1Submit}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-10">
                            <CustomInput
                              label="Full Name"
                              name="full_name"
                              value={formData.full_name}
                              onChange={handleChange}
                              required
                            />
                            <CustomInput
                              label="Mobile / WhatsApp Number"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                            />
                            <CustomInput
                              label="Email Address (optional)"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                            <CustomSelect
                              label="Current Qualification"
                              value={formData.qualification}
                              onChange={handleSelectChange("qualification")}
                              options={QUALIFICATION_OPTIONS}
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={!formData.full_name || !formData.phone || !formData.qualification}
                            className="group relative w-full flex items-center justify-center gap-3 bg-gold text-navy h-[54px] px-10 rounded-2xl text-[15px] font-sans font-bold transition-all duration-300 hover:shadow-[0_8px_30px_rgba(200,169,107,0.35)] hover:-translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Continue
                            <ArrowUpRight size={18} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                          </button>
                        </motion.form>
                      )}

                      {/* ── STEP 2: Study Plans ── */}
                      {step === 2 && (
                        <motion.form
                          key="step2"
                          onSubmit={handleFinalSubmit}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-8">
                            <CustomSelect
                              label="Where do you want to study?"
                              value={formData.destination}
                              onChange={handleSelectChange("destination")}
                              options={DESTINATION_OPTIONS}
                              required
                            />
                            <CustomSelect
                              label="Intended Intake"
                              value={formData.intake}
                              onChange={handleSelectChange("intake")}
                              options={INTAKE_OPTIONS}
                            />
                            <CustomInput
                              label="Course / Field of Study"
                              name="course"
                              value={formData.course}
                              onChange={handleChange}
                              className="md:col-span-2"
                            />
                            <CustomSelect
                              label="How did you hear about us?"
                              value={formData.source}
                              onChange={handleSelectChange("source")}
                              options={SOURCE_OPTIONS}
                              required
                            />
                            <CustomInput
                              label="Anything else for us to know?"
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              isTextArea
                              rows={3}
                              className="md:col-span-1"
                            />
                          </div>

                          {/* Error message */}
                          {error && (
                            <p className="text-sm text-red-600 mb-4 text-center font-medium">{error}</p>
                          )}

                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="flex-1 h-[54px] rounded-2xl border border-navy/10 text-navy/70 text-[14px] font-bold hover:bg-navy/5 hover:text-navy transition-all bg-white/50"
                            >
                              ← Back
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmitting || !formData.destination || !formData.source}
                              className="flex-[2] group relative flex items-center justify-center gap-3 bg-navy text-ivory h-[54px] px-10 rounded-2xl text-[15px] font-sans font-bold transition-all duration-300 hover:shadow-lg hover:bg-midnight hover:-translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 size={18} className="animate-spin" />
                                  Sending…
                                </>
                              ) : (
                                <>
                                  Start My Journey
                                  <ArrowUpRight size={18} className="text-gold transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                                </>
                              )}
                            </button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {/* Footer */}
                    <div className="flex items-center gap-2 text-navy/40 mt-6 pt-5 border-t border-navy/5">
                      <Lock size={11} />
                      <span className="text-[11px] font-sans">
                        Your information is kept private and used only to respond to your enquiry.
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  /* ── Success State ── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center text-center py-16"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                      className="w-20 h-20 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center mb-8 shadow-lg"
                    >
                      <CheckCircle2 size={36} className="text-navy" strokeWidth={2} />
                    </motion.div>

                    <h3 className="font-serif text-3xl md:text-4xl text-navy font-bold mb-4">
                      You&apos;re on your way.
                    </h3>
                    <p className="font-sans text-navy/60 mb-10 max-w-sm text-sm leading-relaxed">
                      Thank you, <strong>{formData.full_name.split(" ")[0]}</strong>! A Pathway counsellor will review your details and reach out within 24 hours.
                    </p>

                    <a
                      href={`https://wa.me/917506284722?text=Hi%2C%20I%27m%20${encodeURIComponent(formData.full_name)}%20and%20I%20just%20submitted%20the%20consultation%20form%20on%20your%20website.%20I%27m%20interested%20in%20studying%20in%20${encodeURIComponent(formData.destination || "a%20new%20country")}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] font-bold px-6 py-3 rounded-full text-sm hover:bg-[#25D366]/20 transition-colors mb-6 shadow-sm"
                    >
                      <MessageCircle size={16} />
                      Continue on WhatsApp
                    </a>

                    <button
                      onClick={() => {
                        setFormData({ full_name: "", phone: "", email: "", qualification: "", destination: "", course: "", intake: "", source: "", message: "" });
                        setIsSubmitted(false);
                        setStep(1);
                      }}
                      className="text-[11px] font-sans font-bold text-navy/40 uppercase tracking-widest hover:text-navy/80 transition-colors"
                    >
                      Back to form
                    </button>
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
