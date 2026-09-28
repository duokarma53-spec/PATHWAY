-- ==============================================================================
-- PATHWAY CONSULTANCY & CRM — MASTER SUPABASE SQL SCHEMA & SEED DATA
-- Project: https://dhfuflpfgmgfipchitpq.supabase.co
--
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/dhfuflpfgmgfipchitpq
-- 2. In the left navigation, click "SQL Editor".
-- 3. Click "New query", paste the ENTIRE contents of this file, and click "RUN".
-- ==============================================================================

-- ── 1. EXTENSIONS ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 2. PROFILES (Staff & Admin Roles) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'Counsellor' CHECK (role IN ('Super Admin', 'Admin', 'Counsellor', 'Content Manager', 'Reception / Sales')),
  avatar_url TEXT,
  phone TEXT,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. DESTINATIONS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  code TEXT,
  flag TEXT,
  currency TEXT,
  average_tuition TEXT,
  living_cost TEXT,
  visa_processing_time TEXT,
  work_rights TEXT,
  popular_intakes TEXT[],
  requirements TEXT[],
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. UNIVERSITIES ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  global_ranking INTEGER,
  tuition_range TEXT,
  acceptance_rate TEXT,
  ielts_minimum DECIMAL(2,1),
  popular_courses TEXT[],
  scholarships_available TEXT,
  partner_status TEXT DEFAULT 'Direct Partner',
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. LEADS (Inquiries & Prospect Pipeline) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  parent_name TEXT,
  grade TEXT,
  destination TEXT,
  course TEXT,
  intake TEXT,
  qualification TEXT,
  city TEXT,
  country TEXT DEFAULT 'India',
  message TEXT,
  status TEXT DEFAULT 'new',
  priority TEXT DEFAULT 'medium',
  lead_source TEXT DEFAULT 'Website Inquiry',
  assigned_counsellor UUID REFERENCES profiles(id) ON DELETE SET NULL,
  last_contacted_at TIMESTAMPTZ,
  next_followup_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relax any older restrictive constraints on leads to ensure all website form submissions succeed
ALTER TABLE leads ALTER COLUMN email DROP NOT NULL;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_lead_source_check;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;

