// PATHWAY — Shared TypeScript Types

export interface Destination {
  id: string;
  slug: string;
  name: string;
  flag: string;
  overview: string;
  popularCourses: string[];
  visaInfo: string;
  imageUrl: string;
  averagTuitionMin: number;
  averagTuitionMax: number;
  currency: string;
  applicationPeriod: string;
  isPublished: boolean;
}

export interface University {
  id: string;
  name: string;
  country: string;
  logoUrl?: string;
  rank?: number;
  programs: string[];
  websiteUrl?: string;
  destinationId: string;
  isFeatured: boolean;
}

export interface Service {
  id: string;
  slug: string;
  orderNum: number;
  title: string;
  shortDescription: string;
  detailContent?: string;
  icon: string;
  isPublished: boolean;
}

export interface SuccessStory {
  id: string;
  slug: string;
  studentName: string;
  background: string;
  challenge: string;
  strategy: string;
  outcome: string;
  university: string;
  course: string;
  country: string;
  imageUrl?: string;
  isDemo: boolean;
  isPublished: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  education: string;
  expertise: string[];
  photoUrl?: string;
  linkedinUrl?: string;
  displayOrder: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
  category: BlogCategory;
  author: string;
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Lead {
  studentName: string;
  parentName?: string;
  email: string;
  phone: string;
  grade: string;
  destination: string;
  course: string;
  city: string;
  message?: string;
}

export interface Consultation {
  name: string;
  email: string;
  phone: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
