"use client";

import React, { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "What courses does Pathway provide counselling for?",
    answer: "We provide comprehensive counselling for a wide range of higher education programs including Engineering, Medical, Management, Science, and Commerce streams.",
  },
  {
    question: "Does Pathway help with medical admissions?",
    answer: "Yes, we provide dedicated guidance for medical admissions, including both standard domestic pathways and international medical education opportunities like the International Higher School of Medicine (IHSM) in Kyrgyzstan.",
  },
  {
    question: "Does Pathway help students study abroad?",
    answer: "Absolutely. We offer complete guidance for overseas education, helping you shortlist universities, understand course requirements, and navigate the application process for countries like the UK, Canada, Australia, USA, and European nations.",
  },
  {
    question: "Does Pathway assist with student visas?",
    answer: "Yes, our end-to-end assistance includes support with documentation and processing for student and visitor visas to help ensure a smooth transition to your destination.",
  },
  {
    question: "Can Pathway help with engineering admissions?",
    answer: "Yes, we guide students through engineering admissions, including options beyond the standard ACPC channels, helping you find the right institute for your profile.",
  },
  {
    question: "Do I need to visit the office for counselling?",
    answer: "While we recommend visiting our counselling centre in Dahod for a personalized experience, we also offer initial consultations over phone or WhatsApp for your convenience.",
  },
  {
    question: "Does Pathway help with ticket bookings?",
    answer: "Yes, as part of our comprehensive support for students travelling abroad or out of state, we provide assistance with travel preparation and ticket bookings.",
  },
  {
    question: "How can I contact Pathway?",
    answer: "You can reach us via phone (+91 75062 84722 / +91 94091 61562), email (pathwayeduconsultancy53@gmail.com), or by visiting our office at 1st Floor, Yusuf Corner, Godi Road, Dahod.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 bg-ivory">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <SectionHeading
          eyebrow="COMMON QUESTIONS"
          title="Frequently Asked Questions"
        />

        <div className="mt-16 space-y-4">
          {FAQS.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-sm border border-navy/5 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                suppressHydrationWarning
              >
                <span className="font-serif font-bold text-lg text-navy pr-8">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={cn(
                    "w-5 h-5 text-gold shrink-0 transition-transform duration-300",
                    openIndex === index ? "rotate-180" : "rotate-0"
                  )} 
                />
              </button>
              
              <div 
                className={cn(
                  "px-6 overflow-hidden transition-all duration-300 ease-in-out",
                  openIndex === index ? "max-h-48 pb-5 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <p className="text-midnight/70 leading-relaxed text-sm">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
