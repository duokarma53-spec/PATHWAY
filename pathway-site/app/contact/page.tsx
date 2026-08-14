'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, CheckCircle, Loader2, Mail, Phone, MapPin } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { SITE_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Please enter a message (at least 10 characters)'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const fieldClass = (error?: boolean) => cn(
    'w-full bg-transparent border-b text-ivory text-sm py-3 placeholder:text-text-faint focus:outline-none transition-colors duration-200',
    error ? 'border-red-500/60' : 'border-border focus:border-gold'
  );

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    await new Promise(r => setTimeout(r, 1200));
    console.log('Contact submission:', data);
    setStatus('success');
  };

  return (
    <div className="pt-20 bg-charcoal min-h-screen">
      <section className="section-padding border-b border-border">
        <div className="container-padding max-w-5xl mx-auto">
          <FadeIn>
            <div className="flex items-center gap-3 mb-8">
              <div className="gold-rule" />
              <span className="label-text">Get in Touch</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="headline-lg text-ivory">Every conversation starts with a message.</h1>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-padding max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <FadeIn>
                {[
                  { icon: Mail, label: 'Email', value: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
                  { icon: Phone, label: 'Phone', value: SITE_CONFIG.phone, href: `tel:${SITE_CONFIG.phone.replace(/\s/g, '')}` },
                  { icon: MapPin, label: 'Location', value: SITE_CONFIG.address, href: undefined },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="mt-0.5 w-8 h-8 border border-border flex items-center justify-center shrink-0">
                      <Icon size={14} className="text-gold/60" />
                    </div>
                    <div>
                      <div className="label-text text-text-faint mb-1">{label}</div>
                      {href ? (
                        <a href={href} className="text-ivory/80 text-sm hover:text-gold transition-colors duration-200">{value}</a>
                      ) : (
                        <p className="text-ivory/80 text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </FadeIn>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {status === 'success' ? (
                <FadeIn>
                  <div className="flex flex-col items-start gap-4 py-12">
                    <CheckCircle size={32} className="text-gold" />
                    <h3 className="font-serif text-2xl text-ivory">Message received.</h3>
                    <p className="text-text-muted">We'll get back to you within 24 hours.</p>
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
                    </div>
                    <div>
                      <input {...register('phone')} type="tel" placeholder="Phone Number (optional)" className={fieldClass()} />
                    </div>
                    <div>
                      <textarea {...register('message')} placeholder="Your message *" rows={5} className={cn(fieldClass(!!errors.message), 'resize-none')} />
                      {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                    </div>
                    <button type="submit" disabled={status === 'loading'} className="group inline-flex items-center gap-2.5 bg-gold text-charcoal font-medium text-sm tracking-wide px-8 py-4 hover:bg-gold-light transition-colors duration-300 disabled:opacity-60">
                      {status === 'loading' ? <><Loader2 size={15} className="animate-spin" />Sending...</> : <>Send Message<ArrowRight size={15} /></>}
                    </button>
                  </form>
                </FadeIn>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
