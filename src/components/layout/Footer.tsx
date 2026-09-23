import React from "react";
import Link from "next/link";

const DESTINATION_FLAGS = [
  { name: "Canada", emoji: "🇨🇦" },
  { name: "Germany", emoji: "🇩🇪" },
  { name: "Singapore", emoji: "🇸🇬" },
  { name: "USA", emoji: "🇺🇸" },
  { name: "UK", emoji: "🇬🇧" },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Contact Card Strip */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 md:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <div className="shrink-0">
              <img
                src="/images/logo.jpeg"
                alt="Pathway Education Consultancy"
                className="h-16 w-auto object-contain brightness-0 invert"
              />
            </div>

            {/* Divider */}
            <div className="hidden md:block h-20 w-px bg-white/10" />

            {/* Contacts */}
            <div className="flex flex-col gap-2 text-center md:text-left">
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gold mb-1">Contact Us</p>
              <a href="tel:+917506284722" className="font-sans text-sm text-ivory/80 hover:text-gold transition-colors">
                Ateka Chunawala — <span className="font-semibold text-white">+91 75062 84722</span>
              </a>
              <a href="tel:+919409161562" className="font-sans text-sm text-ivory/80 hover:text-gold transition-colors">
                Faizah Kutervaali — <span className="font-semibold text-white">+91 94091 61562</span>
              </a>
            </div>

            {/* Divider */}
            <div className="hidden md:block h-20 w-px bg-white/10" />

            {/* Address */}
            <div className="flex flex-col gap-2 text-center md:text-left">
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gold mb-1">Address</p>
              <p className="font-sans text-sm text-ivory/80 leading-relaxed">
                Yusuf Corner, First Floor<br />
                Godi Road, Dahod – 389151<br />
                Gujarat, India
              </p>
            </div>

            {/* Divider */}
            <div className="hidden md:block h-20 w-px bg-white/10" />

            {/* Destination Flags */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gold">Open Admissions For</p>
              <div className="flex items-center gap-4">
                {DESTINATION_FLAGS.map((dest) => (
                  <div key={dest.name} className="flex flex-col items-center gap-1">
                    <span className="text-2xl leading-none">{dest.emoji}</span>
                    <span className="text-[8px] font-sans text-ivory/50 uppercase tracking-wider">{dest.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex flex-col">
              <span className="font-serif text-3xl font-bold tracking-tight text-white leading-none">
                PATHWAY
              </span>
              <span className="text-xs font-sans text-sage font-medium tracking-widest uppercase">
                Education Consultancy
              </span>
            </Link>
            <p className="text-ivory/70 text-sm mt-4">
              Your trusted partner in higher education, admissions, and overseas study opportunities. Based in Dahod, Gujarat.
            </p>
            <p className="text-[10px] font-sans italic text-gold/70 tracking-wide mt-1">— Road to Success</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-sm text-ivory/70">
              <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
              <li><Link href="#about" className="hover:text-gold transition-colors">About Us</Link></li>
              <li><Link href="#services" className="hover:text-gold transition-colors">Services</Link></li>
              <li><Link href="#admissions" className="hover:text-gold transition-colors">Admissions</Link></li>
              <li><Link href="#study-abroad" className="hover:text-gold transition-colors">Study Abroad</Link></li>
              <li><Link href="#contact" className="hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="flex flex-col gap-3 text-sm text-ivory/70">
              <li>Student VISA</li>
              <li>Visitor VISA / Work VISA</li>
              <li>Business VISA / PR</li>
              <li>Air Ticket Booking</li>
              <li>Passport Application</li>
              <li>IELTS Coaching</li>
              <li>Domestic / International Tours</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="flex flex-col gap-3 text-sm text-ivory/70">
              <li>
                1st Floor, Yusuf Corner,<br />
                Godi Road, Dahod,<br />
                Gujarat – 389151
              </li>
              <li className="mt-2">
                <a href="tel:+917506284722" className="hover:text-gold transition-colors">+91 75062 84722</a><br />
                <a href="tel:+919409161562" className="hover:text-gold transition-colors">+91 94091 61562</a>
              </li>
              <li className="mt-2">
                <a href="mailto:pathwayeduconsultancy53@gmail.com" className="hover:text-gold transition-colors">
                  pathwayeduconsultancy53@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-ivory/50">
          <p>© {new Date().getFullYear()} Pathway Education Consultancy. All rights reserved.</p>
          <p className="text-xs">Dahod, Gujarat, India</p>
        </div>
      </div>
    </footer>
  );
}
