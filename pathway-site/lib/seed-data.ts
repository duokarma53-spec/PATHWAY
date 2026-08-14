import type { Destination, University, Service, SuccessStory, TeamMember, FaqItem, BlogPost } from '@/types';

// ── DESTINATIONS ─────────────────────────────────────────────
export const DEMO_DESTINATIONS: Destination[] = [
  {
    id: '1', slug: 'united-kingdom', name: 'United Kingdom', flag: '🇬🇧',
    overview: "Home to some of the world's most prestigious universities, the UK offers a rich academic tradition combined with a multicultural, globally connected society.",
    popularCourses: ['Business & Management', 'Engineering', 'Medicine', 'Law', 'Arts & Design', 'Computer Science'],
    visaInfo: 'Student Visa — apply up to 3 months before your course starts.',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&q=80',
    averagTuitionMin: 12000, averagTuitionMax: 38000, currency: 'GBP',
    applicationPeriod: 'September – January (UCAS)', isPublished: true,
  },
  {
    id: '2', slug: 'united-states', name: 'United States', flag: '🇺🇸',
    overview: "The US is home to the world's largest higher education system, offering unparalleled research opportunities, campus life, and career pathways across every field.",
    popularCourses: ['Computer Science', 'Business', 'Engineering', 'Data Science', 'Medicine', 'Liberal Arts'],
    visaInfo: 'F-1 Student Visa — apply after receiving your I-20 from your institution.',
    imageUrl: 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=1600&q=80',
    averagTuitionMin: 20000, averagTuitionMax: 60000, currency: 'USD',
    applicationPeriod: 'August – January (varies by university)', isPublished: true,
  },
  {
    id: '3', slug: 'canada', name: 'Canada', flag: '🇨🇦',
    overview: "Canada combines world-class education with post-study work rights and clear pathways to permanent residency — a top choice for career-focused students.",
    popularCourses: ['Engineering', 'Business', 'Computer Science', 'Health Sciences', 'Environmental Studies'],
    visaInfo: 'Study Permit — apply as soon as you receive your letter of acceptance.',
    imageUrl: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1600&q=80',
    averagTuitionMin: 15000, averagTuitionMax: 40000, currency: 'CAD',
    applicationPeriod: 'October – March (January/September intakes)', isPublished: true,
  },
  {
    id: '4', slug: 'australia', name: 'Australia', flag: '🇦🇺',
    overview: "Australia's high quality of life, research-driven institutions and warm climate make it one of the most popular destinations for Indian students.",
    popularCourses: ['Business', 'Engineering', 'Medicine', 'IT & Computing', 'Architecture', 'Agriculture'],
    visaInfo: 'Student Visa (subclass 500) — apply online after enrolment confirmation.',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1600&q=80',
    averagTuitionMin: 18000, averagTuitionMax: 45000, currency: 'AUD',
    applicationPeriod: 'February–August (July/February intakes)', isPublished: true,
  },
  {
    id: '5', slug: 'germany', name: 'Germany', flag: '🇩🇪',
    overview: "Germany offers world-leading engineering, science and technology programmes — many of which are tuition-free at public universities for all international students.",
    popularCourses: ['Engineering', 'Computer Science', 'Physics', 'Economics', 'Medicine'],
    visaInfo: 'National Visa (Type D) for study — apply at the German consulate.',
    imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1600&q=80',
    averagTuitionMin: 0, averagTuitionMax: 3000, currency: 'EUR',
    applicationPeriod: 'November – January / May – July', isPublished: true,
  },
  {
    id: '6', slug: 'ireland', name: 'Ireland', flag: '🇮🇪',
    overview: "Ireland's English-speaking environment, innovation-driven economy and access to European opportunities make it an increasingly attractive destination.",
    popularCourses: ['Technology', 'Pharmaceutical Sciences', 'Business', 'Biotechnology', 'Finance'],
    visaInfo: 'Irish Study Visa — apply through the AVATS portal.',
    imageUrl: 'https://images.unsplash.com/photo-1599753894977-e2a4f2cfb4e4?w=1600&q=80',
    averagTuitionMin: 10000, averagTuitionMax: 25000, currency: 'EUR',
    applicationPeriod: 'November – February', isPublished: true,
  },
  {
    id: '7', slug: 'new-zealand', name: 'New Zealand', flag: '🇳🇿',
    overview: "New Zealand offers safe, progressive campuses with strong research ties and post-study work rights in a stunning natural environment.",
    popularCourses: ['Environmental Science', 'Agriculture', 'Business', 'IT', 'Tourism'],
    visaInfo: 'Fee-paying student visa — apply online at Immigration NZ.',
    imageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1600&q=80',
    averagTuitionMin: 22000, averagTuitionMax: 35000, currency: 'NZD',
    applicationPeriod: 'March – October', isPublished: true,
  },
  {
    id: '8', slug: 'singapore', name: 'Singapore', flag: '🇸🇬',
    overview: "Singapore is Asia's education hub — globally ranked universities, a safe cosmopolitan city-state, and a gateway to Asia's fastest growing economies.",
    popularCourses: ['Finance', 'Engineering', 'Computer Science', 'Business Analytics', 'Medicine'],
    visaInfo: "Student's Pass — apply via the SOLAR system.",
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1600&q=80',
    averagTuitionMin: 15000, averagTuitionMax: 40000, currency: 'SGD',
    applicationPeriod: 'November – March', isPublished: true,
  },
];

