-- ============================================================
-- PATHWAY — Supabase Database Schema
-- Run this in the Supabase SQL editor on your project
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── DESTINATIONS ─────────────────────────────────────────────
CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  flag TEXT,
  overview TEXT,
  popular_courses JSONB DEFAULT '[]',
  visa_info TEXT,
  image_url TEXT,
  averag_tuition_min INTEGER DEFAULT 0,
  averag_tuition_max INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'GBP',
  application_period TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── UNIVERSITIES ──────────────────────────────────────────────
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  logo_url TEXT,
  rank INTEGER,
  programs JSONB DEFAULT '[]',
  website_url TEXT,
  destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── SERVICES ─────────────────────────────────────────────────
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  order_num INTEGER NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  detail_content TEXT,
  icon TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── SUCCESS STORIES ───────────────────────────────────────────
CREATE TABLE success_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  student_name TEXT NOT NULL,
  background TEXT,
  challenge TEXT,
  strategy TEXT,
  outcome TEXT,
  university TEXT,
  course TEXT,
  country TEXT,
  image_url TEXT,
  is_demo BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── TEAM MEMBERS ──────────────────────────────────────────────
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  education TEXT,
  expertise JSONB DEFAULT '[]',
  photo_url TEXT,
  linkedin_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── FAQ ───────────────────────────────────────────────────────
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── BLOG CATEGORIES ───────────────────────────────────────────
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── BLOG POSTS ────────────────────────────────────────────────
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  author TEXT,
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── LEADS ─────────────────────────────────────────────────────
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  parent_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  grade TEXT,
  destination TEXT,
  course TEXT,
  city TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'enrolled', 'closed')),
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── CONSULTATIONS ─────────────────────────────────────────────
CREATE TABLE consultations (
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

-- ── CONTACT SUBMISSIONS ───────────────────────────────────────
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── SITE SETTINGS ─────────────────────────────────────────────
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ — content tables (anon can read published content)
CREATE POLICY "Public can read published destinations" ON destinations FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read universities" ON universities FOR SELECT USING (true);
CREATE POLICY "Public can read published services" ON services FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published stories" ON success_stories FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published team" ON team_members FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published faqs" ON faqs FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read blog categories" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Public can read published posts" ON blog_posts FOR SELECT USING (is_published = true AND published_at <= NOW());
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (true);

-- PUBLIC INSERT — lead capture tables (anon can submit forms)
CREATE POLICY "Anyone can submit a lead" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can book a consultation" ON consultations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can send a contact message" ON contact_submissions FOR INSERT WITH CHECK (true);

-- ADMIN FULL ACCESS — authenticated users get full access
-- (Assumes admin users are authenticated via Supabase Auth)
CREATE POLICY "Authenticated users can do everything on destinations" ON destinations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can do everything on universities" ON universities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can do everything on services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can do everything on stories" ON success_stories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can do everything on team" ON team_members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can do everything on faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can do everything on blog_categories" ON blog_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can do everything on blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read leads" ON leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update leads" ON leads FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read consultations" ON consultations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update consultations" ON consultations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read contact submissions" ON contact_submissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update site settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS
-- (Create these in Supabase Dashboard → Storage)
-- ============================================================
-- Bucket: 'media'     — general media (destination images, etc.)
-- Bucket: 'avatars'   — team member photos
-- Bucket: 'covers'    — blog post cover images

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_success_stories_updated_at BEFORE UPDATE ON success_stories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
