"use client";

import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Compass, 
  Globe2, 
  FileText, 
  BookOpen, 
  Plane 
} from "lucide-react";

const SERVICES = [
  {
    id: "01",
    title: "Admission Guidance",
    description: "Guidance for engineering, medical and general university admissions, including pathways beyond standard ACPC channels.",
    icon: <GraduationCap className="w-6 h-6 text-navy" />
  },
  {
    id: "02",
    title: "Career & Course Counselling",
    description: "Help students understand suitable courses, academic pathways and career directions.",
    icon: <Compass className="w-6 h-6 text-navy" />
  },
  {
    id: "03",
    title: "Overseas Education",
    description: "Guidance for students planning to study internationally, including medical education opportunities abroad.",
    icon: <Globe2 className="w-6 h-6 text-navy" />
  },
  {
    id: "04",
    title: "Visa & Documentation Support",
    description: "Assistance with student visas, visitor visas and the documentation process.",
    icon: <FileText className="w-6 h-6 text-navy" />
  },
  {
    id: "05",
    title: "Exam Assistance",
    description: "Support for relevant on-demand examinations and admission requirements.",
    icon: <BookOpen className="w-6 h-6 text-navy" />
  },
  {
    id: "06",
    title: "Travel & Ticket Support",
    description: "Assistance with ticket bookings and travel preparation.",
    icon: <Plane className="w-6 h-6 text-navy" />
  }
];

export function Services() {
  return (
    <section id="services" className="py-16 md:py-24 bg-ivory">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="OUR SERVICES"
          title="How We Help You Move Forward"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group bg-white p-8 rounded-sm border border-navy/5 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Subtle hover background effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full translate-x-16 -translate-y-16 group-hover:translate-x-0 group-hover:-translate-y-0 transition-transform duration-500 ease-out" />
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="w-12 h-12 rounded-sm bg-sage/20 flex items-center justify-center">
                  {service.icon}
                </div>
                <span className="text-xl font-serif text-sage font-medium">{service.id}</span>
              </div>
              
              <h3 className="text-xl font-serif font-bold text-navy mb-3 relative z-10 group-hover:text-gold transition-colors">
                {service.title}
              </h3>
              
              <p className="text-midnight/70 text-sm leading-relaxed mb-6 relative z-10 min-h-[4rem]">
                {service.description}
              </p>
              
              <div className="mt-auto relative z-10 flex items-center text-navy font-medium text-sm group-hover:text-gold transition-colors">
                Learn more
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
