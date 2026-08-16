import React from "react";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="py-16 md:py-24 bg-navy text-center">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl flex flex-col items-center">
        <span className="text-sm font-bold uppercase tracking-widest text-sage mb-6 block">
          READY TO BEGIN?
        </span>
        
        <h2 className="font-serif text-4xl md:text-6xl text-white leading-tight mb-6">
          Your next step starts with <span className="text-gold italic">a conversation.</span>
        </h2>
        
        <p className="text-lg md:text-xl text-ivory/80 leading-relaxed font-sans mb-10 max-w-2xl">
          Tell us where you want to go. We&apos;ll help you understand how to get there.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button href="#contact" variant="secondary" size="lg">
            Book Free Counselling
          </Button>
          <Button 
            href="https://wa.me/917506284722?text=Hello%20Pathway%20Education%20Consultancy%2C%20I%20would%20like%20to%20know%20more%20about%20admission%20and%20education%20opportunities." 
            variant="outline" 
            size="lg"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Chat on WhatsApp
          </Button>
        </div>
        
        <p className="text-ivory/50 text-sm mt-8">
          Or call us directly at <a href="tel:+917506284722" className="text-gold hover:underline">+91 75062 84722</a>
        </p>
      </div>
    </section>
  );
}
