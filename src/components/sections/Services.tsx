"use client";

import React, { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  Compass, 
  Globe2, 
  FileText, 
  BookOpen, 
  Plane,
  X
} from "lucide-react";

const SERVICES = [
  {
    id: "01",
    title: "Admission Guidance",
    description: "Guidance for engineering, medical and general university admissions, including pathways beyond standard ACPC channels.",
    fullDetails: "We provide end-to-end support for university admissions across various disciplines. Our experts help you navigate complex admission criteria, prepare strong applications, and optimize your chances of acceptance in top-tier institutions.",
    icon: <GraduationCap className="w-6 h-6 text-navy" />
  },
  {
    id: "02",
    title: "Career & Course Counselling",
    description: "Help students understand suitable courses, academic pathways and career directions.",
    fullDetails: "Choosing the right career path is crucial. We offer personalized counseling sessions to evaluate your strengths, interests, and academic background, matching you with the ideal courses and long-term career opportunities.",
    icon: <Compass className="w-6 h-6 text-navy" />
  },
  {
    id: "03",
    title: "Overseas Education",
    description: "Guidance for students planning to study internationally, including medical education opportunities abroad.",
    fullDetails: "Explore global education opportunities with our comprehensive overseas education services. We assist with university shortlisting, application processing, and pre-departure briefings for popular destinations like the UK, Canada, Australia, USA, and specialized medical programs in Kyrgyzstan.",
    icon: <Globe2 className="w-6 h-6 text-navy" />
  },
  {
    id: "04",
    title: "Visa & Documentation Support",
    description: "Assistance with student visas, visitor visas and the documentation process.",
    fullDetails: "Navigate the complex visa process with ease. Our dedicated team helps you gather the correct documentation, prepare for visa interviews, and lodge your application accurately to ensure a smooth approval process for both student and visitor visas.",
    icon: <FileText className="w-6 h-6 text-navy" />
  },
  {
    id: "05",
    title: "Exam Assistance",
    description: "Support for relevant on-demand examinations and admission requirements.",
    fullDetails: "Get the support you need for crucial entrance and language proficiency exams. We provide guidance and resources for tests like IELTS, TOEFL, GRE, GMAT, and other specialized university admission tests.",
    icon: <BookOpen className="w-6 h-6 text-navy" />
  },
  {
    id: "06",
    title: "Travel & Ticket Support",
    description: "Assistance with ticket bookings and travel preparation.",
    fullDetails: "Your journey doesn't end with an admission offer. We help with practical travel arrangements, including flight bookings, finding student accommodation, and providing essential travel tips so you can start your new chapter stress-free.",
    icon: <Plane className="w-6 h-6 text-navy" />
  }
];

type Service = typeof SERVICES[0];

export function Services() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <section id="services" className="pt-16 md:pt-24 pb-0 bg-ivory relative">
      <div className="container mx-auto px-4 md:px-8 pb-16 md:pb-32">
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
              onClick={() => setSelectedService(service)}
              className="group bg-white p-8 rounded-sm border border-navy/5 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer flex flex-col h-full"
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
              
              <p className="text-midnight/70 text-sm leading-relaxed mb-6 relative z-10 flex-grow">
                {service.description}
              </p>
              
              <button 
                className="mt-auto relative z-10 flex items-center text-navy font-medium text-sm group-hover:text-gold transition-colors focus:outline-none"
                aria-label={`Learn more about ${service.title}`}
              >
                Learn more
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium SVG Wave Transition */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.5,195.9,111.45,238.4,106.18,281.25,89.5,321.39,56.44Z" className="fill-navy"></path>
        </svg>
      </div>

      {/* Interactive Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white rounded-sm shadow-2xl overflow-hidden z-10"
            >
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-2 text-midnight/50 hover:text-navy hover:bg-ivory rounded-full transition-colors focus:outline-none"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 md:p-10">
                <div className="w-16 h-16 rounded-sm bg-sage/20 flex items-center justify-center mb-6">
                  {selectedService.icon}
                </div>
                
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-navy mb-2">
                  {selectedService.title}
                </h3>
                
                <div className="w-12 h-1 bg-gold mb-6" />
                
                <p className="text-midnight/80 leading-relaxed font-sans text-base md:text-lg">
                  {selectedService.fullDetails}
                </p>
                
                <div className="mt-8">
                  <a 
                    href="#contact" 
                    onClick={() => setSelectedService(null)}
                    className="inline-flex items-center justify-center px-6 py-3 bg-navy text-white font-medium rounded-sm hover:bg-navy/90 transition-colors w-full md:w-auto"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
