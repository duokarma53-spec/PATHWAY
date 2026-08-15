import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Quote } from "lucide-react";

// Placeholder data - to be replaced with real testimonials later
const TESTIMONIALS = [
  {
    text: "[Real Student Testimonial - Share your experience about the admission process and guidance received from Pathway Consultancy.]",
    author: "[Student Name]",
    detail: "[Course / University]",
  },
  {
    text: "[Real Student Testimonial - Mention how Pathway helped you clarify your career goals or assisted with your overseas education.]",
    author: "[Student Name]",
    detail: "[Course / University]",
  },
  {
    text: "[Real Student Testimonial - Describe the support you received for medical admission or visa processing.]",
    author: "[Student Name]",
    detail: "[Course / University]",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-sage/5">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="STUDENT SUCCESS"
          title="Stories That Matter"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {TESTIMONIALS.map((testimonial, i) => (
            <div key={i} className="bg-white p-8 rounded-sm shadow-sm border border-navy/5 relative">
              <Quote className="w-10 h-10 text-gold/20 absolute top-6 right-6" />
              <p className="text-midnight/80 italic leading-relaxed relative z-10 mb-8 min-h-[6rem]">
                &quot;{testimonial.text}&quot;
              </p>
              <div className="border-t border-navy/5 pt-4">
                <h4 className="font-serif font-bold text-navy text-lg">{testimonial.author}</h4>
                <p className="text-sm text-sage font-medium">{testimonial.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
