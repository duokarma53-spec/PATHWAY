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

export const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-1",
    leadCode: "LD-1048",
    firstName: "Aarav",
    lastName: "Mehta",
    name: "Aarav Mehta",
    email: "aarav.mehta@example.com",
    phone: "+91 98201 44521",
    avatar: "AM",
    preferredDestination: "United Kingdom",
    course: "MSc Data Science & AI",
    intake: "Sept 2026",
    qualification: "B.Tech Computer Science (8.4 CGPA)",
    leadSource: "Website",
    assignedCounsellor: "Rohan Varma",
    counsellorAvatar: "RV",
    status: "New",
    priority: "Urgent",
    createdDate: "2026-09-27T10:15:00Z",
    lastContacted: "Not yet",
    nextFollowUp: "Today, 4:00 PM",
    notesCount: 1,
    budget: "£25,000 - £32,000/year",
    dob: "2003-05-14",
    city: "Mumbai",
    country: "India",
    institution: "VJTI Mumbai",
    gpaOrScore: "8.4 / 10 CGPA",
    englishTest: "IELTS Academic",
    englishScore: "7.5 (L:8, R:7.5, W:7, S:7)",
    studyLevel: "Postgraduate (Masters)",
    message: "Hi, I graduated in June 2025 and want to apply for Sept 2026 UK Masters. Looking specifically at Manchester, Leeds, and Bristol.",
    timeline: [
      { id: "tl-1", stage: "Inquiry", title: "Website Inquiry Received", description: "Form submitted for MSc Data Science UK Sept 2026.", timestamp: "2026-09-27 10:15 AM", actor: "System", completed: true },
      { id: "tl-2", stage: "Counselling", title: "Assigned to Counsellor", description: "Automatically routed to UK Specialist Rohan Varma.", timestamp: "2026-09-27 10:16 AM", actor: "System", completed: true }
    ],
    notes: [
      { id: "n-1", author: "Rohan Varma", role: "UK Lead Counsellor", content: "High caliber candidate with strong IELTS score. Wants top 15 Russell Group universities. Reach out via WhatsApp first.", timestamp: "2026-09-27 10:30 AM", isPinned: true }
    ]
  },
  {
    id: "lead-2",
    leadCode: "LD-1047",
    firstName: "Simran",
    lastName: "Kaur",
    name: "Simran Kaur",
    email: "simran.kaur@example.com",
    phone: "+91 97112 88419",
    avatar: "SK",
    preferredDestination: "Canada",
    course: "Post-Graduate Diploma in Cyber Security",
    intake: "Jan 2027",
    qualification: "BCA (74%)",
    leadSource: "WhatsApp",
    assignedCounsellor: "Neha Sharma",
    counsellorAvatar: "NS",
    status: "Contacted",
    priority: "High",
    createdDate: "2026-09-26T14:20:00Z",
    lastContacted: "Yesterday, 3:30 PM",
    nextFollowUp: "Tomorrow, 11:00 AM",
    notesCount: 2,
    budget: "CAD $18,000 - $22,000/year",
    dob: "2002-11-08",
    city: "Chandigarh",
    country: "India",
    institution: "Panjab University",
    gpaOrScore: "74%",
    englishTest: "PTE Academic",
    englishScore: "68 Overall",
    studyLevel: "Post-Degree Diploma",
    message: "Interested in Ontario or BC colleges offering 3-year PGWP.",
    timeline: [
      { id: "tl-3", stage: "Inquiry", title: "WhatsApp Lead Generated", description: "Inquired via direct WhatsApp business click.", timestamp: "2026-09-26 02:20 PM", actor: "System", completed: true },
      { id: "tl-4", stage: "Contacted", title: "First Discovery Call Done", description: "Discussed Sheridan and Seneca College program requirements.", timestamp: "2026-09-26 03:30 PM", actor: "Neha Sharma", completed: true }
    ],
    notes: [
      { id: "n-2", author: "Neha Sharma", role: "Canada Specialist", content: "PTE score verified. She has 1 year IT work exp as junior technician. Eligible for SDS stream.", timestamp: "2026-09-26 03:45 PM", isPinned: false }
    ]
  },
  {
    id: "lead-3",
    leadCode: "LD-1046",
    firstName: "Aditya",
    lastName: "Rao",
    name: "Aditya Rao",
    email: "aditya.rao@example.com",
    phone: "+91 98450 12093",
    avatar: "AR",
    preferredDestination: "Australia",
    course: "Master of Business Information Technology",
    intake: "July 2026",
    qualification: "B.Com (68%)",
    leadSource: "Referral",
    assignedCounsellor: "Rohan Varma",
    counsellorAvatar: "RV",
    status: "Counselling Scheduled",
    priority: "High",
    createdDate: "2026-09-25T11:00:00Z",
    lastContacted: "Sept 25, 4:00 PM",
    nextFollowUp: "Today, 5:30 PM",
    notesCount: 1,
    budget: "AUD $38,000/year",
    dob: "2001-09-20",
    city: "Bengaluru",
    country: "India",
    institution: "Christ University",
    gpaOrScore: "68%",
    englishTest: "IELTS",
    englishScore: "6.5 Overall",
    studyLevel: "Masters",
    timeline: [
      { id: "tl-5", stage: "Inquiry", title: "Friend Referral", description: "Referred by current student Tanmay Shenoy.", timestamp: "2026-09-25 11:00 AM", actor: "System", completed: true },
      { id: "tl-6", stage: "Counselling", title: "Session Booked", description: "In-office session scheduled with parents.", timestamp: "2026-09-25 04:00 PM", actor: "Rohan Varma", completed: true }
    ]
  },
  {
    id: "lead-4",
    leadCode: "LD-1045",
    firstName: "Fatima",
    lastName: "Noor",
    name: "Fatima Noor",
    email: "fatima.noor@example.com",
    phone: "+971 50 839 2104",
    avatar: "FN",
    preferredDestination: "United States",
    course: "MS Biomedical Engineering",
    intake: "Fall 2026",
    qualification: "B.Tech Bio-Engineering (3.8 GPA)",
    leadSource: "Website",
    assignedCounsellor: "Dev Patel",
    counsellorAvatar: "DP",
    status: "Application Started",
    priority: "Urgent",
    createdDate: "2026-09-22T09:30:00Z",
    lastContacted: "Today, 11:00 AM",
    nextFollowUp: "Tomorrow, 2:00 PM",
    notesCount: 3,
    budget: "$45,000/year",
    dob: "2003-01-19",
    city: "Dubai",
    country: "UAE",
    institution: "BITS Pilani Dubai Campus",
    gpaOrScore: "3.8 / 4.0",
    englishTest: "TOEFL iBT",
    englishScore: "108 Overall",
    studyLevel: "Masters"
  },
  {
    id: "lead-5",
    leadCode: "LD-1044",
    firstName: "Kavya",
    lastName: "Reddy",
    name: "Kavya Reddy",
    email: "kavya.reddy@example.com",
    phone: "+91 99890 55112",
    avatar: "KR",
    preferredDestination: "United Kingdom",
    course: "LLM International Commercial Law",
    intake: "Sept 2026",
    qualification: "BA LLB (72%)",
    leadSource: "Instagram",
    assignedCounsellor: "Rohan Varma",
    counsellorAvatar: "RV",
    status: "Counselling Completed",
    priority: "Medium",
    createdDate: "2026-09-21T16:45:00Z",
    lastContacted: "Sept 24, 2:00 PM",
    nextFollowUp: "Oct 1, 12:00 PM",
    notesCount: 2,
    city: "Hyderabad"
  },
  {
    id: "lead-6",
    leadCode: "LD-1043",
    firstName: "Vikram",
    lastName: "Singhania",
    name: "Vikram Singhania",
    email: "vikram.s@example.com",
    phone: "+91 98190 33214",
    avatar: "VS",
    preferredDestination: "United States",
    course: "MBA in Finance",
    intake: "Fall 2026",
    qualification: "BBA (3.6 GPA) + 3 yrs work ex",
    leadSource: "Walk-in",
    assignedCounsellor: "Dev Patel",
    counsellorAvatar: "DP",
    status: "Interested",
    priority: "Medium",
    createdDate: "2026-09-20T12:00:00Z",
    lastContacted: "Sept 23, 10:00 AM",
    nextFollowUp: "Oct 2, 4:00 PM",
    notesCount: 1,
    city: "Delhi"
  },
  {
    id: "lead-7",
    leadCode: "LD-1042",
    firstName: "Ananya",
    lastName: "Deshmukh",
    name: "Ananya Deshmukh",
    email: "ananya.d@example.com",
    phone: "+91 94220 77189",
    avatar: "AD",
    preferredDestination: "Australia",
    course: "Master of Architecture",
    intake: "July 2026",
    qualification: "B.Arch (First Class)",
    leadSource: "Website",
    assignedCounsellor: "Neha Sharma",
    counsellorAvatar: "NS",
    status: "New",
    priority: "High",
    createdDate: "2026-09-27T08:10:00Z",
    lastContacted: "Not yet",
    nextFollowUp: "Today, 6:00 PM",
    notesCount: 0,
    city: "Pune"
  },
  {
    id: "lead-8",
    leadCode: "LD-1041",
    firstName: "Tariq",
    lastName: "Ahmed",
    name: "Tariq Ahmed",
    email: "tariq.ahmed@example.com",
    phone: "+91 97970 12890",
    avatar: "TA",
    preferredDestination: "Canada",
    course: "Diploma in Cloud Computing",
    intake: "Sept 2026",
    qualification: "B.Sc Computer Science (62%)",
    leadSource: "Phone",
    assignedCounsellor: "Neha Sharma",
    counsellorAvatar: "NS",
    status: "Contacted",
    priority: "Low",
    createdDate: "2026-09-18T15:10:00Z",
    lastContacted: "Sept 22, 11:30 AM",
    nextFollowUp: "Oct 5, 2:00 PM",
    notesCount: 1,
    city: "Srinagar"
  },
  {
    id: "lead-9",
    leadCode: "LD-1040",
    firstName: "Rhea",
    lastName: "Sengupta",
    name: "Rhea Sengupta",
    email: "rhea.s@example.com",
    phone: "+91 98300 44102",
    avatar: "RS",
    preferredDestination: "United Kingdom",
    course: "MA Media & Communications",
    intake: "Sept 2026",
    qualification: "BA English Hons (69%)",
    leadSource: "Website",
    assignedCounsellor: "Rohan Varma",
    counsellorAvatar: "RV",
    status: "Converted to Student",
    priority: "High",
    createdDate: "2026-09-10T14:00:00Z",
    lastContacted: "Sept 20, 1:00 PM",
    nextFollowUp: "Completed",
    notesCount: 4,
    city: "Kolkata"
  },
  {
    id: "lead-10",
    leadCode: "LD-1039",
    firstName: "Manish",
    lastName: "Joshi",
    name: "Manish Joshi",
    email: "manish.j@example.com",
    phone: "+91 94140 88201",
    avatar: "MJ",
    preferredDestination: "Australia",
    course: "Master of Professional Accounting",
    intake: "Nov 2026",
    qualification: "B.Com (55%)",
    leadSource: "Website",
    assignedCounsellor: "Dev Patel",
    counsellorAvatar: "DP",
    status: "Not Interested",
    priority: "Low",
    createdDate: "2026-09-08T10:00:00Z",
    lastContacted: "Sept 15, 3:00 PM",
    nextFollowUp: "None",
    notesCount: 2,
    city: "Jaipur"
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "stu-1",
    studentCode: "STU-2041",
    name: "Zainab Al-Mansoor",
    avatar: "ZM",
    email: "zainab.mansoor@example.com",
    phone: "+971 52 901 8832",
    dob: "2002-04-12",
    passportNumber: "N48201948",
    city: "Abu Dhabi",
    country: "UAE",
    highestQualification: "B.Sc Biotechnology",
    institution: "Khalifa University",
    gpaOrPercentage: "3.75 GPA",
    englishTest: "IELTS Academic",
    englishScore: "7.5",
    destination: "United Kingdom",
    course: "MSc Genomic Medicine",
    intake: "Sept 2026",
    counsellor: "Rohan Varma",
    status: "Offer Received",
    visaStatus: "Documents Preparing",
    enrollmentStatus: "Pending",
    documentProgress: 85,
    totalPaid: 1500,
    balanceDue: 500,
    createdAt: "2026-08-15",
    applicationsCount: 3
  },
  {
    id: "stu-2",
    studentCode: "STU-2040",
    name: "Arjun Nair",
    avatar: "AN",
    email: "arjun.nair@example.com",
    phone: "+91 98470 33921",
    dob: "2001-08-25",
    passportNumber: "P77291034",
    city: "Kochi",
    country: "India",
    highestQualification: "B.Tech Mechanical Engineering",
    institution: "NIT Calicut",
    gpaOrPercentage: "8.1 CGPA",
    englishTest: "IELTS",
    englishScore: "7.0",
    destination: "Australia",
    course: "Master of Engineering (Robotics)",
    intake: "July 2026",
    counsellor: "Neha Sharma",
    status: "Visa Processing",
    visaStatus: "Lodged",
    enrollmentStatus: "Confirmed",
    documentProgress: 100,
    totalPaid: 2800,
    balanceDue: 0,
    createdAt: "2026-07-20",
    applicationsCount: 2
  },
  {
    id: "stu-3",
    studentCode: "STU-2039",
    name: "Sneha Mukherjee",
    avatar: "SM",
    email: "sneha.m@example.com",
    phone: "+91 98310 99420",
    dob: "2003-02-18",
    passportNumber: "R90218491",
    city: "Kolkata",
    country: "India",
    highestQualification: "B.Sc Economics",
    institution: "St. Xavier's College",
    gpaOrPercentage: "82%",
    englishTest: "TOEFL iBT",
    englishScore: "104",
    destination: "United States",
    course: "MS Quantitative Finance",
    intake: "Fall 2026",
    counsellor: "Dev Patel",
    status: "Application",
    visaStatus: "Not Applied",
    enrollmentStatus: "Pending",
    documentProgress: 60,
    totalPaid: 1200,
    balanceDue: 800,
    createdAt: "2026-08-30",
    applicationsCount: 4
  },
  {
    id: "stu-4",
    studentCode: "STU-2038",
    name: "Karan Johal",
    avatar: "KJ",
    email: "karan.johal@example.com",
    phone: "+91 98720 11928",
    dob: "2002-10-30",
    passportNumber: "S66109283",
    city: "Ludhiana",
    country: "India",
    highestQualification: "B.Tech Civil Engg",
    institution: "Thapar University",
    gpaOrPercentage: "7.6 CGPA",
    englishTest: "PTE",
    englishScore: "66",
    destination: "Canada",
    course: "Construction Project Management",
    intake: "May 2026",
    counsellor: "Neha Sharma",
    status: "Visa Approved",
    visaStatus: "Approved",
    enrollmentStatus: "Enrolled",
    documentProgress: 100,
    totalPaid: 2500,
    balanceDue: 0,
    createdAt: "2026-06-11",
    applicationsCount: 2
  },
  {
    id: "stu-5",
    studentCode: "STU-2037",
    name: "Rhea Sengupta",
    avatar: "RS",
    email: "rhea.s@example.com",
    phone: "+91 98300 44102",
    dob: "2003-07-09",
    passportNumber: "M19283746",
    city: "Kolkata",
    country: "India",
    highestQualification: "BA English Hons",
    institution: "Jadavpur University",
    gpaOrPercentage: "69%",
    englishTest: "IELTS",
    englishScore: "7.5",
    destination: "United Kingdom",
    course: "MA Media & Communications",
    intake: "Sept 2026",
    counsellor: "Rohan Varma",
    status: "Counselling",
    visaStatus: "Not Applied",
    enrollmentStatus: "Pending",
    documentProgress: 40,
    totalPaid: 500,
    balanceDue: 1500,
    createdAt: "2026-09-20",
    applicationsCount: 1
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: "app-1",
    applicationCode: "APP-8012",
    studentId: "stu-1",
    studentName: "Zainab Al-Mansoor",
    studentAvatar: "ZM",
    university: "University of Manchester",
    country: "United Kingdom",
    course: "MSc Genomic Medicine",
    intake: "Sept 2026",
    counsellor: "Rohan Varma",
    applicationDate: "2026-09-02",
    deadline: "2026-10-31",
    status: "Conditional Offer",
    offerStatus: "Conditional",
    depositStatus: "Pending",
    visaStatus: "Not Started",
    fees: "£29,500/yr"
  },
  {
    id: "app-2",
    applicationCode: "APP-8013",
    studentId: "stu-1",
    studentName: "Zainab Al-Mansoor",
    studentAvatar: "ZM",
    university: "King's College London",
    country: "United Kingdom",
    course: "MSc Precision Medicine",
    intake: "Sept 2026",
    counsellor: "Rohan Varma",
    applicationDate: "2026-09-05",
    deadline: "2026-11-15",
    status: "Under Review",
    offerStatus: "Pending",
    depositStatus: "Not Required",
    visaStatus: "Not Started",
    fees: "£31,200/yr"
  },
  {
    id: "app-3",
    applicationCode: "APP-8014",
    studentId: "stu-2",
    studentName: "Arjun Nair",
    studentAvatar: "AN",
    university: "University of Melbourne",
    country: "Australia",
    course: "Master of Engineering (Mechatronics)",
    intake: "July 2026",
    counsellor: "Neha Sharma",
    applicationDate: "2026-08-01",
    deadline: "2026-09-30",
    status: "Visa Processing",
    offerStatus: "Unconditional",
    depositStatus: "Paid",
    visaStatus: "In Process",
    fees: "AUD $49,000/yr"
  },
  {
    id: "app-4",
    applicationCode: "APP-8015",
    studentId: "stu-3",
    studentName: "Sneha Mukherjee",
    studentAvatar: "SM",
    university: "New York University (NYU)",
    country: "United States",
    course: "MS Mathematics in Finance",
    intake: "Fall 2026",
    counsellor: "Dev Patel",
    applicationDate: "2026-09-12",
    deadline: "2026-12-01",
    status: "Application Submitted",
    offerStatus: "Pending",
    depositStatus: "Not Required",
    visaStatus: "Not Started",
    fees: "$58,000/yr"
  },
  {
    id: "app-5",
    applicationCode: "APP-8016",
    studentId: "stu-4",
    studentName: "Karan Johal",
    studentAvatar: "KJ",
    university: "George Brown College",
    country: "Canada",
    course: "Postgraduate Diploma Construction Management",
    intake: "May 2026",
    counsellor: "Neha Sharma",
    applicationDate: "2026-07-10",
    deadline: "2026-08-30",
    status: "Completed",
    offerStatus: "Unconditional",
    depositStatus: "Paid",
    visaStatus: "Granted",
    fees: "CAD $19,800/yr"
  },
  {
    id: "app-6",
    applicationCode: "APP-8017",
    studentId: "stu-5",
    studentName: "Rhea Sengupta",
    studentAvatar: "RS",
    university: "University of Leeds",
    country: "United Kingdom",
    course: "MA Global Media",
    intake: "Sept 2026",
    counsellor: "Rohan Varma",
    applicationDate: "2026-09-24",
    deadline: "2026-11-30",
    status: "Documents Pending",
    offerStatus: "Pending",
    depositStatus: "Not Required",
    visaStatus: "Not Started",
    fees: "£24,500/yr"
  },
  {
    id: "app-7",
    applicationCode: "APP-8018",
    studentId: "stu-3",
    studentName: "Sneha Mukherjee",
    studentAvatar: "SM",
    university: "Columbia University",
    country: "United States",
    course: "MA Financial Economics",
    intake: "Fall 2026",
    counsellor: "Dev Patel",
    applicationDate: "2026-09-20",
    deadline: "2026-12-15",
    status: "Ready to Apply",
    offerStatus: "Pending",
    depositStatus: "Not Required",
    visaStatus: "Not Started",
    fees: "$62,000/yr"
  }
];

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

