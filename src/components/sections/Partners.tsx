import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Structure for university logos to be added later
const PARTNERS = [
  { name: "University Placeholder 1", country: "Country", logo: null },
  { name: "University Placeholder 2", country: "Country", logo: null },
  { name: "University Placeholder 3", country: "Country", logo: null },
  { name: "University Placeholder 4", country: "Country", logo: null },
  { name: "University Placeholder 5", country: "Country", logo: null },
  { name: "University Placeholder 6", country: "Country", logo: null },
];

export function Partners() {
  return (
    <section className="py-16 md:py-24 bg-white border-t border-navy/5">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="PARTNERSHIPS"
          title="Where Could Your Path Lead?"
          subtitle="We partner with established institutions to give you the best opportunities. (Logos to be updated based on verified partnerships)"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mt-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {PARTNERS.map((partner, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-4 aspect-[3/2] bg-ivory rounded-sm border border-navy/5">
              {partner.logo ? (
                <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-center">
                  <div className="w-10 h-10 bg-navy/10 rounded-full mx-auto mb-2" />
                  <span className="text-xs text-navy font-semibold">{partner.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
