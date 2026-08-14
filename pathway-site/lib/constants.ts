import type { NavItem } from '@/types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Services', href: '/services' },
  { label: 'Universities', href: '/universities' },
  { label: 'Success Stories', href: '/success-stories' },
  { label: 'Insights', href: '/insights' },
];

export const SITE_CONFIG = {
  name: 'Pathway',
  tagline: 'Your future deserves a Pathway.',
  description:
    'Pathway is a premium international education consultancy helping Indian students build the path to the university and future they envision.',
  email: 'hello@pathwayconsultancy.in',
  phone: '+91 98765 43210',
  address: 'Mumbai, India',
  social: {
    instagram: 'https://instagram.com/',
    linkedin: 'https://linkedin.com/',
    youtube: 'https://youtube.com/',
  },
};

export const COUNTRIES = [
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Germany',
  'Ireland',
  'New Zealand',
  'Singapore',
] as const;

export const EDUCATION_LEVELS = [
  'Grade 10 (SSC/ICSE/CBSE)',
  'Grade 11',
  'Grade 12 (HSC/ISC/CBSE)',
  'Undergraduate (pursuing)',
  'Undergraduate (completed)',
  'Postgraduate (pursuing)',
  'Postgraduate (completed)',
  'Working Professional',
] as const;

export const COURSE_FIELDS = [
  'Computer Science / IT',
  'Engineering',
  'Business / MBA',
  'Medicine / Healthcare',
  'Law',
  'Arts & Design',
  'Social Sciences',
  'Natural Sciences',
  'Finance / Economics',
  'Architecture',
  'Education',
  'Undecided',
] as const;