export const INITIAL_DOCUMENTS: StudentDocument[] = [
  {
    id: "doc-1",
    studentId: "stu-1",
    studentName: "Zainab Al-Mansoor",
    category: "Passport",
    fileName: "Zainab_Passport_BioPage.pdf",
    fileSize: "2.4 MB",
    uploadDate: "2026-08-16",
    expiryDate: "2031-10-14",
    status: "Approved",
    verified: true,
    notes: "Verified against original copy. Clear photo and 5+ years validity."
  },
  {
    id: "doc-2",
    studentId: "stu-1",
    studentName: "Zainab Al-Mansoor",
    category: "Academic transcripts",
    fileName: "Khalifa_Univ_BSc_Transcripts.pdf",
    fileSize: "6.1 MB",
    uploadDate: "2026-08-17",
    status: "Approved",
    verified: true,
    notes: "Consolidated grade sheet stamped by Registrar."
  },
  {
    id: "doc-3",
    studentId: "stu-1",
    studentName: "Zainab Al-Mansoor",
    category: "English test",
    fileName: "IELTS_TRF_7.5_Report.pdf",
    fileSize: "1.2 MB",
    uploadDate: "2026-08-17",
    expiryDate: "2028-06-20",
    status: "Approved",
    verified: true,
    notes: "Verified on IELTS Verification Portal."
  },
  {
    id: "doc-4",
    studentId: "stu-1",
    studentName: "Zainab Al-Mansoor",
    category: "Financial documents",
    fileName: "Bank_Solvency_Letter_ADCB.pdf",
    fileSize: "3.8 MB",
    uploadDate: "2026-09-20",
    status: "Under Review",
    verified: false,
    notes: "Reviewing 28-day holding period for UKVI compliance."
  },
  {
    id: "doc-5",
    studentId: "stu-2",
    studentName: "Arjun Nair",
    category: "Passport",
    fileName: "Arjun_Nair_Passport.pdf",
    fileSize: "1.8 MB",
    uploadDate: "2026-07-22",
    status: "Approved",
    verified: true
  },
  {
    id: "doc-6",
    studentId: "stu-2",
    studentName: "Arjun Nair",
    category: "Visa documents",
    fileName: "Australia_Visa_Lodgement_Acknowledgement.pdf",
    fileSize: "840 KB",
    uploadDate: "2026-09-15",
    status: "Approved",
    verified: true,
    notes: "Application TRN generated on ImmiAccount."
  },
  {
    id: "doc-7",
    studentId: "stu-3",
    studentName: "Sneha Mukherjee",
    category: "SOP",
    fileName: "Sneha_SOP_NYU_Columbia_v3.docx",
    fileSize: "450 KB",
    uploadDate: "2026-09-18",
    status: "Under Review",
    verified: false,
    notes: "Dev Patel currently reviewing quantitative finance narrative."
  },
  {
    id: "doc-8",
    studentId: "stu-3",
    studentName: "Sneha Mukherjee",
    category: "Financial documents",
    fileName: "Affidavit_of_Support_Father.pdf",
    fileSize: "1.9 MB",
    uploadDate: "2026-09-25",
    status: "Requested",
    verified: false,
    notes: "Awaiting notarized affidavit and IT returns."
  }
];

