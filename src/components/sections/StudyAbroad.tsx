import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { MapPin } from "lucide-react";

const DESTINATIONS = [
  {
    name: "Kyrgyzstan",
    featured: "International Higher School of Medicine (IHSM)",
    image: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?q=80&w=2070&auto=format&fit=crop", // Placeholder medical
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
  },
  {
    name: "United Kingdom",
    image: "https://images.unsplash.com/photo-1513635269975-5969336ac1fc?q=80&w=2070&auto=format&fit=crop",
    colSpan: "col-span-1",
  },
  {
    name: "Canada",
    image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=2011&auto=format&fit=crop",
    colSpan: "col-span-1",
  },
  {
    name: "Australia",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=2130&auto=format&fit=crop",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-1",
  },
  {
    name: "USA",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1974&auto=format&fit=crop",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
  },
];

export function StudyAbroad() {
  return (
    <section id="study-abroad" className="py-16 md:py-24 bg-navy">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-wider text-sage mb-4 block">
              INTERNATIONAL OPPORTUNITIES
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white">
              Think Beyond Borders.
            </h2>
            <p className="mt-6 text-lg text-ivory/70 leading-relaxed font-sans max-w-xl">
              Explore educational opportunities beyond India with guidance designed around your academic profile and goals.
            </p>
          </div>
          <Button href="#contact" variant="secondary" className="hidden md:inline-flex shrink-0">
            Explore Overseas Options
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px]">
          {DESTINATIONS.map((dest, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-sm ${dest.colSpan}`}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 z-10" />
              <img
                src={dest.image}
                alt={`Study in ${dest.name}`}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end h-full bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                <div className="flex items-center gap-2 text-gold mb-1">
                  <MapPin size={16} />
                  <span className="text-sm font-semibold tracking-wide uppercase">{dest.name}</span>
                </div>
                {dest.featured && (
                  <p className="text-white text-sm mt-2 font-medium leading-tight">
                    Featuring: {dest.featured}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 md:hidden flex justify-center">
          <Button href="#contact" variant="secondary" className="w-full">
            Explore Overseas Options
          </Button>
        </div>
      </div>
    </section>
  );
}
