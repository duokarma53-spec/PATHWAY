"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingWhatsApp({ phoneNumber }: { phoneNumber: string }) {
  const message = "Hello Pathway Education Consultancy, I would like to know more about admission and education opportunities.";
  const href = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full",
        "bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
      )}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