export const INITIAL_TASKS: CRMTask[] = [
  {
    id: "task-1",
    title: "Call Aarav Mehta to review Manchester MSc application draft",
    category: "Call follow-up",
    entityName: "Aarav Mehta",
    entityType: "Lead",
    assignedStaff: "Rohan Varma",
    dueDate: "2026-09-27T16:00:00Z",
    priority: "Urgent",
    status: "Pending",
    notes: "Student is available after 4 PM. Explain course modules and fees."
  },
  {
    id: "task-2",
    title: "Request updated bank statement for UK Visa proof of funds",
    category: "Document reminder",
    entityName: "Zainab Al-Mansoor",
    entityType: "Student",
    assignedStaff: "Rohan Varma",
    dueDate: "2026-09-28T12:00:00Z",
    priority: "High",
    status: "Pending",
    notes: "Must show £14,000 held continuously for 28 days."
  },
  {
    id: "task-3",
    title: "Follow up with Australian high commission regarding biometrics delay",
    category: "Visa reminder",
    entityName: "Arjun Nair",
    entityType: "Student",
    assignedStaff: "Neha Sharma",
    dueDate: "2026-09-26T10:00:00Z",
    priority: "Urgent",
    status: "Overdue",
    notes: "Biometrics submitted 10 days ago, status still says pending on ImmiPortal."
  },
  {
    id: "task-4",
    title: "Send WhatsApp welcoming message to Simran Kaur with Canada intake guide",
    category: "WhatsApp follow-up",
    entityName: "Simran Kaur",
    entityType: "Lead",
    assignedStaff: "Neha Sharma",
    dueDate: "2026-09-27T17:30:00Z",
    priority: "Medium",
    status: "Pending",
    notes: "Share PDF brochure of Ontario colleges."
  },
  {
    id: "task-5",
    title: "Submit NYU Courant Recommendation Letter portal links",
    category: "Application reminder",
    entityName: "Sneha Mukherjee",
    entityType: "Student",
    assignedStaff: "Dev Patel",
    dueDate: "2026-09-29T18:00:00Z",
    priority: "High",
    status: "In Progress",
    notes: "Two professors have submitted, awaiting Prof. Banerjee."
  },
  {
    id: "task-6",
    title: "Confirm in-person parent consultation with Aditya Rao",
    category: "Appointment",
    entityName: "Aditya Rao",
    entityType: "Lead",
    assignedStaff: "Rohan Varma",
    dueDate: "2026-09-27T17:00:00Z",
    priority: "High",
    status: "Pending",
    notes: "Room B reserved for 5:30 PM meeting."
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    studentName: "Aditya Rao & Parents",
    counsellor: "Rohan Varma",
    date: "2026-09-27",
    time: "17:30",
    type: "Parent meeting",
    status: "Scheduled",
    mode: "Office In-Person",
    notes: "Discuss Melbourne vs Sydney ROI and post-study work visa rules."
  },
  {
    id: "apt-2",
    studentName: "Zainab Al-Mansoor",
    counsellor: "Rohan Varma",
    date: "2026-09-28",
    time: "11:00",
    type: "Visa counselling",
    status: "Scheduled",
    mode: "Zoom Video",
    notes: "Go over UK CAS timeline and TB test slot booking."
  },
  {
    id: "apt-3",
    studentName: "Simran Kaur",
    counsellor: "Neha Sharma",
    date: "2026-09-28",
    time: "14:00",
    type: "Initial counselling",
    status: "Scheduled",
    mode: "Phone Call",
    notes: "Discuss Seneca vs Humber diploma course intakes."
  },
  {
    id: "apt-4",
    studentName: "Fatima Noor",
    counsellor: "Dev Patel",
    date: "2026-09-29",
    time: "16:00",
    type: "Document review",
    status: "Scheduled",
    mode: "Zoom Video",
    notes: "Review US SOP draft and faculty research alignment."
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: "pay-1",
    invoiceRef: "INV-2026-081",
    studentId: "stu-1",
    studentName: "Zainab Al-Mansoor",
    service: "Full UK Admissions & Visa Premium Package",
    amount: 2000,
    amountPaid: 1500,
    remaining: 500,
    paymentDate: "2026-08-16",
    method: "Bank Transfer",
    status: "Partial"
  },
  {
    id: "pay-2",
    invoiceRef: "INV-2026-082",
    studentId: "stu-2",
    studentName: "Arjun Nair",
    service: "Australia Comprehensive University + Subclass 500 Visa Filing",
    amount: 2800,
    amountPaid: 2800,
    remaining: 0,
    paymentDate: "2026-07-21",
    method: "UPI / Net Banking",
    status: "Paid"
  },
  {
    id: "pay-3",
    invoiceRef: "INV-2026-083",
    studentId: "stu-3",
    studentName: "Sneha Mukherjee",
    service: "US Graduate Ivy & Tier-1 Admissions Advisory",
    amount: 2000,
    amountPaid: 1200,
    remaining: 800,
    paymentDate: "2026-08-31",
    method: "Credit Card",
    status: "Partial"
  },
  {
    id: "pay-4",
    invoiceRef: "INV-2026-084",
    studentId: "stu-4",
    studentName: "Karan Johal",
    service: "Canada SDS College Application & Pre-Departure",
    amount: 2500,
    amountPaid: 2500,
    remaining: 0,
    paymentDate: "2026-06-12",
    method: "Bank Transfer",
    status: "Paid"
  },
  {
    id: "pay-5",
    invoiceRef: "INV-2026-085",
    studentId: "stu-5",
    studentName: "Rhea Sengupta",
    service: "UK Masters Retainer & University Shortlist",
    amount: 2000,
    amountPaid: 500,
    remaining: 1500,
    paymentDate: "2026-09-21",
    method: "UPI / Net Banking",
    status: "Pending"
  }
];

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

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "act-1",
    actor: "System",
    actorRole: "Automation",
    action: "received website inquiry and created lead",
    entity: "Aarav Mehta",
    entityCode: "LD-1048",
    timestamp: "10 mins ago",
    type: "lead"
  },
  {
    id: "act-2",
    actor: "Rohan Varma",
    actorRole: "Counsellor",
    action: "assigned lead to himself and scheduled discovery call",
    entity: "Aarav Mehta",
    entityCode: "LD-1048",
    timestamp: "25 mins ago",
    type: "lead"
  },
  {
    id: "act-3",
    actor: "Neha Sharma",
    actorRole: "Counsellor",
    action: "updated application status to Conditional Offer",
    entity: "Zainab Al-Mansoor (Univ of Manchester)",
    entityCode: "APP-8012",
    timestamp: "2 hours ago",
    type: "application"
  },
  {
    id: "act-4",
    actor: "Dev Patel",
    actorRole: "Visa Specialist",
    action: "verified and approved Passport and IELTS documents",
    entity: "Sneha Mukherjee",
    entityCode: "STU-2039",
    timestamp: "4 hours ago",
    type: "document"
  },
  {
    id: "act-5",
    actor: "Owner",
    actorRole: "Owner",
    action: "recorded payment of ₹1,20,000 (INV-2026-083)",
    entity: "Sneha Mukherjee",
    entityCode: "INV-2026-083",
    timestamp: "Yesterday",
    type: "payment"
  },
  {
    id: "act-6",
    actor: "Neha Sharma",
    actorRole: "Counsellor",
    action: "changed lead status from Contacted to Counselling Scheduled",
    entity: "Aditya Rao",
    entityCode: "LD-1046",
    timestamp: "Yesterday",
    type: "lead"
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "New Website Inquiry",
    message: "Aarav Mehta submitted an inquiry for MSc Data Science (UK).",
    type: "inquiry",
    time: "10m ago",
    read: false,
    link: "/leads/lead-1"
  },
  {
    id: "notif-2",
    title: "Offer Received!",
    message: "University of Manchester released a conditional offer for Zainab Al-Mansoor.",
    type: "deadline",
    time: "2h ago",
    read: false,
    link: "/applications"
  },
  {
    id: "notif-3",
    title: "Follow-up Overdue",
    message: "Australian high commission follow-up for Arjun Nair is overdue by 1 day.",
    type: "followup",
    time: "4h ago",
    read: false,
    link: "/tasks"
  },
  {
    id: "notif-4",
    title: "New Document Uploaded",
    message: "Sneha Mukherjee uploaded 'Sneha_SOP_NYU_Columbia_v3.docx'.",
    type: "document",
    time: "1d ago",
    read: true,
    link: "/documents"
  }
];

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
