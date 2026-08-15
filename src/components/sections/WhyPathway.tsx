import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { UserCheck, Lightbulb, MapPin, CheckCircle2 } from "lucide-react";

const REASONS = [
  {
    title: "Personalised Guidance",
    description: "Every student's academic journey is different.",
    icon: <UserCheck className="w-8 h-8 text-gold" />,
  },
  {
    title: "Clear Counselling",
    description: "Understand your options before making important decisions.",
    icon: <Lightbulb className="w-8 h-8 text-gold" />,
  },
  {
    title: "End-to-End Assistance",
    description: "Support across admissions, documentation, visas and travel-related services.",
    icon: <CheckCircle2 className="w-8 h-8 text-gold" />,
  },
  {
    title: "Local Accessibility",
    description: "A counselling centre based in Dahod for students and families who want accessible guidance.",
    icon: <MapPin className="w-8 h-8 text-gold" />,
  },
];

export function WhyPathway() {
  return (
    <section id="why-pathway" className="py-24 bg-navy text-white">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="WHY CHOOSE US"
          title={<span className="text-white">Why Students Choose Pathway</span>}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {REASONS.map((reason, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-white/5 rounded-sm border border-white/10 hover:bg-white/10 transition-colors">
              <div className="mb-6 w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                {reason.icon}
              </div>
              <h4 className="font-serif font-bold text-xl mb-3 text-ivory">
                {reason.title}
              </h4>
              <p className="text-ivory/70 text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
