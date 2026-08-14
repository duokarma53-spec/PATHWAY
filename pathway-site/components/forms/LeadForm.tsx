'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { COUNTRIES, EDUCATION_LEVELS, COURSE_FIELDS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const leadSchema = z.object({
  studentName: z.string().min(2, 'Please enter a name'),
  parentName: z.string().optional(),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  grade: z.string().min(1, 'Please select your education level'),
  destination: z.string().min(1, 'Please select a destination'),
  course: z.string().min(1, 'Please select a field of interest'),
  city: z.string().min(2, 'Please enter your city'),
  message: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

const fieldClass = (error?: boolean) => cn(
  'w-full bg-transparent border-b text-ivory text-sm py-3 placeholder:text-text-faint focus:outline-none transition-colors duration-200',
  error
    ? 'border-red-500/60 focus:border-red-400'
    : 'border-border focus:border-gold'
);

const selectClass = (error?: boolean) => cn(
  'w-full bg-charcoal-mid border-b text-sm py-3 focus:outline-none transition-colors duration-200 appearance-none cursor-pointer',
  error
    ? 'border-red-500/60 focus:border-red-400 text-ivory'
    : 'border-border focus:border-gold text-ivory'
);

export function LeadForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    setStatus('loading');
    try {
      // TODO: Replace with Supabase insert when credentials are provided
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Lead form submission:', data);
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <CheckCircle size={40} className="text-gold" />
        <h3 className="font-serif text-2xl text-ivory">Your Pathway begins here.</h3>
        <p className="text-text-muted text-sm max-w-xs">
          Thank you. A counsellor will reach out to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Grid fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Name */}
        <div>
          <input
            {...register('studentName')}
            placeholder="Student Name *"
            className={fieldClass(!!errors.studentName)}
            aria-label="Student name"
            aria-invalid={!!errors.studentName}
          />
          {errors.studentName && (
            <p className="text-red-400 text-xs mt-1">{errors.studentName.message}</p>
          )}
        </div>

        {/* Parent Name */}
        <div>
          <input
            {...register('parentName')}
            placeholder="Parent Name (optional)"
            className={fieldClass()}
            aria-label="Parent name"
          />
        </div>

        {/* Email */}
        <div>
          <input
            {...register('email')}
            type="email"
            placeholder="Email Address *"
            className={fieldClass(!!errors.email)}
            aria-label="Email address"
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <input
            {...register('phone')}
            type="tel"
            placeholder="Phone Number *"
            className={fieldClass(!!errors.phone)}
            aria-label="Phone number"
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Education Level */}
        <div className="relative">
          <select
            {...register('grade')}
            className={selectClass(!!errors.grade)}
            aria-label="Education level"
            aria-invalid={!!errors.grade}
            defaultValue=""
          >
            <option value="" disabled className="bg-charcoal text-text-faint">
              Education Level *
            </option>
            {EDUCATION_LEVELS.map((level) => (
              <option key={level} value={level} className="bg-charcoal text-ivory">
                {level}
              </option>
            ))}
          </select>
          {errors.grade && (
            <p className="text-red-400 text-xs mt-1">{errors.grade.message}</p>
          )}
        </div>

        {/* Destination */}
        <div className="relative">
          <select
            {...register('destination')}
            className={selectClass(!!errors.destination)}
            aria-label="Preferred destination"
            aria-invalid={!!errors.destination}
            defaultValue=""
          >
            <option value="" disabled className="bg-charcoal text-text-faint">
              Preferred Destination *
            </option>
            <option value="Undecided" className="bg-charcoal text-ivory">Undecided</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c} className="bg-charcoal text-ivory">
                {c}
              </option>
            ))}
          </select>
          {errors.destination && (
            <p className="text-red-400 text-xs mt-1">{errors.destination.message}</p>
          )}
        </div>

        {/* Course Field */}
        <div className="relative">
          <select
            {...register('course')}
            className={selectClass(!!errors.course)}
            aria-label="Field of interest"
            aria-invalid={!!errors.course}
            defaultValue=""
          >
            <option value="" disabled className="bg-charcoal text-text-faint">
              Field of Interest *
            </option>
            {COURSE_FIELDS.map((f) => (
              <option key={f} value={f} className="bg-charcoal text-ivory">
                {f}
              </option>
            ))}
          </select>
          {errors.course && (
            <p className="text-red-400 text-xs mt-1">{errors.course.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <input
            {...register('city')}
            placeholder="Current City *"
            className={fieldClass(!!errors.city)}
            aria-label="Current city"
            aria-invalid={!!errors.city}
          />
          {errors.city && (
            <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <textarea
          {...register('message')}
          placeholder="Anything specific you'd like to share? (optional)"
          rows={3}
          className={cn(fieldClass(), 'resize-none')}
          aria-label="Additional message"
        />
      </div>

      {/* Error State */}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={14} />
          <span>Something went wrong. Please try again.</span>
        </div>
      )}

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="group relative overflow-hidden inline-flex items-center gap-2.5 bg-gold text-charcoal font-medium text-sm tracking-wide px-8 py-4 hover:bg-gold-light transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Start My Pathway
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5 duration-200" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
