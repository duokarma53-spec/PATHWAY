'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, CheckCircle, Loader2, Calendar, Clock, MessageSquare, Phone } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { cn } from '@/lib/utils';

const consultSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  notes: z.string().optional(),
});

type ConsultFormData = z.infer<typeof consultSchema>;

const TIME_SLOTS = [
  '9:00 AM – 10:00 AM',
  '10:00 AM – 11:00 AM',
  '11:00 AM – 12:00 PM',
  '2:00 PM – 3:00 PM',
  '3:00 PM – 4:00 PM',
  '4:00 PM – 5:00 PM',
  '6:00 PM – 7:00 PM',
];

const WHAT_TO_EXPECT = [
  { icon: Clock, title: '45-minute call', desc: 'A focused, no-pressure conversation tailored to your situation.' },
  { icon: MessageSquare, title: 'Listen-first approach', desc: "We start by understanding your goals before offering any recommendations." },
  { icon: Calendar, title: 'Clear next steps', desc: "By the end, you'll have clarity on what to do next — regardless of whether you continue with Pathway." },
  { icon: Phone, title: 'Your preferred channel', desc: "Google Meet, Zoom, or phone — whichever you prefer." },
];

export default function ConsultationPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { register, handleSubmit, formState: { errors } } = useForm<ConsultFormData>({
    resolver: zodResolver(consultSchema),
  });

  const fieldClass = (error?: boolean) => cn(
    'w-full bg-transparent border-b text-ivory text-sm py-3 placeholder:text-text-faint focus:outline-none transition-colors duration-200',
    error ? 'border-red-500/60' : 'border-border focus:border-gold'
  );

  const onSubmit = async (data: ConsultFormData) => {
    setStatus('loading');
    await new Promise(r => setTimeout(r, 1500));
    console.log('Consultation booking:', data);
    setStatus('success');
  };

  return (
    <div className="pt-20 bg-charcoal min-h-screen">
      {/* Header */}
      <section className="section-padding border-b border-border">
        <div className="container-padding max-w-5xl mx-auto">
          <FadeIn>
            <div className="flex items-center gap-3 mb-8">
              <div className="gold-rule" />
              <span className="label-text">Book a Consultation</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="headline-lg text-ivory mb-6">
              A conversation that<br />could change everything.
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-text-muted text-lg max-w-xl leading-relaxed">
              Your first consultation with Pathway is free. No commitment. No pressure. Just an honest conversation about where you want to go.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* What to expect */}
      <section className="py-16 border-b border-border">
        <div className="container-padding max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="font-serif text-xl text-ivory mb-10">What to expect</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHAT_TO_EXPECT.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <div className="flex flex-col gap-3">
                  <item.icon size={20} className="text-gold/60" />
                  <h3 className="font-medium text-ivory text-sm">{item.title}</h3>
                  <p className="text-text-muted text-xs leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding">
        <div className="container-padding max-w-2xl mx-auto">
          {status === 'success' ? (
            <FadeIn>
              <div className="text-center py-16 flex flex-col items-center gap-4">
                <CheckCircle size={40} className="text-gold" />
                <h3 className="font-serif text-2xl text-ivory">We'll be in touch soon.</h3>
                <p className="text-text-muted text-sm">A counsellor will reach out within 24 hours to confirm your slot.</p>
              </div>
            </FadeIn>
          ) : (
            <FadeIn delay={0.1}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <input {...register('name')} placeholder="Your Name *" className={fieldClass(!!errors.name)} />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <input {...register('email')} type="email" placeholder="Email Address *" className={fieldClass(!!errors.email)} />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <input {...register('phone')} type="tel" placeholder="Phone Number *" className={fieldClass(!!errors.phone)} />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <input {...register('preferredDate')} type="date" placeholder="Preferred Date" className={fieldClass()} />
                  </div>
                  <div className="md:col-span-2">
                    <select {...register('preferredTime')} className="w-full bg-charcoal-mid border-b border-border text-text-muted text-sm py-3 focus:outline-none focus:border-gold transition-colors appearance-none" defaultValue="">
                      <option value="" disabled>Preferred Time Slot</option>
                      {TIME_SLOTS.map(t => <option key={t} value={t} className="bg-charcoal text-ivory">{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <textarea {...register('notes')} placeholder="Anything you'd like us to know beforehand? (optional)" rows={3} className={cn(fieldClass(), 'resize-none')} />
                </div>
                <button type="submit" disabled={status === 'loading'} className="group inline-flex items-center gap-2.5 bg-gold text-charcoal font-medium text-sm tracking-wide px-8 py-4 hover:bg-gold-light transition-colors duration-300 disabled:opacity-60">
                  {status === 'loading' ? <><Loader2 size={15} className="animate-spin" />Booking...</> : <>Book My Consultation<ArrowRight size={15} /></>}
                </button>
              </form>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
}
