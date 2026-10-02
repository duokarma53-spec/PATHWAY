export interface Lead {
  id: string;
  leadCode: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  preferredDestination: string;
  course: string;
  intake: string;
  qualification: string;
  leadSource: "Website" | "WhatsApp" | "Phone" | "Walk-in" | "Referral" | "Instagram" | "Other";
  assignedCounsellor: string;
  counsellorAvatar?: string;
  status: "New" | "Contacted" | "Counselling Scheduled" | "Counselling Completed" | "Interested" | "Application Started" | "Converted to Student" | "Not Interested" | "Lost";
  priority: "Low" | "Medium" | "High" | "Urgent";
  createdDate: string;
  lastContacted: string;
  nextFollowUp: string;
  notesCount: number;
  message?: string;
  budget?: string;
  dob?: string;
  city?: string;
  country?: string;
  institution?: string;
  gpaOrScore?: string;
  englishTest?: string;
  englishScore?: string;
  studyLevel?: string;
  timeline?: {
    id: string;
    stage: string;
    title: string;
    description: string;
    timestamp: string;
    actor: string;
    completed: boolean;
  }[];
  notes?: {
    id: string;
    author: string;
    role: string;
    content: string;
    timestamp: string;
    isPinned?: boolean;
  }[];
}

export interface Student {
  id: string;
  studentCode: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  dob: string;
  passportNumber: string;
  city: string;
  country: string;
  highestQualification: string;
  institution: string;
  gpaOrPercentage: string;
  englishTest: string;
  englishScore: string;
  destination: string;
  course: string;
  intake: string;
  counsellor: string;
  status: "Prospect" | "Counselling" | "Application" | "Offer Received" | "Deposit Paid" | "Visa Processing" | "Visa Approved" | "Enrolled" | "Completed" | "Lost";
  visaStatus: "Not Applied" | "Documents Preparing" | "Lodged" | "Biometrics Done" | "Approved" | "Refused";
  enrollmentStatus: "Pending" | "Confirmed" | "Deferred" | "Enrolled";
  documentProgress: number; // e.g. 80%
  totalPaid: number;
  balanceDue: number;
  createdAt: string;
  applicationsCount: number;
}

export interface Application {
  id: string;
  applicationCode: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  university: string;
  universityLogo?: string;
  country: string;
  course: string;
  intake: string;
  counsellor: string;
  applicationDate: string;
  deadline: string;
  status: "Shortlisted" | "Documents Pending" | "Ready to Apply" | "Application Submitted" | "Under Review" | "Conditional Offer" | "Unconditional Offer" | "Rejected" | "Deposit Pending" | "Deposit Paid" | "Visa Processing" | "Completed";
  offerStatus: "Pending" | "Conditional" | "Unconditional" | "Declined";
  depositStatus: "Not Required" | "Pending" | "Paid";
  visaStatus: "Not Started" | "In Process" | "Granted" | "Refused";
  fees: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  logo: string;
  ranking: number;
  popularCourses: string[];
  tuitionRange: string;
  intakes: string[];
  deadline: string;
  entryRequirements: string;
  englishRequirements: string;
  scholarships: string;
  website: string;
  type: "Public Research" | "Private" | "Russell Group" | "Ivy League / Tier 1" | "Go8 Australia";
}

export interface Destination {
  id: string;
  name: string;
  code: string;
  flag: string;
  universitiesCount: number;
  popularCourses: string[];
  visaInfo: string;
  intakeDates: string;
  requirements: string;
  estimatedTuition: string;
  livingCosts: string;
  scholarships: string;
  importantDeadlines: string;
}

export interface StudentDocument {
  id: string;
  studentId: string;
  studentName: string;
  category: "Passport" | "Academic transcripts" | "Degree certificate" | "Resume/CV" | "SOP" | "LOR" | "English test" | "Financial documents" | "Offer letter" | "Visa documents" | "Other";
  fileName: string;
  fileSize: string;
  uploadDate: string;
  expiryDate?: string;
  status: "Not Submitted" | "Requested" | "Uploaded" | "Under Review" | "Approved" | "Rejected";
  verified: boolean;
  notes?: string;
}

export interface CRMTask {
  id: string;
  title: string;
  category: "Call follow-up" | "WhatsApp follow-up" | "Email follow-up" | "Document reminder" | "Application reminder" | "Visa reminder" | "Appointment" | "Custom task";
  entityName: string;
  entityType: "Lead" | "Student";
  assignedStaff: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Pending" | "In Progress" | "Completed" | "Overdue";
  notes: string;
}

