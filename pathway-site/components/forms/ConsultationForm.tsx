'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/animations/FadeIn';

const formSchema = z.object({
  userType: z.string().min(1, 'Please select who we are speaking with'),
  servicesOfInterest: z.array(z.string()).min(1, 'Please select at least one area you need help with'),
  destinations: z.array(z.string()).min(1, 'Please select at least one destination'),
  currentQualification: z.string().min(2, 'Please enter your current qualification'),
  studyField: z.string().min(2, 'Please enter your field of interest'),
  currentCity: z.string().min(2, 'Please enter your current city'),
  preferredCourse: z.string().min(2, 'Please enter your preferred course'),
  academicBackground: z.string().min(2, 'Please briefly describe your academic background'),
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  consultationMethod: z.string().min(1, 'Please select a preferred contact method'),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const TOTAL_STEPS = 6;

const SERVICES = [
  'Career Counselling',
  'Engineering Admission',
  'Medical Admission',
  'ACPC Guidance',
  'College / University Admission',
  'Study Abroad',
  'Student Visa',
  'Visitor Visa',
  'Not Sure Yet'
];

const DESTINATIONS_INDIA = ['Gujarat', 'Other Indian states', 'Not sure'];
const DESTINATIONS_ABROAD = [
  'United Kingdom', 'United States', 'Canada', 
  'Australia', 'Germany', 'Ireland', 
  'New Zealand', 'Singapore', 'Other', 'Not sure yet'
];

export function ConsultationForm() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, trigger, formState: { errors }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      userType: '',
      servicesOfInterest: [],
      destinations: [],
      currentQualification: '',
      studyField: '',
      currentCity: '',
      preferredCourse: '',
      academicBackground: '',
      name: '',
      email: '',
      phone: '',
      consultationMethod: '',
      preferredDate: '',
      preferredTime: '',
    }
  });

  const nextStep = async (fieldsToValidate: (keyof FormData)[]) => {
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep(s => Math.min(s + 1, TOTAL_STEPS));
    }
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  const onSubmit = async (data: FormData) => {
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const supabase = createClient();
      
      const notes = `User Type: ${data.userType}
Services: ${data.servicesOfInterest.join(', ')}
Destinations: ${data.destinations.join(', ')}
Current Qualification: ${data.currentQualification}
Field of Interest: ${data.studyField}
Current City: ${data.currentCity}
Preferred Course: ${data.preferredCourse}
Academic Background: ${data.academicBackground}
Consultation Method: ${data.consultationMethod}`;

      const { error } = await supabase.from('consultations').insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        preferred_date: data.preferredDate || null,
        preferred_time: data.preferredTime || null,
        notes: notes,
        status: 'pending'
      });

      if (error) throw error;
      
      setStatus('success');
    } catch (err: any) {
      console.error('Submission error:', err);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const SingleSelectOption = ({ fieldName, value, label }: { fieldName: keyof FormData, value: string, label: string }) => {
    const currentValue = watch(fieldName);
    const isSelected = currentValue === value;
    
    return (
      <button
        type="button"
        onClick={() => setValue(fieldName, value as any, { shouldValidate: true })}
        className={cn(
          "w-full text-left p-6 border transition-all duration-300 rounded-sm group",
          isSelected 
            ? "border-gold bg-gold/5 text-charcoal shadow-sm" 
            : "border-border/50 bg-white text-text-secondary hover:border-gold/40 hover:bg-white hover:text-text-primary"
        )}
      >
        <span className={cn("font-serif text-xl transition-colors", isSelected ? "text-gold font-medium" : "")}>{label}</span>
      </button>
    );
  };

  const MultiSelectOption = ({ fieldName, value, label }: { fieldName: keyof FormData, value: string, label: string }) => {
    const currentValues = (watch(fieldName) as string[]) || [];
    const isSelected = currentValues.includes(value);
    
    const toggleSelection = () => {
      if (isSelected) {
        setValue(fieldName, currentValues.filter(v => v !== value) as any, { shouldValidate: true });
      } else {
        setValue(fieldName, [...currentValues, value] as any, { shouldValidate: true });
      }
    };

    return (
      <button
        type="button"
        onClick={toggleSelection}
        className={cn(
          "w-full text-left p-4 md:p-5 border transition-all duration-300 rounded-sm group flex items-center justify-between",
          isSelected 
            ? "border-gold bg-gold/5 text-charcoal shadow-sm" 
            : "border-border/50 bg-white text-text-secondary hover:border-gold/40 hover:bg-white hover:text-text-primary"
        )}
      >
        <span className={cn("text-base md:text-lg transition-colors", isSelected ? "text-gold font-medium" : "")}>{label}</span>
        <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center transition-colors", isSelected ? "border-gold bg-gold text-white" : "border-border")}>
           {isSelected && <CheckCircle size={12} className="text-white" />}
        </div>
      </button>
    );
  };

  const inputClass = (error?: boolean) => cn(
    'w-full bg-transparent border-b text-text-primary text-xl font-serif py-4 placeholder:text-text-faint focus:outline-none transition-colors duration-200',
    error ? 'border-red-500/60' : 'border-border focus:border-gold'
  );

  if (status === 'success') {
    return (
      <div className="pt-32 pb-24 min-h-screen flex flex-col justify-center">
        <Container className="max-w-3xl text-center">
          <FadeIn>
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-8">
              <CheckCircle size={32} className="text-gold" />
            </div>
            <span className="label-text text-gold mb-6 block">CONSULTATION REQUEST RECEIVED</span>
            <h1 className="headline-lg text-text-primary mb-8">
              Thank you, {watch('name')}.
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed max-w-xl mx-auto mb-16">
              We've received your request and the Pathway team will contact you using the details provided to confirm your consultation.
            </p>
            
            <div className="border-t border-border/50 pt-12 text-left max-w-md mx-auto">
              <h3 className="font-serif text-2xl text-text-primary mb-6">Pathway Education Consultancy</h3>
              <div className="space-y-4 text-text-secondary">
                <p>1st Floor, Yusuf Corner,<br/>Godi Road,<br/>Dahod, Gujarat – 389151</p>
                <div className="space-y-1">
                  <p>+91 75062 84722</p>
                  <p>+91 94091 61562</p>
                </div>
                <p>pathwayeduconsultancy53@gmail.com</p>
              </div>
            </div>
          </FadeIn>
        </Container>
      </div>
    );
  }

  const STEPS_CONTENT = [
    {
      headline: "Let's find your\nPathway.",
      description: "Tell us a little about where you are today and what you're planning next. We'll use this information to understand how we can guide you.",
    },
    {
      headline: "What do you need help with?",
      description: "Select all the areas where you are looking for guidance. This helps us assign the right expert.",
    },
    {
      headline: "Where are you looking?",
      description: "You can select multiple destinations across India and abroad.",
    },
    {
      headline: "Tell us about your plans.",
      description: "Give us some context about your current academic background and future goals.",
    },
    {
      headline: "Contact details.",
      description: "How can we reach you to schedule the consultation?",
    },
    {
      headline: "Consultation preference.",
      description: "When and how would you prefer to speak with our counsellors?",
    }
  ];

  return (
    <div className="min-h-screen flex flex-col pt-24 pb-12">
      {/* Top Progress Bar */}
      <div className="w-full fixed top-20 left-0 z-40 bg-bg-primary/90 backdrop-blur-md border-b border-border/50 py-4">
        <Container className="max-w-7xl flex items-center gap-6">
          <span className="font-serif text-base tracking-widest text-text-primary whitespace-nowrap">
            {String(step).padStart(2, '0')} / {String(TOTAL_STEPS).padStart(2, '0')}
          </span>
          <div className="h-px bg-border flex-1 relative">
            <div 
              className="absolute top-0 left-0 h-full bg-gold transition-all duration-700 ease-out"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </Container>
      </div>

      <Container className="max-w-7xl mt-12 flex-1 flex flex-col">
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 flex-1">
            
            {/* LEFT COLUMN: Question Context */}
            <div className="lg:col-span-5 flex flex-col pt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`left-${step}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="label-text text-gold mb-6 block">STEP {String(step).padStart(2, '0')}</span>
                  <h1 className="headline-lg text-text-primary mb-6 whitespace-pre-line text-balance leading-tight">
                    {STEPS_CONTENT[step-1].headline}
                  </h1>
                  <p className="text-text-secondary text-lg leading-relaxed max-w-md">
                    {STEPS_CONTENT[step-1].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT COLUMN: Inputs */}
            <div className="lg:col-span-7 pt-8 pb-32 lg:pb-8">
              <AnimatePresence mode="wait">
                
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <button
                      type="button"
                      onClick={() => setValue('userType', 'Student', { shouldValidate: true })}
                      className={cn(
                        "w-full text-left p-8 md:p-12 border transition-all duration-300 rounded-sm group flex flex-col gap-4 relative overflow-hidden",
                        watch('userType') === 'Student' 
                          ? "border-gold bg-gold/5 shadow-sm" 
                          : "border-border/50 bg-white hover:border-gold/40 hover:bg-white"
                      )}
                    >
                      <span className="label-text text-text-muted">01</span>
                      <span className={cn("font-serif text-3xl md:text-4xl", watch('userType') === 'Student' ? "text-gold" : "text-text-primary")}>STUDENT</span>
                      <p className="text-text-secondary text-lg">Planning your own education journey.</p>
                      <ArrowRight className={cn("absolute right-8 top-1/2 -translate-y-1/2 transition-all duration-300", watch('userType') === 'Student' ? "text-gold translate-x-0 opacity-100" : "text-text-faint -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100")} size={24} />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setValue('userType', 'Parent', { shouldValidate: true })}
                      className={cn(
                        "w-full text-left p-8 md:p-12 border transition-all duration-300 rounded-sm group flex flex-col gap-4 relative overflow-hidden",
                        watch('userType') === 'Parent' 
                          ? "border-gold bg-gold/5 shadow-sm" 
                          : "border-border/50 bg-white hover:border-gold/40 hover:bg-white"
                      )}
                    >
                      <span className="label-text text-text-muted">02</span>
                      <span className={cn("font-serif text-3xl md:text-4xl", watch('userType') === 'Parent' ? "text-gold" : "text-text-primary")}>PARENT</span>
                      <p className="text-text-secondary text-lg">Looking for guidance for your child.</p>
                      <ArrowRight className={cn("absolute right-8 top-1/2 -translate-y-1/2 transition-all duration-300", watch('userType') === 'Parent' ? "text-gold translate-x-0 opacity-100" : "text-text-faint -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100")} size={24} />
                    </button>
                    
                    {errors.userType && <p className="text-red-400 text-sm mt-2">{errors.userType.message}</p>}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {SERVICES.map(service => (
                       <MultiSelectOption key={service} fieldName="servicesOfInterest" value={service} label={service} />
                    ))}
                    {errors.servicesOfInterest && <p className="text-red-400 text-sm mt-2 sm:col-span-2">{errors.servicesOfInterest.message}</p>}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-12"
                  >
                    <div>
                      <h3 className="label-text text-text-muted mb-6">INDIA</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {DESTINATIONS_INDIA.map(dest => (
                          <MultiSelectOption key={dest} fieldName="destinations" value={dest} label={dest} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="label-text text-text-muted mb-6">ABROAD</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {DESTINATIONS_ABROAD.map(dest => (
                          <MultiSelectOption key={dest} fieldName="destinations" value={dest} label={dest} />
                        ))}
                      </div>
                    </div>
                    {errors.destinations && <p className="text-red-400 text-sm mt-2">{errors.destinations.message}</p>}
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div>
                        <input {...register('currentQualification')} placeholder="Current Qualification *" className={inputClass(!!errors.currentQualification)} autoFocus />
                        {errors.currentQualification && <p className="text-red-400 text-sm mt-2">{errors.currentQualification.message}</p>}
                      </div>
                      <div>
                        <input {...register('studyField')} placeholder="Field of Interest *" className={inputClass(!!errors.studyField)} />
                        {errors.studyField && <p className="text-red-400 text-sm mt-2">{errors.studyField.message}</p>}
                      </div>
                      <div>
                        <input {...register('preferredCourse')} placeholder="Preferred Course *" className={inputClass(!!errors.preferredCourse)} />
                        {errors.preferredCourse && <p className="text-red-400 text-sm mt-2">{errors.preferredCourse.message}</p>}
                      </div>
                      <div>
                        <input {...register('currentCity')} placeholder="Current City *" className={inputClass(!!errors.currentCity)} />
                        {errors.currentCity && <p className="text-red-400 text-sm mt-2">{errors.currentCity.message}</p>}
                      </div>
                    </div>
                    <div>
                      <textarea {...register('academicBackground')} placeholder="Briefly describe your academic background *" rows={4} className={cn(inputClass(!!errors.academicBackground), 'resize-none')} />
                      {errors.academicBackground && <p className="text-red-400 text-sm mt-2">{errors.academicBackground.message}</p>}
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <input {...register('name')} placeholder="Full Name *" className={inputClass(!!errors.name)} autoFocus />
                        {errors.name && <p className="text-red-400 text-sm mt-2">{errors.name.message}</p>}
                      </div>
                      <div>
                        <input {...register('phone')} type="tel" placeholder="Phone Number *" className={inputClass(!!errors.phone)} />
                        {errors.phone && <p className="text-red-400 text-sm mt-2">{errors.phone.message}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <input {...register('email')} type="email" placeholder="Email Address *" className={inputClass(!!errors.email)} />
                        {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-12"
                  >
                    <div className="space-y-6">
                      <h3 className="label-text text-text-muted">PREFERRED CONTACT METHOD</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SingleSelectOption fieldName="consultationMethod" value="Phone" label="Phone Call" />
                        <SingleSelectOption fieldName="consultationMethod" value="WhatsApp" label="WhatsApp" />
                        <SingleSelectOption fieldName="consultationMethod" value="Google Meet" label="Google Meet" />
                        <SingleSelectOption fieldName="consultationMethod" value="Zoom" label="Zoom" />
                      </div>
                      {errors.consultationMethod && <p className="text-red-400 text-sm mt-2">{errors.consultationMethod.message}</p>}
                    </div>

                    <div className="space-y-6">
                      <h3 className="label-text text-text-muted">PREFERRED DATE & TIME (OPTIONAL)</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                          <input id="preferredDate" {...register('preferredDate')} type="date" className={inputClass()} />
                        </div>
                        <div>
                          <select id="preferredTime" {...register('preferredTime')} className={cn(inputClass(), 'appearance-none')}>
                            <option value="" className="text-text-primary bg-bg-secondary">Any time</option>
                            {['Morning (9am - 12pm)', 'Afternoon (12pm - 4pm)', 'Evening (4pm - 7pm)'].map(t => (
                              <option key={t} value={t} className="text-text-primary bg-bg-secondary">{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {status === 'error' && (
                      <p className="text-red-400 text-sm">{errorMessage}</p>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Bottom Bar */}
          <div className="fixed bottom-0 left-0 w-full bg-bg-primary/95 backdrop-blur-md border-t border-border/50 py-4 lg:py-6 z-50">
            <Container className="max-w-7xl flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={status === 'loading'}
                  className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors duration-300 font-medium tracking-wide disabled:opacity-50"
                >
                  <ArrowLeft size={16} /> Back
                </button>
              ) : <div />}

              {step < TOTAL_STEPS ? (
                <Button 
                  type="button"
                  variant="primary" 
                  withArrow 
                  onClick={() => {
                    if (step === 1) nextStep(['userType']);
                    else if (step === 2) nextStep(['servicesOfInterest']);
                    else if (step === 3) nextStep(['destinations']);
                    else if (step === 4) nextStep(['currentQualification', 'studyField', 'preferredCourse', 'currentCity', 'academicBackground']);
                    else if (step === 5) nextStep(['name', 'email', 'phone']);
                  }}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  disabled={status === 'loading'}
                  className="min-w-[140px]"
                >
                  {status === 'loading' ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Submit Request'}
                </Button>
              )}
            </Container>
          </div>
        </form>
      </Container>
    </div>
  );
}