-- ── 6. STUDENTS (Enrolled Clients) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  dob DATE,
  passport_number TEXT,
  passport_expiry DATE,
  city TEXT,
  country TEXT,
  current_institution TEXT,
  grade_level TEXT,
  academic_score TEXT,
  english_test_score TEXT,
  career_goals TEXT,
  target_country TEXT,
  target_intake TEXT,
  document_progress INTEGER DEFAULT 0,
  assigned_counsellor UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'enrolled', 'visa_approved', 'pre_departure', 'alumni', 'inactive')),
  total_billed DECIMAL(10,2) DEFAULT 0,
  total_paid DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 7. PARENTS / GUARDIANS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relation TEXT,
  email TEXT,
  phone TEXT,
  occupation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 8. APPLICATIONS (Admissions & Visa Pipeline) ──────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_ref TEXT UNIQUE NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  university_id UUID REFERENCES universities(id) ON DELETE RESTRICT,
  course_name TEXT NOT NULL,
  intake_term TEXT,
  tuition_fee TEXT,
  status TEXT DEFAULT 'university_shortlisted' CHECK (status IN (
    'university_shortlisted',
    'documents_pending',
    'ready_to_apply',
    'application_submitted',
    'under_university_review',
    'conditional_offer_received',
    'unconditional_offer_received',
    'fee_deposit_paid',
    'cas_i20_issued',
    'visa_applied',
    'visa_approved_enrolled',
    'rejected',
    'withdrawn'
  )),
  offer_status TEXT DEFAULT 'pending' CHECK (offer_status IN ('pending', 'conditional', 'unconditional', 'declined')),
  deposit_status TEXT DEFAULT 'not_required' CHECK (deposit_status IN ('not_required', 'pending', 'paid')),
  visa_status TEXT DEFAULT 'not_started' CHECK (visa_status IN ('not_started', 'in_process', 'granted', 'refused')),
  assigned_counsellor UUID REFERENCES profiles(id) ON DELETE SET NULL,
  submission_date DATE,
  deadline DATE,
  offer_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 9. APPLICATION STATUS HISTORY ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS application_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 10. DOCUMENTS & KYC VAULT ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('passport', 'academic_transcripts', 'english_test', 'financial_documents', 'sop_lor', 'visa_forms', 'other')),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size_kb INTEGER,
  expiry_date DATE,
  is_verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'under_review' CHECK (status IN ('approved', 'under_review', 'rejected', 'expired')),
  rejection_reason TEXT,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 11. CRM TASKS & REMINDERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  due_date TIMESTAMPTZ NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT DEFAULT 'follow_up' CHECK (category IN ('follow_up', 'document_collection', 'application_submission', 'interview_prep', 'visa_filing', 'fee_reminder')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 12. APPOINTMENTS & CONSULTATIONS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  counsellor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  appointment_type TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 45,
  mode TEXT DEFAULT 'Office In-Person' CHECK (mode IN ('Office In-Person', 'Zoom Video', 'Phone Call')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 13. PAYMENTS & INVOICES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_ref TEXT UNIQUE NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  service_description TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT,
  payment_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid', 'overdue')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 14. COMMUNICATIONS LOG ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'whatsapp', 'email', 'note')),
  direction TEXT DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
  subject TEXT,
  content TEXT NOT NULL,
  duration_minutes INTEGER,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 15. INTERNAL NOTES ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  is_pinned BOOLEAN DEFAULT false,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 16. AUDIT LOGS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 17. NOTIFICATIONS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 18. WEBSITE INQUIRIES & CONTACT ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 19. WEBSITE CONTENT (FAQs, Services, Stories) ────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS success_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  university TEXT NOT NULL,
  country TEXT NOT NULL,
  course TEXT NOT NULL,
  quote TEXT,
  image_url TEXT,
  visa_year INTEGER DEFAULT 2026,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'Admissions',
  display_order INTEGER DEFAULT 1,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- ── Public content policies (idempotent) ───────────────────────────────────────
DROP POLICY IF EXISTS "Public can read destinations" ON destinations;
CREATE POLICY "Public can read destinations" ON destinations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read universities" ON universities;
CREATE POLICY "Public can read universities" ON universities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read services" ON services;
CREATE POLICY "Public can read services" ON services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read success_stories" ON success_stories;
CREATE POLICY "Public can read success_stories" ON success_stories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read faqs" ON faqs;
CREATE POLICY "Public can read faqs" ON faqs FOR SELECT USING (true);

-- ── Website Lead & Inquiry Form Submission policies ───────────────────────────
DROP POLICY IF EXISTS "Public can insert leads" ON leads;
CREATE POLICY "Public can insert leads" ON leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read leads" ON leads;
CREATE POLICY "Public can read leads" ON leads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert consultations" ON consultations;
CREATE POLICY "Public can insert consultations" ON consultations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert contact submissions" ON contact_submissions;
CREATE POLICY "Public can insert contact submissions" ON contact_submissions FOR INSERT WITH CHECK (true);

-- ── Enable Supabase Realtime for instant live updates ─────────────────────────
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE leads;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ── Authenticated Admin staff access policies ─────────────────────────────────
DROP POLICY IF EXISTS "Authenticated full access profiles" ON profiles;
CREATE POLICY "Authenticated full access profiles" ON profiles FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access destinations" ON destinations;
CREATE POLICY "Authenticated full access destinations" ON destinations FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access universities" ON universities;
CREATE POLICY "Authenticated full access universities" ON universities FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access leads" ON leads;
CREATE POLICY "Authenticated full access leads" ON leads FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access students" ON students;
CREATE POLICY "Authenticated full access students" ON students FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access parents" ON parents;
CREATE POLICY "Authenticated full access parents" ON parents FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access applications" ON applications;
CREATE POLICY "Authenticated full access applications" ON applications FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access app_history" ON application_status_history;
CREATE POLICY "Authenticated full access app_history" ON application_status_history FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access documents" ON documents;
CREATE POLICY "Authenticated full access documents" ON documents FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access tasks" ON tasks;
CREATE POLICY "Authenticated full access tasks" ON tasks FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access appointments" ON appointments;
CREATE POLICY "Authenticated full access appointments" ON appointments FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access payments" ON payments;
CREATE POLICY "Authenticated full access payments" ON payments FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access communications" ON communications;
CREATE POLICY "Authenticated full access communications" ON communications FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access notes" ON notes;
CREATE POLICY "Authenticated full access notes" ON notes FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access audit_logs" ON audit_logs;
CREATE POLICY "Authenticated full access audit_logs" ON audit_logs FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access notifications" ON notifications;
CREATE POLICY "Authenticated full access notifications" ON notifications FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access consultations" ON consultations;
CREATE POLICY "Authenticated full access consultations" ON consultations FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access contact_submissions" ON contact_submissions;
CREATE POLICY "Authenticated full access contact_submissions" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access services" ON services;
CREATE POLICY "Authenticated full access services" ON services FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access success_stories" ON success_stories;
CREATE POLICY "Authenticated full access success_stories" ON success_stories FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated full access faqs" ON faqs;
CREATE POLICY "Authenticated full access faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');

-- ── Demo / Client Read policies ───────────────────────────────────────────────
DROP POLICY IF EXISTS "Anon read for demo students" ON students;
CREATE POLICY "Anon read for demo students" ON students FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anon read for demo applications" ON applications;
CREATE POLICY "Anon read for demo applications" ON applications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anon read for demo documents" ON documents;
CREATE POLICY "Anon read for demo documents" ON documents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anon read for demo tasks" ON tasks;
CREATE POLICY "Anon read for demo tasks" ON tasks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anon read for demo appointments" ON appointments;
CREATE POLICY "Anon read for demo appointments" ON appointments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anon read for demo payments" ON payments;
CREATE POLICY "Anon read for demo payments" ON payments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anon read for demo profiles" ON profiles;
CREATE POLICY "Anon read for demo profiles" ON profiles FOR SELECT USING (true);

-- ==============================================================================
-- 20. INITIAL SEED DATA (Fully Idempotent & Re-runnable)
-- ==============================================================================

-- Staff Profiles
DELETE FROM profiles WHERE email = 'owner@pathway.com' AND id != 'a1111111-1111-1111-1111-111111111111';
DELETE FROM profiles WHERE email = 'admin@pathway.com' AND id != 'a1111111-1111-1111-1111-111111111111';

INSERT INTO profiles (id, email, full_name, role, phone, department) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'owner@pathway.com', 'Owner', 'Super Admin', '+91 98200 11223', 'Executive Management'),
  ('a2222222-2222-2222-2222-222222222222', 'rohan@pathway.com', 'Rohan Varma', 'Counsellor', '+91 98200 44556', 'UK & Europe Admissions'),
  ('a3333333-3333-3333-3333-333333333333', 'priya@pathway.com', 'Priya Iyer', 'Counsellor', '+91 98200 77889', 'Canada & USA Admissions'),
  ('a4444444-4444-4444-4444-444444444444', 'dev@pathway.com', 'Dev Patel', 'Counsellor', '+91 98200 99001', 'Australia & NZ Admissions')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  department = EXCLUDED.department;

-- Destinations
INSERT INTO destinations (name, slug, code, flag, currency, average_tuition, living_cost, visa_processing_time, work_rights, popular_intakes, requirements) VALUES
  ('United Kingdom', 'united-kingdom', 'UK', '🇬🇧', 'GBP (£)', '£14,000 - £28,000 / year', '£9,000 - £12,000 / year', '3 - 4 weeks', '20 hrs/week term time, Graduate Route 2 yrs', ARRAY['Sept / Oct', 'Jan / Feb'], ARRAY['IELTS 6.0 - 7.0', 'Academic 60%+', 'TB Test']),
  ('Canada', 'canada', 'CA', '🇨🇦', 'CAD ($)', '$18,000 - $35,000 / year', '$15,000 - $20,000 / year', '6 - 10 weeks', '20 hrs/week off-campus, PGWP up to 3 yrs', ARRAY['September', 'January', 'May'], ARRAY['IELTS 6.5+', 'GIC Account CAD $20,635', 'Biometrics']),
  ('United States', 'united-states', 'USA', '🇺🇸', 'USD ($)', '$25,000 - $55,000 / year', '$18,000 - $24,000 / year', '4 - 8 weeks', 'On-campus 20 hrs/week, OPT up to 3 yrs (STEM)', ARRAY['Fall (August)', 'Spring (January)'], ARRAY['TOEFL/IELTS/Duolingo', 'GRE/GMAT (optional)', 'I-20 financial proof']),
  ('Australia', 'australia', 'AUS', '🇦🇺', 'AUD ($)', '$22,000 - $45,000 / year', '$20,000 - $25,000 / year', '4 - 6 weeks', '48 hrs per fortnight, Post-Study Work 2-4 yrs', ARRAY['Semester 1 (Feb)', 'Semester 2 (July)'], ARRAY['IELTS/PTE 6.5', 'Genuine Student (GS) assessment', 'OSHC insurance'])
ON CONFLICT (slug) DO NOTHING;

-- Universities
INSERT INTO universities (id, name, country, city, global_ranking, tuition_range, acceptance_rate, ielts_minimum, popular_courses, scholarships_available, website) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'University of Manchester', 'United Kingdom', 'Manchester', 32, '£24,000 - £34,000', '56%', 6.5, ARRAY['MSc Data Science', 'MBA', 'BSc Computer Science'], 'Global Futures Scholarship (£5,000)', 'https://manchester.ac.uk'),
  ('c2222222-2222-2222-2222-222222222222', 'University of Leeds', 'United Kingdom', 'Leeds', 75, '£22,000 - £30,000', '64%', 6.5, ARRAY['MA Global Media', 'MSc Artificial Intelligence'], 'International Excellence Award (Up to 50%)', 'https://leeds.ac.uk'),
  ('c3333333-3333-3333-3333-333333333333', 'University of Toronto', 'Canada', 'Toronto', 21, 'CAD $45,000 - $62,000', '43%', 7.0, ARRAY['Master of Management Analytics', 'Computer Engineering'], 'Lester B. Pearson International Scholarship', 'https://utoronto.ca'),
  ('c4444444-4444-4444-4444-444444444444', 'Columbia University', 'United States', 'New York City', 11, 'USD $58,000 - $68,000', '4%', 7.5, ARRAY['MS Quantitative Finance', 'MA Economics'], 'Merit Fellowship Grants', 'https://columbia.edu'),
  ('c5555555-5555-5555-5555-555555555555', 'University of Melbourne', 'Australia', 'Melbourne', 14, 'AUD $38,000 - $52,000', '70%', 6.5, ARRAY['Master of Engineering (Robotics)', 'Master of IT'], 'Melbourne International Undergraduate Scholarship', 'https://unimelb.edu.au')