export interface Appointment {
  id: string;
  studentName: string;
  counsellor: string;
  date: string;
  time: string;
  type: "Initial counselling" | "Follow-up" | "University counselling" | "Visa counselling" | "Document review" | "Parent meeting";
  status: "Scheduled" | "Completed" | "Cancelled" | "No Show";
  mode: "Office In-Person" | "Zoom Video" | "Phone Call";
  notes: string;
}

export interface PaymentRecord {
  id: string;
  invoiceRef: string;
  studentId: string;
  studentName: string;
  service: string;
  amount: number;
  amountPaid: number;
  remaining: number;
  paymentDate: string;
  method: "Bank Transfer" | "UPI / Net Banking" | "Credit Card" | "Cheque / Cash";
  status: "Pending" | "Partial" | "Paid" | "Overdue";
}

export interface StaffMember {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  role: "Super Admin" | "Admin" | "Counsellor" | "Staff";
  department: "Management" | "Admissions" | "Visa Processing" | "Student Support";
  status: "Active" | "Away" | "Inactive";
  assignedLeads: number;
  assignedStudents: number;
  pendingFollowups: number;
  applications: number;
  completedTasks: number;
}

export interface ActivityLog {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  entity: string;
  entityCode: string;
  timestamp: string;
  type: "lead" | "student" | "application" | "document" | "task" | "payment";
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "inquiry" | "lead" | "followup" | "document" | "deadline" | "payment";
  time: string;
  read: boolean;
  link: string;
}

// ==========================================
// MOCK DATA STORES
// ==========================================

export const INITIAL_LEADS: Lead[] = [];

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_APPLICATIONS: Application[] = [];

