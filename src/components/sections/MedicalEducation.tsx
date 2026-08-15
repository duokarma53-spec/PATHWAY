import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function MedicalEducation() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
          
          <div className="w-full lg:w-1/2">
            <SectionHeading
              align="left"
              eyebrow="MEDICAL ADMISSIONS"
              title="A Clearer Path to Medical Education"
            />
            
            <div className="mt-8 text-lg text-midnight/80 leading-relaxed font-sans space-y-6">
              <p>
                Navigating medical admissions requires careful planning and a clear understanding of the available opportunities. Pathway provides dedicated guidance for students exploring medical education options both within standard channels and internationally.
              </p>
              
              <div className="bg-ivory p-6 rounded-sm border-l-4 border-gold">
                <h4 className="font-serif font-bold text-navy text-xl mb-2">
                  International Medical Education
                </h4>
                <p className="text-midnight/70 text-base">
                  We assist students interested in pursuing their medical degrees abroad, featuring guidance for institutions such as the <strong>International Higher School of Medicine (IHSM), Kyrgyzstan</strong>. Our counselling focuses on providing factual information to help you make the right choice for your career.
                </p>
              </div>
            </div>
            
            <div className="mt-10">
              <Button href="#contact" variant="primary">
                Talk to a Medical Counsellor
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative">
            <div className="absolute inset-0 bg-navy/5 -z-10 translate-x-4 translate-y-4 rounded-sm" />
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173ff9e5eb3?q=80&w=2068&auto=format&fit=crop"
              alt="Medical students studying"
              className="w-full h-auto aspect-square lg:aspect-[4/3] object-cover rounded-sm shadow-lg"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
