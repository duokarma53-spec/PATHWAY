import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  {
    num: "01",
    title: "Understand",
    description: "Discuss your academic background, interests and goals.",
  },
  {
    num: "02",
    title: "Explore",
    description: "Identify suitable courses, universities and pathways.",
  },
  {
    num: "03",
    title: "Choose",
    description: "Shortlist the options that align with your goals.",
  },
  {
    num: "04",
    title: "Apply",
    description: "Receive guidance through the admission process and documentation.",
  },
  {
    num: "05",
    title: "Prepare",
    description: "Get support with visa, travel and final preparation where applicable.",
  },
  {
    num: "06",
    title: "Move Forward",
    description: "Begin the next chapter of your education journey.",
  },
];

export function Process() {
  return (
    <section className="py-16 md:py-24 bg-ivory">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="HOW IT WORKS"
          title="Your Journey, Step by Step."
        />

        <div className="mt-20 relative max-w-5xl mx-auto">
          {/* Desktop horizontal connecting line */}
          <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-0.5 bg-navy/10 z-0" />

          {/* Mobile vertical connecting line */}
          <div className="block md:hidden absolute top-0 bottom-0 left-[23px] w-0.5 bg-navy/10 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-4 relative z-10">
            {STEPS.map((step, i) => (
              <div key={i} className="flex flex-row md:flex-col items-start md:items-center relative">
                {/* Number Circle */}
                <div className="w-12 h-12 shrink-0 rounded-full bg-white border border-gold shadow-sm flex items-center justify-center font-serif text-lg font-bold text-navy mb-0 md:mb-6 z-10 relative">
                  {step.num}
                </div>
                
                {/* Content */}
                <div className="ml-6 md:ml-0 text-left md:text-center mt-1 md:mt-0">
                  <h4 className="font-serif font-bold text-navy text-xl mb-2">{step.title}</h4>
                  <p className="text-midnight/70 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