export const INITIAL_UNIVERSITIES: University[] = [
  {
    id: "uni-1",
    name: "University of Manchester",
    country: "United Kingdom",
    city: "Manchester",
    logo: "UoM",
    ranking: 32,
    popularCourses: ["MSc Data Science", "Computer Science", "Business Analytics", "Biotechnology"],
    tuitionRange: "£24,000 - £33,000",
    intakes: ["September", "January"],
    deadline: "Jan 15 (Rolling until June for Int'l)",
    entryRequirements: "60-65% in recognized Indian Bachelor's degree (First Class).",
    englishRequirements: "IELTS 6.5 - 7.0 overall with no sub-score below 6.0.",
    scholarships: "Global Futures Scholarship (£5,000 to £10,000).",
    website: "https://www.manchester.ac.uk",
    type: "Russell Group"
  },
  {
    id: "uni-2",
    name: "University of Melbourne",
    country: "Australia",
    city: "Melbourne, Victoria",
    logo: "UniMelb",
    ranking: 13,
    popularCourses: ["Master of Information Tech", "Master of Finance", "Master of Management", "BioMed"],
    tuitionRange: "AUD $42,000 - $54,000",
    intakes: ["February (Semester 1)", "July (Semester 2)"],
    deadline: "April 30 for Semester 2 / Nov 30 for Semester 1",
    entryRequirements: "Minimum 65-70% in Bachelor from Section 1 university.",
    englishRequirements: "IELTS 6.5 overall (no band less than 6.0).",
    scholarships: "Melbourne International Undergraduate & Graduate Scholarships (up to 50% tuition).",
    website: "https://www.unimelb.edu.au",
    type: "Go8 Australia"
  },
  {
    id: "uni-3",
    name: "New York University (NYU)",
    country: "United States",
    city: "New York City",
    logo: "NYU",
    ranking: 38,
    popularCourses: ["MS Computer Science (Courant)", "MBA (Stern)", "Data Science", "Economics"],
    tuitionRange: "$54,000 - $66,000",
    intakes: ["Fall (August)", "Spring (January)"],
    deadline: "Dec 1 (Priority) / Jan 15 (Regular)",
    entryRequirements: "4-year Bachelor's with 3.3+ GPA. GRE recommended for STEM.",
    englishRequirements: "TOEFL 100+ or IELTS 7.5.",
    scholarships: "Merit-based departmental awards available.",
    website: "https://www.nyu.edu",
    type: "Ivy League / Tier 1"
  },
  {
    id: "uni-4",
    name: "University of Toronto",
    country: "Canada",
    city: "Toronto, Ontario",
    logo: "UofT",
    ranking: 21,
    popularCourses: ["Master of Applied Computing", "Master of Financial Risk", "Civil Engg"],
    tuitionRange: "CAD $38,000 - $62,000",
    intakes: ["September (Fall)"],
    deadline: "Dec 15 (Early) / Jan 15",
    entryRequirements: "Mid-B equivalent (approx 75-80%) in final two years.",
    englishRequirements: "IELTS 7.0 (no band < 6.5) or TOEFL 93.",
    scholarships: "Lester B. Pearson International Scholarship.",
    website: "https://www.utoronto.ca",
    type: "Public Research"
  },
  {
    id: "uni-5",
    name: "University of Leeds",
    country: "United Kingdom",
    city: "Leeds",
    logo: "Leeds",
    ranking: 75,
    popularCourses: ["MSc International Business", "Law", "Media & Communication", "AI"],
    tuitionRange: "£22,000 - £29,500",
    intakes: ["September"],
    deadline: "June 30",
    entryRequirements: "55-60% in Bachelor's degree.",
    englishRequirements: "IELTS 6.5 overall (minimum 6.0 in all components).",
    scholarships: "International Excellence Award (up to 50% fees).",
    website: "https://www.leeds.ac.uk",
    type: "Russell Group"
  }
];

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: "dest-1",
    name: "United Kingdom",
    code: "UK",
    flag: "🇬🇧",
    universitiesCount: 160,
    popularCourses: ["MSc Data Science", "MBA", "LLM Law", "FinTech", "Biomedical Sciences"],
    visaInfo: "Student Visa (Points-Based System). CAS requirement + 2-year Graduate Route Post-Study Work Visa (3 years for PhD).",
    intakeDates: "Major: September/October; Minor: January/February.",
    requirements: "Recognized Bachelor's (55%-65%), IELTS 6.5+, valid passport, TB clearance for Indian students.",
    estimatedTuition: "£16,000 - £35,000 / year",
    livingCosts: "£1,023/month (outside London) or £1,334/month (inside London)",
    scholarships: "Chevening, Commonwealth, GREAT Scholarships, University Merit waivers.",
    importantDeadlines: "UCAS (Undergrad): Jan 29; Postgraduate: Rolling, best applied before April."
  },
  {
    id: "dest-2",
    name: "United States",
    code: "USA",
    flag: "🇺🇸",
    universitiesCount: 4000,
    popularCourses: ["MS Computer Science", "STEM MBA", "Bioinformatics", "Data Analytics", "Electrical Engg"],
    visaInfo: "F-1 Student Visa. Requires Form I-20, SEVIS fee payment, and in-person US Embassy consular interview. Up to 3 years STEM OPT.",
    intakeDates: "Major: Fall (August/September); Minor: Spring (January); Few: Summer.",
    requirements: "4-year Bachelor's degree (or 3+2 masters), 3.0+ GPA, GRE/GMAT (for select universities), TOEFL 90+ / IELTS 7.0.",
    estimatedTuition: "$25,000 - $65,000 / year",
    livingCosts: "$12,000 - $20,000 / year depending on state",
    scholarships: "Fulbright-Nehru, Graduate Assistantships (RA/TA), Departmental Fellowships.",
    importantDeadlines: "Fall intake: Dec 1 - Feb 15."
  },
  {
    id: "dest-3",
    name: "Canada",
    code: "CA",
    flag: "🇨🇦",
    universitiesCount: 100,
    popularCourses: ["Postgrad Cyber Security", "Project Management", "Data Analytics", "Cloud Tech"],
    visaInfo: "Study Permit via SDS / Non-SDS route. Requires GIC ($20,635 CAD), provincial attestation letter (PAL), upfront medicals.",
    intakeDates: "Fall (September), Winter (January), Spring/Summer (May).",
    requirements: "Min 60%+ in relevant field, IELTS 6.5 (minimum 6.0 in each band) or PTE 60+.",
    estimatedTuition: "CAD $16,000 - $40,000 / year",
    livingCosts: "CAD $20,635 / year (official minimum proof of funds)",
    scholarships: "Vanier CGS, University entrance awards, provincial bursaries.",
    importantDeadlines: "Fall: Jan 15 - March 31."
  },
  {
    id: "dest-4",
    name: "Australia",
    code: "AU",
    flag: "🇦🇺",
    universitiesCount: 43,
    popularCourses: ["Master of Information Technology", "Nursing & Healthcare", "Professional Accounting", "Engineering"],
    visaInfo: "Subclass 500 Student Visa. Genuine Student (GS) assessment requirement, OSHC health cover.",
    intakeDates: "Semester 1 (Feb/March), Semester 2 (July/August), Trimester 3 (November).",
    requirements: "Bachelor's degree with 60%+, IELTS 6.5 with no band less than 6.0.",
    estimatedTuition: "AUD $30,000 - $52,000 / year",
    livingCosts: "AUD $24,505 / year",
    scholarships: "Australia Awards, Destination Australia, Go8 Vice-Chancellor grants.",
    importantDeadlines: "Sem 1: Nov 30; Sem 2: April 30."
  }
];