ON CONFLICT (id) DO NOTHING;

-- Initial Leads
INSERT INTO leads (id, full_name, email, phone, destination, course, intake, qualification, city, status, priority, lead_source, assigned_counsellor) VALUES
  ('d1111111-1111-1111-1111-111111111111', 'Aarav Mehta', 'aarav.mehta@example.com', '+91 98201 44521', 'United Kingdom', 'MSc Data Science & AI', 'Sept 2026', 'B.Tech Computer Science (8.4 CGPA)', 'Mumbai', 'new', 'urgent', 'Website Inquiry', 'a2222222-2222-2222-2222-222222222222'),
  ('d2222222-2222-2222-2222-222222222222', 'Rhea Sengupta', 'rhea.s@example.com', '+91 98334 11209', 'United Kingdom', 'MA Media & Communications', 'Sept 2026', 'BA Journalism (78%)', 'Kolkata', 'counselling_scheduled', 'high', 'Education Fair', 'a2222222-2222-2222-2222-222222222222'),
  ('d3333333-3333-3333-3333-333333333333', 'Kabir Deshmukh', 'kabir.d@example.com', '+91 98110 55432', 'Canada', 'Postgrad Diploma Cybersecurity', 'Jan 2027', 'BSc IT (3.4 GPA)', 'Pune', 'contacted', 'medium', 'Direct Referral', 'a3333333-3333-3333-3333-333333333333'),
  ('d4444444-4444-4444-4444-444444444444', 'Sneha Mukherjee', 'sneha.m@example.com', '+91 97665 99812', 'United States', 'MS Quantitative Finance', 'Fall 2026', 'B.Com Honours (85%)', 'Delhi', 'counselling_done', 'high', 'Google Search / SEO', 'a3333333-3333-3333-3333-333333333333'),
  ('d5555555-5555-5555-5555-555555555555', 'Arjun Nair', 'arjun.nair@example.com', '+91 98450 33211', 'Australia', 'Master of Robotics & Mechatronics', 'Feb 2027', 'B.Tech Mechanical (7.9 CGPA)', 'Bengaluru', 'shortlisting_in_progress', 'urgent', 'Instagram / Social', 'a4444444-4444-4444-4444-444444444444')
