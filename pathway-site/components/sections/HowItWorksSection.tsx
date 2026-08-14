'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FadeIn } from '@/components/animations/FadeIn';

const PATH_STAGES = [
  { 
    title: 'Discover', 
    desc: 'Understanding your ambitions, academic background, and long-term career goals to establish a clear direction.' 
  },
  { 
    title: 'Define', 
    desc: 'Setting realistic parameters—from budget to location preferences—ensuring every option aligns with your family\'s expectations.' 
  },
  { 
    title: 'Shortlist', 
    desc: 'Curating a highly strategic list of universities that balance ambition with realistic admission probabilities.' 
  },
  { 
    title: 'Prepare', 
    desc: 'Building a compelling narrative through statements of purpose, essays, and strong profile enhancement.' 
  },
  { 
    title: 'Apply', 
    desc: 'Navigating complex application portals and deadlines with meticulous attention to detail.' 
  },
  { 
    title: 'Arrive', 
    desc: 'From visa interviews to pre-departure briefings, ensuring you are fully prepared for campus life abroad.' 
  },
];

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 60%', 'end 80%']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const lineHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="section-padding bg-bg-inverse relative overflow-hidden text-text-inverse">
      <div className="container-padding max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="max-w-2xl mb-24">
          <FadeIn>
            <div className="flex items-center gap-3 mb-6">
              <div className="gold-rule" />
              <span className="label-text">The Journey</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="headline-lg text-white">
              Your Path to Admission
            </h2>
          </FadeIn>
        </div>

        {/* Interactive Scroll Path */}
        <div ref={containerRef} className="relative max-w-4xl">
          {/* Vertical Track */}
          <div className="absolute left-[15px] md:left-[23px] top-4 bottom-4 w-px bg-white/10" />
          
          {/* Vertical Fill */}
          <div className="absolute left-[15px] md:left-[23px] top-4 bottom-4 w-px flex justify-center">
            <motion.div 
              className="w-px bg-gold origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-16 md:space-y-24">
            {PATH_STAGES.map((stage, i) => {
              // Calculate activation points for each node
              const activationPoint = i / (PATH_STAGES.length - 1);
              const isFirst = i === 0;
              
              return (
                <div key={stage.title} className="relative flex gap-8 md:gap-16 group">
                  
                  {/* Node */}
                  <div className="relative shrink-0 z-10 pt-2">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-bg-inverse border-2 border-white/10 flex items-center justify-center transition-colors duration-500 relative">
                      <motion.div 
                        className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gold"
                        initial={{ scale: isFirst ? 1 : 0, opacity: isFirst ? 1 : 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ margin: "-20% 0px -20% 0px" }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <motion.div 
                    className="flex-1 pt-2 md:pt-4"
                    initial={{ opacity: 0.3, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ margin: "-20% 0px -20% 0px" }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="label-text text-gold/60 mb-2">0{i + 1}</div>
                    <h3 className="font-serif text-3xl md:text-4xl text-white mb-4 tracking-tight">
                      {stage.title}
                    </h3>
                    <p className="text-text-faint text-base md:text-lg leading-relaxed max-w-xl">
                      {stage.desc}
                    </p>
                  </motion.div>
                  
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
