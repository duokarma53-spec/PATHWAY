"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, Mail, ChevronRight, ChevronLeft } from "lucide-react";

const PHONE = "+917506284722";
const PHONE_DISPLAY = "+91 75062 84722";
const WA_MSG = "Hello Pathway Education Consultancy, I would like to know more about your services.";

type ActiveItem = "phone" | "whatsapp" | "email" | null;

export function FloatingContactWidget() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState<ActiveItem>(null);

  const waHref = `https://wa.me/${PHONE.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(WA_MSG)}`;
  const mailHref = "mailto:pathwayeduconsultancy53@gmail.com";

  const items = [
    {
      id: "phone" as ActiveItem,
      icon: <Phone size={18} strokeWidth={2.5} />,
      label: PHONE_DISPLAY,
      href: `tel:${PHONE}`,
      pillClass: "bg-red-600",
      iconClass: "bg-red-600 hover:bg-red-700",
    },
    {
      id: "whatsapp" as ActiveItem,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.524 5.847L0 24l6.332-1.499A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.789 9.789 0 01-5.017-1.381l-.36-.214-3.728.882.939-3.625-.235-.372A9.792 9.792 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
        </svg>
      ),
      label: PHONE_DISPLAY,
      href: waHref,
      pillClass: "bg-[#25D366]",
      iconClass: "bg-[#25D366] hover:bg-[#1ebe5d]",
    },
    {
      id: "email" as ActiveItem,
      icon: <Mail size={18} strokeWidth={2.5} />,
      label: "pathwayeduconsultancy53@gmail.com",
      href: mailHref,
      pillClass: "bg-navy",
      iconClass: "bg-navy hover:bg-midnight",
    },
  ];

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[90] flex items-center">
      {/* Expanded pill labels */}
      <AnimatePresence>
        {!collapsed && activeItem && (
          <motion.a
            key={activeItem}
            href={items.find((i) => i.id === activeItem)?.href}
            target={activeItem !== "phone" ? "_blank" : undefined}
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: "auto" }}
            exit={{ opacity: 0, x: -20, width: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-r-none rounded-l-full text-white text-sm font-sans font-semibold whitespace-nowrap overflow-hidden ${
              items.find((i) => i.id === activeItem)?.pillClass
            }`}
            style={{ borderRadius: "9999px 0 0 9999px" }}
          >
            {items.find((i) => i.id === activeItem)?.label}
          </motion.a>
        )}
      </AnimatePresence>

      {/* Icon column */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="flex flex-col gap-2 bg-navy/90 backdrop-blur-sm rounded-r-2xl py-3 px-2 shadow-2xl"
          >
            {items.map((item) => (
              <motion.a
                key={item.id}
                href={item.href}
                target={item.id !== "phone" ? "_blank" : undefined}
                rel="noopener noreferrer"
                onMouseEnter={() => setActiveItem(item.id)}
                onMouseLeave={() => setActiveItem(null)}
                onFocus={() => setActiveItem(item.id)}
                onBlur={() => setActiveItem(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors duration-200 cursor-pointer ${item.iconClass}`}
                aria-label={item.label}
              >
                {item.icon}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle arrow */}
      <button
        onClick={() => {
          setCollapsed((c) => !c);
          setActiveItem(null);
        }}
        className="w-6 h-14 bg-navy/80 backdrop-blur-sm rounded-r-xl flex items-center justify-center text-white hover:bg-navy transition-colors duration-200 shadow-lg"
        aria-label={collapsed ? "Expand contact widget" : "Collapse contact widget"}
      >
        {collapsed ? (
          <ChevronRight size={14} strokeWidth={3} />
        ) : (
          <ChevronLeft size={14} strokeWidth={3} />
        )}
      </button>
    </div>
  );
}
