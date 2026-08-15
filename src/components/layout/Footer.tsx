import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy text-white py-16">
      <div className="container mx-auto px-4 md:px-8">
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
              <li>Admission Guidance</li>
              <li>Medical Education</li>
              <li>Engineering Guidance</li>
              <li>Overseas Education</li>
              <li>Visa Assistance</li>
              <li>Travel Support</li>
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
        </div>
      </div>
    </footer>
  );
}
