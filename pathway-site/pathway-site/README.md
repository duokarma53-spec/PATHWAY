# Pathway — Website

Premium international education consultancy website built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, and Supabase.

## Getting Started

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   # Fill in your Supabase URL and anon key
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + custom design system
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Backend**: Supabase (PostgreSQL + Storage + Auth)
- **Icons**: Lucide React
- **Fonts**: Cormorant Garamond (serif) + Inter (sans)

## Project Structure

```
app/                    → Next.js App Router pages
components/
  animations/           → FadeIn, StaggerChildren
  forms/                → LeadForm, ConsultationForm
  navigation/           → Navbar, MobileMenu
  sections/             → All homepage sections
  ui/                   → FloatingCta, buttons, etc.
lib/
  constants.ts          → Nav items, site config
  seed-data.ts          → Demo content (replace with Supabase)
  supabase/client.ts    → Browser Supabase client
  utils.ts              → cn() and helpers
types/index.ts          → Shared TypeScript types
supabase/schema.sql     → Complete database schema
```

## Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL editor
3. Add your project URL and anon key to `.env.local`
4. Create storage buckets: `media`, `avatars`, `covers`

## Design System

| Token | Value |
|-------|-------|
| `charcoal` | `#0C0C0A` |
| `ivory` | `#F5F0E8` |
| `gold` | `#C9A96E` |
| Serif font | Cormorant Garamond |
| Sans font | Inter |

## Admin Dashboard

The admin dashboard (built separately) should use the same Supabase project.
See `supabase/schema.sql` for the complete data contract including tables, columns, RLS policies, and relationships.

## Demo Content

All success stories, team members, and blog posts are marked as DEMO content in `lib/seed-data.ts`. Replace with real content via the admin dashboard once Supabase is connected.
