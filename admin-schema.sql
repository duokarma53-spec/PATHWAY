-- ============================================================
-- PATHWAY ADMIN & CRM — Supabase Database Schema Extension
-- Run this in the Supabase SQL editor on your project AFTER running the public schema.sql
-- ============================================================

-- ── PROFILES (Admin Roles) ──────────────────────────────────
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'Counsellor' CHECK (role IN ('Super Admin', 'Admin', 'Counsellor', 'Content Manager', 'Reception / Sales')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ── STUDENTS ────────────────────────────────────────────────
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL, -- Link to original lead if applicable
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  dob DATE,
  passport_number TEXT,
  city TEXT,
  country TEXT,
  current_institution TEXT,
  grade_level TEXT,
  academic_score TEXT, -- e.g., GPA, Percentage
  english_test_score TEXT, -- e.g., IELTS 7.5
  career_goals TEXT,
  assigned_counsellor UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'enrolled', 'alumni', 'inactive')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── PARENTS ─────────────────────────────────────────────────
CREATE TABLE parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relation TEXT,
  email TEXT,
  phone TEXT,
  occupation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── APPLICATIONS ────────────────────────────────────────────
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  university_id UUID REFERENCES universities(id) ON DELETE RESTRICT,
  course_name TEXT NOT NULL,
  intake_term TEXT, -- e.g., Fall 2026
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'university_shortlisting', 'documents_pending', 'application_preparing', 'application_submitted', 'conditional_offer', 'unconditional_offer', 'visa_processing', 'visa_approved', 'pre_departure', 'completed', 'rejected', 'withdrawn')),
  assigned_counsellor UUID REFERENCES profiles(id) ON DELETE SET NULL,
  application_date DATE,
  deadline DATE,
  offer_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── APPLICATION STATUS HISTORY ──────────────────────────────
CREATE TABLE application_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── DOCUMENTS ───────────────────────────────────────────────
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- Passport, Transcripts, SOP, etc.
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'verified', 'rejected')),
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── TASKS ───────────────────────────────────────────────────
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  due_date TIMESTAMPTZ,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── INTERNAL NOTES ──────────────────────────────────────────
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── AUDIT LOGS / ACTIVITIES ─────────────────────────────────
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL, -- e.g., 'created_lead', 'updated_application'
  entity_type TEXT NOT NULL, -- e.g., 'lead', 'application', 'student'
  entity_id UUID NOT NULL,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── NOTIFICATIONS ───────────────────────────────────────────
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info', -- 'info', 'warning', 'success', 'task'
  is_read BOOLEAN DEFAULT false,
  link TEXT, -- Optional link to the related record
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) FOR ADMIN APP
-- ============================================================

-- Enable RLS on new tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, but only update their own (unless Super Admin)
CREATE POLICY "Profiles are readable by authenticated users" ON profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Rest of the tables: For now, we will allow any authenticated admin user to read/write.
-- In a stricter environment, you would restrict 'Counsellor' to only see records where assigned_counsellor = auth.uid()
CREATE POLICY "Authenticated users can read students" ON students FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert students" ON students FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update students" ON students FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read parents" ON parents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert parents" ON parents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update parents" ON parents FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read applications" ON applications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert applications" ON applications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update applications" ON applications FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read documents" ON documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert documents" ON documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update documents" ON documents FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read tasks" ON tasks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert tasks" ON tasks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update tasks" ON tasks FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read notes" ON notes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert notes" ON notes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update notes" ON notes FOR UPDATE USING (auth.role() = 'authenticated');

-- Audit logs: Read-only for most, insertable by application logic
CREATE POLICY "Authenticated users can read audit logs" ON audit_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Notifications: Users can only see their own
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ── UPDATING PUBLIC TABLES FOR ADMIN ACCESS ─────────────────
-- Allow authenticated users to INSERT/UPDATE/DELETE public tables (which they couldn't before)
CREATE POLICY "Authenticated users can insert destinations" ON destinations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update destinations" ON destinations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete destinations" ON destinations FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert universities" ON universities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update universities" ON universities FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete universities" ON universities FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read all leads" ON leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert leads" ON leads FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update leads" ON leads FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read all consultations" ON consultations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert consultations" ON consultations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update consultations" ON consultations FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage success_stories" ON success_stories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage team_members" ON team_members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage blog_categories" ON blog_categories FOR ALL USING (auth.role() = 'authenticated');