// ── SERVICES ──────────────────────────────────────────────────
export const DEMO_SERVICES: Service[] = [
  { id: '1', slug: 'career-discovery', orderNum: 1, title: 'Career & Course Discovery', shortDescription: "We start by understanding you — your strengths, interests, academic profile and long-term aspirations — before recommending a direction.", icon: 'Compass', isPublished: true },
  { id: '2', slug: 'university-shortlisting', orderNum: 2, title: 'University Shortlisting', shortDescription: "A curated shortlist of universities that genuinely fit your academic profile, budget, and career goals — not a generic list.", icon: 'Building2', isPublished: true },
  { id: '3', slug: 'application-strategy', orderNum: 3, title: 'Application Strategy', shortDescription: "We build a deliberate application strategy: which universities, in what order, and how to position you for each.", icon: 'Target', isPublished: true },
  { id: '4', slug: 'sop-guidance', orderNum: 4, title: 'SOP & Personal Statement', shortDescription: "We help you find your story and articulate it with clarity — guiding the writing process without ever writing it for you.", icon: 'FileText', isPublished: true },
  { id: '5', slug: 'scholarship-guidance', orderNum: 5, title: 'Scholarship Guidance', shortDescription: "Identifying scholarships you genuinely qualify for and structuring your applications to put you in the strongest possible position.", icon: 'Award', isPublished: true },
  { id: '6', slug: 'application-management', orderNum: 6, title: 'Application Management', shortDescription: "End-to-end tracking and management of every application — deadlines, documents, submissions, and follow-ups.", icon: 'ClipboardList', isPublished: true },
  { id: '7', slug: 'visa-guidance', orderNum: 7, title: 'Visa Guidance', shortDescription: "Navigating the visa process with clear documentation checklists, preparation support, and guidance on what to expect.", icon: 'Globe', isPublished: true },
  { id: '8', slug: 'pre-departure', orderNum: 8, title: 'Pre-Departure Support', shortDescription: "From accommodation and travel to banking and settling in — we ensure you leave prepared and confident.", icon: 'Plane', isPublished: true },
];

