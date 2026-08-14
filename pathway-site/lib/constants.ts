import type { NavItem } from '@/types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Career & Admissions', href: '/#career-admissions' },
  { label: 'Study Abroad', href: '/#study-abroad' },
  { label: 'Services', href: '/services' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Success Stories', href: '/success-stories' },
  { label: 'Insights', href: '/insights' },
];

export const SITE_CONFIG = {
  name: 'Pathway Education Consultancy',
  tagline: 'Your future deserves a Pathway.',
  description:
    'Pathway is an international education consultancy in Dahod, Gujarat helping students build the path to universities in India and abroad.',
  email: 'pathwayeduconsultancy53@gmail.com',
  phone: '+91 75062 84722',
  phoneAlt: '+91 94091 61562',
  address: '1st Floor, Yusuf Corner, Godi Road, Dahod, Gujarat – 389151, India',
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
