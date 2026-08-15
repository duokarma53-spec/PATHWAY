"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Lock, CheckCircle2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  isTextArea?: boolean;
};

function CustomInput({ label, isTextArea, className, required, ...props }: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(Boolean(props.value));
  }, [props.value]);

  const handleFocus = (e: React.FocusEvent<any>) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<any>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    if (props.onBlur) props.onBlur(e);
  };

  const Component = isTextArea ? "textarea" : "input";
  const active = isFocused || hasValue;

  return (
    <div className={cn("relative w-full group", isTextArea ? "h-[130px]" : "h-[56px]", className)}>
      <label
        className={cn(
          "absolute left-0 pointer-events-none font-sans transition-all duration-300 ease-out z-10",
          active 
            ? "top-1 text-[12px] text-gold" 
            : isTextArea 
              ? "top-4 text-[16px] text-midnight/60" 
              : "top-1/2 -translate-y-1/2 text-[16px] text-midnight/60"
        )}
      >
        {label} {required && "*"}
      </label>
      
      <Component
        {...(props as any)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "w-full h-full bg-transparent border-none outline-none font-sans text-[16px] leading-[1.4] text-navy placeholder:text-transparent focus:placeholder:text-midnight/30 transition-all resize-none",
          isTextArea ? "pt-8" : ""
        )}
      />
      
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-navy/20" />
      
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
  options: string[];
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

  return (
    <div className="relative w-full h-[56px] group" ref={dropdownRef}>
      <label
        className={cn(
          "absolute left-0 pointer-events-none font-sans transition-all duration-300 ease-out z-10",
          active 
            ? "top-1 text-[12px] text-gold" 
            : "top-1/2 -translate-y-1/2 text-[16px] text-midnight/60"
        )}
      >
        {label} {required && "*"}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full flex items-center justify-between bg-transparent border-none outline-none font-sans text-[16px] text-navy"
      >
        <span className={cn("transition-opacity", value ? "opacity-100" : "opacity-0")}>
          {value || "Placeholder"}
        </span>
        <ChevronDown 
          size={16} 
          className={cn("text-midnight/50 transition-transform duration-300 mr-2.5", isOpen && "rotate-180")} 
        />
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-navy/20" />
      
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
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-navy/5 overflow-hidden z-50 py-2"
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-5 py-3 font-sans text-sm transition-colors",
                  value === option 
                    ? "bg-ivory text-gold font-medium" 
                    : "text-midnight hover:bg-ivory/50 hover:text-navy"
                )}
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    interest: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, interest: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const INTEREST_OPTIONS = [
    "Medical",
    "Engineering",
    "Higher Education",
    "Overseas Education",
    "Visa Assistance",
    "Career Counselling",
    "Other"
  ];

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-[1300px]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          <div className="w-full lg:w-[40%] flex flex-col pt-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold tracking-[0.2em] text-sage uppercase">01</span>
              <div className="w-8 h-[1px] bg-gold/50" />
              <span className="text-xs font-bold tracking-[0.2em] text-sage uppercase">Consultation</span>
            </div>
            
            <h2 className="font-serif text-4xl lg:text-5xl lg:leading-[1.1] text-navy font-bold mb-6">
              Your next chapter<br />starts with a conversation.
            </h2>
            
            <p className="font-sans text-midnight/70 leading-relaxed mb-12 max-w-md">
              Tell us a little about what you're looking for. Our counsellors will help you understand the right options for your academic journey.
            </p>
            
            <div className="relative rounded-[20px] overflow-hidden group h-[220px] lg:h-[400px] w-full">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" 
                alt="Student counselling"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent flex items-end p-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-widest text-gold mb-1 uppercase">
                    Pathway Education Consultancy
                  </span>
                  <span className="font-sans text-sm text-white/90">
                    Dahod, Gujarat
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[60%] flex flex-col justify-center">
            <div className="bg-ivory rounded-[24px] border border-navy/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] p-8 md:p-14 relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="mb-10">
                      <span className="inline-block text-[10px] font-bold tracking-widest text-gold mb-4 uppercase bg-white/50 px-3 py-1.5 rounded-full">
                        Free Consultation
                      </span>
                      <h3 className="font-serif text-3xl text-navy font-bold mb-3">
                        Tell us about your plans.
                      </h3>
                      <p className="font-sans text-sm text-midnight/60">
                        Complete a few details and we'll get in touch.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[40px] gap-y-[40px]">
                        <CustomInput
                          label="Full Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          required
                        />
                        <CustomInput
                          label="Phone Number"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 XXXXX XXXXX"
                          required
                        />
                        <CustomInput
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                        />
                        <CustomSelect
                          label="I'm Interested In"
                          value={formData.interest}
                          onChange={handleSelectChange}
                          options={INTEREST_OPTIONS}
                          required
                        />
                        <div className="md:col-span-2 mt-[2px] mb-[40px]">
                          <CustomInput
                            label="Your Message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell us what you're planning or what you'd like guidance with..."
                            isTextArea
                            rows={2}
                          />
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <button 
                          type="submit"
                          className="group relative w-full lg:w-auto flex items-center justify-center gap-3 bg-navy text-ivory h-[56px] px-10 rounded-[16px] text-[15px] font-sans font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px]"
                        >
                          Start My Journey
                          <ArrowUpRight 
                            size={18} 
                            className="text-gold transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" 
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-navy/5">
                        <div className="flex items-center gap-2 text-midnight/50">
                          <Lock size={12} />
                          <span className="text-[11px] font-sans">
                            Your information is used only to respond to your enquiry.
                          </span>
                        </div>
                        
                        <a 
                          href="https://wa.me/917506284722" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hidden md:flex items-center gap-1.5 text-[12px] font-sans font-medium text-navy hover:text-sage transition-colors group"
                        >
                          Prefer to talk? <span className="underline decoration-gold underline-offset-4 decoration-[1.5px]">WhatsApp</span>
                          <ArrowUpRight size={12} className="text-gold group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                      
                      {/* Mobile WhatsApp link */}
                      <div className="md:hidden flex justify-center pt-2">
                        <a 
                          href="https://wa.me/917506284722" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[13px] font-sans font-medium text-navy group"
                        >
                          Prefer to talk? <span className="underline decoration-gold underline-offset-4 decoration-[1.5px]">WhatsApp</span>
                          <ArrowUpRight size={12} className="text-gold" />
                        </a>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  // --- SUCCESS STATE ---
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center text-center py-20"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                      className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mb-6 text-sage"
                    >
                      <CheckCircle2 size={32} strokeWidth={2.5} />
                    </motion.div>
                    
                    <h3 className="font-serif text-4xl text-navy font-bold mb-4">
                      You're on your way.
                    </h3>
                    <p className="font-sans text-midnight/70 mb-10 max-w-sm">
                      Thank you. A Pathway counsellor will review your details and get in touch with you shortly.
                    </p>
                    
                    <button 
                      onClick={() => {
                        setFormData({ name: "", phone: "", email: "", interest: "", message: "" });
                        setIsSubmitted(false);
                      }}
                      className="text-sm font-sans font-bold text-navy uppercase tracking-widest hover:text-gold transition-colors flex items-center gap-2"
                    >
                      Back to Pathway
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