// ── SUCCESS STORIES (DEMO — Replace with real content) ────────
export const DEMO_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: '1', slug: 'arjun-msc-london', isDemo: true, isPublished: true,
    studentName: 'Arjun S.',
    background: "Computer Science graduate from a tier-2 college in Pune. Strong technical profile, limited extracurriculars, unsure whether a UK or US master's was the right path.",
    challenge: "Generic GPA and no research experience made top-tier programmes uncertain. Arjun needed a differentiated SOP and a realistic but ambitious shortlist.",
    strategy: "We identified Arjun's internship projects as the core narrative — positioning him as a practitioner, not just a student. We shortlisted universities that valued industry exposure alongside academics.",
    outcome: "Admitted to MSc Computer Science at University College London with a partial merit scholarship covering 25% of tuition.",
    university: 'University College London (UCL)', course: 'MSc Computer Science', country: 'United Kingdom',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  },
  {
    id: '2', slug: 'priya-mba-canada', isDemo: true, isPublished: true,
    studentName: 'Priya M.',
    background: "Marketing professional with 4 years of experience at a Mumbai startup. Wanted an MBA abroad with strong post-study work rights.",
    challenge: "Choosing between Canada and UK, and crafting a compelling leadership narrative without a traditional corporate career path.",
    strategy: "We helped Priya reframe her startup experience as entrepreneurial leadership. Canada's post-study work options aligned better with her immigration goals.",
    outcome: "Accepted to the Rotman School of Management, University of Toronto. Now working in Toronto on a post-graduation work permit.",
    university: 'Rotman School of Management, University of Toronto', course: 'MBA', country: 'Canada',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b9bf1e18?w=800&q=80',
  },
  {
    id: '3', slug: 'rohan-engineering-germany', isDemo: true, isPublished: true,
    studentName: 'Rohan K.',
    background: "Mechanical engineering student from IIT Kharagpur. Interested in automotive engineering and sustainability. Limited budget.",
    challenge: "Wanted to pursue a master's in Germany but was unsure about the language requirement, university selection, and the blocked account process.",
    strategy: "We mapped English-taught master's programmes at top German universities aligned with sustainable engineering. Guided Rohan through the blocked account process and visa documentation.",
    outcome: "Admitted to TU Munich's MSc Sustainable Engineering. Studying tuition-free with a DAAD Scholarship.",
    university: 'Technical University of Munich (TUM)', course: 'MSc Sustainable Engineering', country: 'Germany',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
  },
];

// ── TEAM MEMBERS (DEMO) ───────────────────────────────────────
export const DEMO_TEAM: TeamMember[] = [
  {
    id: '1', name: 'Aisha Kapoor', role: 'Founder & Lead Counsellor',
    bio: "Aisha founded Pathway after a decade of working in international student admissions at universities in the UK and India. She believes the best counselling starts with genuine curiosity about each student's story.",
    education: 'MSc Education Policy, University of Edinburgh',
    expertise: ['UK Admissions', 'Postgraduate Strategy', 'SOP Coaching'],
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
    displayOrder: 1,
  },
  {
    id: '2', name: 'Rahul Sharma', role: 'Senior Counsellor — North America',
    bio: "With a background in US university admissions and a master's from NYU, Rahul specialises in helping students navigate the nuanced landscape of North American graduate and undergraduate applications.",
    education: 'MBA, New York University (Stern)',
    expertise: ['USA', 'Canada', 'MBA Applications', 'Scholarships'],
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80',
    displayOrder: 2,
  },
  {
    id: '3', name: 'Sneha Iyer', role: 'Visa & Documentation Specialist',
    bio: "Sneha brings precision and calm to the visa process — a stage that often causes the most anxiety. She has guided students through applications to 12 countries.",
    education: 'LLB, University of Bangalore',
    expertise: ['Visa Strategy', 'Documentation', 'UK / Australia / Canada Visas'],
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80',
    displayOrder: 3,
  },
];

