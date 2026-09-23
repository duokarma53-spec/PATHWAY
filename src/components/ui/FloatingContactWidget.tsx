"use client";

import React, { useState } from "react";
import { Phone, Mail, ChevronRight, ChevronLeft } from "lucide-react";

const PHONE_RAW = "917506284722";
const PHONE_DISPLAY = "+91 75062 84722";
const WA_DISPLAY = "+91 94091 61562";
const WA_RAW = "919409161562";
const WA_MSG = encodeURIComponent(
  "Hello Pathway Education Consultancy, I would like to know more about your services."
);
const MAIL = "pathwayeduconsultancy53@gmail.com";

export function FloatingContactWidget() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="fixed left-0 top-1/2 -translate-y-1/2 z-[90] flex items-center"
      style={{ pointerEvents: "auto" }}
    >
      {/* Icon column — pure CSS hover expansion, no JS state on hover */}
      <div
        className={`flex flex-col gap-2 py-3 px-2 bg-navy/90 backdrop-blur-sm rounded-r-2xl shadow-2xl transition-all duration-300 ${
          collapsed ? "opacity-0 -translate-x-full pointer-events-none" : "opacity-100 translate-x-0"
        }`}
      >
        {/* Phone */}
        <a
          href={`tel:+${PHONE_RAW}`}
          className="group flex items-center rounded-full overflow-hidden cursor-pointer"
          aria-label="Call us"
        >
          {/* Expanding label — CSS only, no JS */}
          <div className="max-w-0 group-hover:max-w-[170px] overflow-hidden transition-[max-width] duration-300 ease-out">
            <span className="block pl-3 pr-2 text-[13px] font-semibold text-white whitespace-nowrap">
              {PHONE_DISPLAY}
            </span>
          </div>
          {/* Icon circle */}
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-700 transition-colors duration-200">
            <Phone size={16} className="text-white" strokeWidth={2.5} />
          </div>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${WA_RAW}?text=${WA_MSG}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center rounded-full overflow-hidden cursor-pointer"
          aria-label="WhatsApp"
        >
          <div className="max-w-0 group-hover:max-w-[170px] overflow-hidden transition-[max-width] duration-300 ease-out">
            <span className="block pl-3 pr-2 text-[13px] font-semibold text-white whitespace-nowrap">
              {WA_DISPLAY}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 group-hover:bg-[#1dba58] transition-colors duration-200">
            <svg viewBox="0 0 24 24" fill="white" className="w-[17px] h-[17px]">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.524 5.847L0 24l6.332-1.499A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.789 9.789 0 01-5.017-1.381l-.36-.214-3.728.882.939-3.625-.235-.372A9.792 9.792 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
            </svg>
          </div>
        </a>

        {/* Email */}
        <a
          href={`mailto:${MAIL}`}
          className="group flex items-center rounded-full overflow-hidden cursor-pointer"
          aria-label="Email us"
        >
          <div className="max-w-0 group-hover:max-w-[200px] overflow-hidden transition-[max-width] duration-300 ease-out">
            <span className="block pl-3 pr-2 text-[11px] font-semibold text-white whitespace-nowrap">
              {MAIL}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-midnight flex items-center justify-center shrink-0 group-hover:bg-navy transition-colors duration-200">
            <Mail size={16} className="text-white" strokeWidth={2.5} />
          </div>
        </a>
      </div>

      {/* Collapse / expand toggle tab */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-5 h-14 bg-navy/80 backdrop-blur-sm rounded-r-xl flex items-center justify-center text-white hover:bg-navy transition-colors duration-200 shadow-lg shrink-0"
        aria-label={collapsed ? "Show contact widget" : "Hide contact widget"}
      >
        {collapsed ? (
          <ChevronRight size={12} strokeWidth={3} />
        ) : (
          <ChevronLeft size={12} strokeWidth={3} />
        )}
      </button>
    </div>
  );
}
