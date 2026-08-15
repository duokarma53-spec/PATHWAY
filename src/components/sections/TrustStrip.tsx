import React from "react";

export function TrustStrip() {
  const items = [
    "CAREER GUIDANCE",
    "ADMISSION SUPPORT",
    "OVERSEAS EDUCATION",
    "VISA ASSISTANCE",
  ];

  return (
    <div className="bg-navy py-6 border-b border-white/10">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-center">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
              <span className="text-white/90 text-sm tracking-[0.2em] font-medium uppercase">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