// ── FAQS ──────────────────────────────────────────────────────
export const DEMO_FAQS: FaqItem[] = [
  { id: '1', question: 'When should I start planning?', answer: "Ideally 12–18 months before your intended intake. This gives you time for test preparation, shortlisting, strong SOPs, and early applications. That said, we work with students at all stages — even those applying within 3–4 months.", category: 'General', displayOrder: 1, isPublished: true },
  { id: '2', question: 'Which countries do you help with?', answer: "We specialise in UK, USA, Canada, Australia, Germany, Ireland, New Zealand, Singapore, and select European destinations. Our counsellors have first-hand experience with each country's admission systems.", category: 'General', displayOrder: 2, isPublished: true },
  { id: '3', question: 'Can you help me shortlist universities?', answer: "Yes — university shortlisting is one of our core services. We build a balanced list of ambitious, realistic, and strong choices based on your academic profile, budget, career goals, and course preferences.", category: 'Services', displayOrder: 3, isPublished: true },
  { id: '4', question: 'Do you help with scholarships?', answer: "Yes. We research scholarships you genuinely qualify for — university merit awards, government scholarships, and external funding — and help you put forward the strongest possible scholarship applications.", category: 'Services', displayOrder: 4, isPublished: true },
  { id: '5', question: 'Do you write my SOP for me?', answer: "No. We guide you through the process of finding your story, structuring it, and articulating it clearly — but the writing must be authentically yours. Universities and visa officers can detect generic statements, and your voice matters.", category: 'Services', displayOrder: 5, isPublished: true },
  { id: '6', question: 'Do you guarantee admission?', answer: "No — and you should be cautious of any consultancy that does. What we guarantee is that your applications will be strategically prepared, professionally presented, and submitted to the right universities for your profile.", category: 'General', displayOrder: 6, isPublished: true },
  { id: '7', question: 'Do you provide visa guidance?', answer: "Yes. We support you through the student visa application process — documents checklist, SOP for visa, financial requirements, and what to expect at the interview if required.", category: 'Services', displayOrder: 7, isPublished: true },
  { id: '8', question: 'What does the initial consultation involve?', answer: "A 45-minute conversation where we listen first. We want to understand your goals, academic profile, aspirations, and concerns before recommending anything. There is no sales pressure — just honest guidance.", category: 'General', displayOrder: 8, isPublished: true },
];

// ── BLOG POSTS ────────────────────────────────────────────────
export const DEMO_BLOG_POSTS: BlogPost[] = [
  {
    id: '1', slug: 'when-to-start-study-abroad-planning',
    title: "When Should You Start Planning to Study Abroad?",
    excerpt: "The most common question we hear — and the honest answer is: earlier than most students think. Here's a month-by-month guide.",
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    category: { id: '1', name: 'Application Tips', slug: 'application-tips' },
    author: 'Aisha Kapoor', publishedAt: '2026-07-15',
  },
  {
    id: '2', slug: 'uk-vs-usa-masters',
    title: "UK vs USA for a Master's Degree: Which is Right for You?",
    excerpt: "Duration, cost, culture, post-study work rights — a clear, unbiased comparison to help you make the right choice.",
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    category: { id: '2', name: 'University Guides', slug: 'university-guides' },
    author: 'Rahul Sharma', publishedAt: '2026-06-28',
  },
  {
    id: '3', slug: 'scholarships-indian-students-2026',
    title: "Top Scholarships for Indian Students Studying Abroad in 2026",
    excerpt: "A curated guide to merit-based, need-based, and country-specific scholarships available to Indian students this cycle.",
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    category: { id: '3', name: 'Scholarships', slug: 'scholarships' },
    author: 'Aisha Kapoor', publishedAt: '2026-06-10',
  },
];

