import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function About() {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute -inset-4 bg-sage/10 -z-10 rounded-sm transform -rotate-3" />
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
              alt="Students in a counselling session"
              className="w-full h-auto aspect-[4/5] object-cover rounded-sm shadow-xl"
            />
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-1/2">
            <SectionHeading
              align="left"
              eyebrow="WHO WE ARE"
              title="Guidance that begins with understanding you."
            />
            
            <div className="mt-8 text-lg text-midnight/80 leading-relaxed font-sans space-y-6">
              <p>
                Pathway Education Consultancy is an education and career guidance centre in Dahod helping students make informed decisions about higher education, admissions and international study opportunities.
              </p>
              <ul className="space-y-3 font-medium text-navy">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                  Understanding the student&apos;s academic background
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                  Understanding career goals
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                  Exploring suitable courses
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                  Admission guidance
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                  Overseas education opportunities
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                  Visa and documentation support
                </li>
              </ul>
            </div>
            
            <div className="mt-10">
              <Button href="#contact" variant="primary">
                Meet Pathway
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
