'use client';

import Image from 'next/image';
import { DEMO_TEAM } from '@/lib/seed-data';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerChildren, staggerItem } from '@/components/animations/StaggerChildren';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export function TeamSection() {
  return (
    <section className="section-padding bg-bg-primary relative overflow-hidden">
      <div className="container-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <FadeIn>
            <div className="flex items-center gap-3 mb-6">
              <div className="gold-rule" />
              <span className="label-text">Our Team</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="headline-lg text-text-primary">
              Meet the people<br />
              <span className="italic text-text-muted">behind the Pathway.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-text-secondary text-lg leading-relaxed">
              Our counsellors bring first-hand international experience and a genuine investment in each student's outcome.
            </p>
          </FadeIn>
        </div>

        {/* Team Grid */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8" delay={0.1} stagger={0.1}>
          {DEMO_TEAM.map((member) => (
            <motion.div
              key={member.id}
              variants={staggerItem}
              className="bg-bg-secondary border border-border group relative flex flex-col"
            >
              {/* Photo */}
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={member.photoUrl ?? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80'}
                  alt={member.name}
                  fill
                  className="object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Info */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-serif text-2xl text-text-primary">{member.name}</h3>
                    <p className="text-gold text-xs uppercase tracking-widest font-medium mt-1">{member.role}</p>
                  </div>
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-text-primary transition-colors duration-200 mt-1"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>

                <p className="text-text-secondary text-sm leading-relaxed mb-8 flex-1">{member.bio}</p>

                <div>
                  {/* Education */}
                  <div className="border-t border-border pt-4 mb-4">
                    <div className="label-text text-text-muted mb-1">Education</div>
                    <p className="text-text-primary text-xs">{member.education}</p>
                  </div>

                  {/* Expertise tags */}
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((e) => (
                      <span key={e} className="text-xs px-3 py-1 bg-bg-primary border border-border text-text-muted">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