ON CONFLICT (id) DO NOTHING;

-- Initial Active Students
INSERT INTO students (id, first_name, last_name, email, phone, city, country, current_institution, academic_score, english_test_score, target_country, target_intake, document_progress, status, total_billed, total_paid, assigned_counsellor) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Zainab', 'Al-Mansoor', 'zainab.m@example.com', '+971 50 123 4567', 'Abu Dhabi', 'United Arab Emirates', 'Khalifa University', '3.75 GPA', 'IELTS Academic: 7.5', 'United Kingdom', 'Sept 2026', 85, 'active', 2000.00, 1500.00, 'a2222222-2222-2222-2222-222222222222'),
  ('b2222222-2222-2222-2222-222222222222', 'Rohan', 'Mehta', 'rohan.m@example.com', '+91 98200 55443', 'Mumbai', 'India', 'VJTI Mumbai', '8.9 CGPA', 'IELTS Academic: 8.0', 'United Kingdom', 'Sept 2026', 100, 'visa_approved', 2500.00, 2500.00, 'a2222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  document_progress = EXCLUDED.document_progress;

-- Initial CRM Tasks
INSERT INTO tasks (id, title, description, due_date, priority, category, status, assigned_to) VALUES
  ('e1111111-1111-1111-1111-111111111111', 'Call Aarav Mehta to review Manchester MSc application draft', 'Student is available after 4 PM. Explain course modules and fee structure.', NOW() + INTERVAL '2 hours', 'urgent', 'follow_up', 'pending', 'a2222222-2222-2222-2222-222222222222'),
  ('e2222222-2222-2222-2222-222222222222', 'Request updated bank statement from Zainab Al-Mansoor', 'CAS issuance requirement for University of Manchester.', NOW() + INTERVAL '1 day', 'high', 'document_collection', 'pending', 'a2222222-2222-2222-2222-222222222222'),
  ('e3333333-3333-3333-3333-333333333333', 'Submit Columbia University financial affidavit for Sneha', 'Fall 2026 priority deadline approaching on October 15th.', NOW() + INTERVAL '3 days', 'medium', 'application_submission', 'pending', 'a3333333-3333-3333-3333-333333333333')
ON CONFLICT (id) DO NOTHING;

-- Initial Appointments
INSERT INTO appointments (id, appointment_type, scheduled_at, duration_minutes, mode, status, counsellor_id) VALUES
  ('f1111111-1111-1111-1111-111111111111', '1-on-1 Master Profile Evaluation', NOW() + INTERVAL '1 day', 45, 'Zoom Video', 'scheduled', 'a2222222-2222-2222-2222-222222222222'),
  ('f2222222-2222-2222-2222-222222222222', 'Visa Mock Interview Prep Session', NOW() + INTERVAL '2 days', 60, 'Office In-Person', 'scheduled', 'a2222222-2222-2222-2222-222222222222'),
  ('f3333333-3333-3333-3333-333333333333', 'Shortlisting Consultation (Canada vs USA)', NOW() + INTERVAL '3 days', 45, 'Zoom Video', 'scheduled', 'a3333333-3333-3333-3333-333333333333')
ON CONFLICT (id) DO NOTHING;