export const INITIAL_DOCUMENTS: StudentDocument[] = [];

export const INITIAL_TASKS: CRMTask[] = [];

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const INITIAL_PAYMENTS: PaymentRecord[] = [];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: "staff-1",
    name: "Owner",
    avatar: "OW",
    email: "owner@pathway.com",
    phone: "+91 98200 11223",
    role: "Super Admin",
    department: "Management",
    status: "Active",
    assignedLeads: 8,
    assignedStudents: 14,
    pendingFollowups: 2,
    applications: 22,
    completedTasks: 184
  },
  {
    id: "staff-2",
    name: "Rohan Varma",
    avatar: "RV",
    email: "rohan@pathway.com",
    phone: "+91 98111 22334",
    role: "Counsellor",
    department: "Admissions",
    status: "Active",
    assignedLeads: 16,
    assignedStudents: 18,
    pendingFollowups: 5,
    applications: 29,
    completedTasks: 142
  },
  {
    id: "staff-3",
    name: "Neha Sharma",
    avatar: "NS",
    email: "neha@pathway.com",
    phone: "+91 98222 33445",
    role: "Counsellor",
    department: "Admissions",
    status: "Active",
    assignedLeads: 14,
    assignedStudents: 12,
    pendingFollowups: 4,
    applications: 19,
    completedTasks: 118
  },
  {
    id: "staff-4",
    name: "Dev Patel",
    avatar: "DP",
    email: "dev@pathway.com",
    phone: "+91 98333 44556",
    role: "Counsellor",
    department: "Visa Processing",
    status: "Active",
    assignedLeads: 9,
    assignedStudents: 15,
    pendingFollowups: 3,
    applications: 24,
    completedTasks: 96
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_COMM_TEMPLATES = [
  {
    id: "tpl-1",
    name: "Welcome Message (First Inquiry)",
    subject: "Welcome to Pathway Education Consultancy",
    channel: "WhatsApp & Email",
    body: `Hello {{name}},

Thank you for reaching out to Pathway Education Consultancy regarding your plans to study in {{destination}} for {{intake}}.

I have reviewed your profile for {{course}} and would love to schedule a complimentary 1-on-1 counseling session with our senior counselor.

When would be a convenient time for a quick 15-minute discovery call today or tomorrow?

Warm regards,
{{counsellor}}
Pathway Education Consultancy`
  },
  {
    id: "tpl-2",
    name: "Document Checklist Reminder",
    subject: "Required Documents for your University Application",
    channel: "Email",
    body: `Dear {{name}},

To proceed with your application for {{university}}, please upload the following pending documents to your Pathway student portal:
- Passport front & back bio pages
- Official degree transcripts
- Updated CV and draft Statement of Purpose (SOP)
- IELTS / TOEFL / PTE score card

Let us know if you need assistance with document formats.

Best regards,
Admissions Team | Pathway`
  },
  {
    id: "tpl-3",
    name: "Offer Letter Congratulations",
    subject: "Congratulations! University Offer Received",
    channel: "WhatsApp & Email",
    body: `Dear {{name}},

Fantastic news! We have received an Offer Letter from {{university}} for your course {{course}} ({{intake}}).

Our team has uploaded the official offer document to your portal. Please review the conditional requirements and reply so we can initiate your deposit and visa preparation.

Congratulations once again!
Pathway Consultancy`
  },
  {
    id: "tpl-4",
    name: "Visa Preparation Notice",
    subject: "Commencing Your Student Visa Filing Process",
    channel: "Email",
    body: `Hello {{name}},

With your university offer confirmed, our visa compliance department is now ready to lodge your {{destination}} student visa.

Please verify that your financial sponsorship documents and medical examination reports are current.

Warm regards,
Visa Services | Pathway`
  }
];