// ── UNIVERSITIES ──────────────────────────────────────────────
export const DEMO_UNIVERSITIES = [
  { id: '1', name: 'University of Oxford', country: 'United Kingdom', destinationId: '1', isFeatured: true, programs: [] },
  { id: '2', name: 'University of Cambridge', country: 'United Kingdom', destinationId: '1', isFeatured: true, programs: [] },
  { id: '3', name: 'Imperial College London', country: 'United Kingdom', destinationId: '1', isFeatured: true, programs: [] },
  { id: '4', name: 'University College London', country: 'United Kingdom', destinationId: '1', isFeatured: true, programs: [] },
  { id: '5', name: 'London School of Economics', country: 'United Kingdom', destinationId: '1', isFeatured: true, programs: [] },
  { id: '6', name: 'MIT', country: 'United States', destinationId: '2', isFeatured: true, programs: [] },
  { id: '7', name: 'Stanford University', country: 'United States', destinationId: '2', isFeatured: true, programs: [] },
  { id: '8', name: 'University of Chicago', country: 'United States', destinationId: '2', isFeatured: true, programs: [] },
  { id: '9', name: 'Columbia University', country: 'United States', destinationId: '2', isFeatured: true, programs: [] },
  { id: '10', name: 'Cornell University', country: 'United States', destinationId: '2', isFeatured: true, programs: [] },
  { id: '11', name: 'University of Toronto', country: 'Canada', destinationId: '3', isFeatured: true, programs: [] },
  { id: '12', name: 'McGill University', country: 'Canada', destinationId: '3', isFeatured: true, programs: [] },
  { id: '13', name: 'University of British Columbia', country: 'Canada', destinationId: '3', isFeatured: true, programs: [] },
  { id: '14', name: 'University of Melbourne', country: 'Australia', destinationId: '4', isFeatured: true, programs: [] },
  { id: '15', name: 'Australian National University', country: 'Australia', destinationId: '4', isFeatured: true, programs: [] },
  { id: '16', name: 'University of Sydney', country: 'Australia', destinationId: '4', isFeatured: true, programs: [] },
  { id: '17', name: 'TU Munich', country: 'Germany', destinationId: '5', isFeatured: true, programs: [] },
  { id: '18', name: 'Heidelberg University', country: 'Germany', destinationId: '5', isFeatured: true, programs: [] },
  { id: '19', name: 'Trinity College Dublin', country: 'Ireland', destinationId: '6', isFeatured: true, programs: [] },
  { id: '20', name: 'NUS Singapore', country: 'Singapore', destinationId: '8', isFeatured: true, programs: [] },
];

export const HOW_IT_WORKS_STEPS = [
  { number: '01', title: 'Discover', description: "A deep-dive consultation to understand your goals, academic profile, interests, and what you want from your international education." },
  { number: '02', title: 'Define', description: "Together, we define the right countries, course areas, and university profiles that genuinely align with where you're going." },
  { number: '03', title: 'Shortlist', description: "A curated, balanced shortlist — ambitious choices, realistic targets, and strong fallbacks — built around your specific profile." },
  { number: '04', title: 'Prepare', description: "SOPs, essays, recommendations, test preparation — every element of your application guided with care and strategic intent." },
  { number: '05', title: 'Apply', description: "We manage your applications — every deadline, every document, every submission — so nothing falls through the cracks." },
  { number: '06', title: 'Arrive', description: "Visa guidance, pre-departure preparation, and the knowledge that you're stepping into your next chapter fully ready." },
];

export const WHY_PATHWAY = [
  { title: 'Deeply Personal', description: "We work with a small number of students at a time. You are never a number in our system. Every recommendation comes from understanding you specifically." },
  { title: 'Honest Guidance', description: "We tell you what you need to hear, not what you want to hear. That includes realistic assessments of your profile and genuine shortlists — not aspirational fictions." },
  { title: 'Strategic Thinking', description: "We think about your application the way a great admissions reader does — identifying strengths, addressing gaps, and crafting a coherent narrative across every element." },
  { title: 'End-to-End', description: "From the first conversation about which country might suit you, through to your visa documentation and pre-departure checklist — we are with you the whole way." },
];

export const DESTINATION_TICKER_ITEMS = [
  'United Kingdom', 'United States', 'Canada', 'Australia', 'Germany', 
  'Ireland', 'New Zealand', 'Singapore', 'Netherlands', 'France',
  'Sweden', 'Switzerland', 'UAE', 'Japan', 'South Korea',
];
