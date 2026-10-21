"use client";

import * as React from "react";
import {
  Users,
  GraduationCap,
  FileText,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  Plus,
  Compass,
  CreditCard,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Globe2,
  Inbox
} from "lucide-react";
import {
  LeadTrendChart,
  EnrolmentsBarChart
} from "@/components/dashboard/crm-dashboard-charts";
import { CRMQuickActions } from "@/components/actions/crm-quick-actions";
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useAdminProfile } from "@/lib/profile/use-admin-profile";

interface RealLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  course: string;
  status: string;
  leadSource: string;
  intake: string;
  createdAt: string;
}

export function DashboardClientView() {
  const currentDate = new Date();
  const { profile } = useAdminProfile();
  const [leads, setLeads] = React.useState<RealLead[]>([]);
  const [studentsCount, setStudentsCount] = React.useState(0);
  const [appsCount, setAppsCount] = React.useState(0);
  const [destinationsList, setDestinationsList] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [period, setPeriod] = React.useState<"Day" | "Week" | "Month" | "Year">("Month");
  const [barTab, setBarTab] = React.useState<"Monthly" | "Term">("Monthly");

  React.useEffect(() => {
    const supabase = createClient();

    async function fetchDashboardData() {
      try {
        // 1. Fetch real leads
        const { data: rawLeads } = await supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (rawLeads) {
          const mapped: RealLead[] = rawLeads.map((r) => ({
            id: r.id,
            name: r.full_name || "Prospective Student",
            email: r.email || "—",
            phone: r.phone || "—",
            destination: r.destination || "United Kingdom",
            course: r.course || r.qualification || "Higher Education",
            status: r.status || "New",
            leadSource: r.lead_source || "Website Inquiry",
            intake: r.intake || "Sep 2026 Intake",
            createdAt: r.created_at,
          }));
          setLeads(mapped);
        }

        // 2. Fetch real students count
        const { count: sCount } = await supabase
          .from("students")
          .select("*", { count: "exact", head: true });
        setStudentsCount(sCount || 0);

        // 3. Fetch real applications count
        const { count: aCount } = await supabase
          .from("applications")
          .select("*", { count: "exact", head: true });
        setAppsCount(aCount || 0);

        // 4. Fetch registered destinations
        const { data: rawDests } = await supabase
          .from("destinations")
          .select("country_name, name")
          .order("created_at", { ascending: true });

        if (rawDests && rawDests.length > 0) {
          setDestinationsList(rawDests.map((d) => d.country_name || d.name || "Destination"));
        } else {
          setDestinationsList(["United Kingdom", "Canada", "Australia", "United States"]);
        }
      } catch (err) {
        console.error("Dashboard real data fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();

    // Supabase Realtime: re-fetch on any leads / students / applications change
    const channel = supabase
      .channel("dashboard-realtime-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, () => fetchDashboardData())
      .on("postgres_changes", { event: "*", schema: "public", table: "students" }, () => fetchDashboardData())
      .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, () => fetchDashboardData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const totalLeads = leads.length;

  // Real enrolments calculation
  const enrolledCount = leads.filter((l) =>
    ["enrolled", "completed", "offer_accepted"].includes((l.status || "").toLowerCase())
  ).length;

  const enrolmentRate = totalLeads > 0 ? ((enrolledCount / totalLeads) * 100).toFixed(1) : "0.0";

  // Real inquiries (no mock arrays)
  const displayInquiries = leads.slice(0, 4);

  // Primary active destination from database
  const primaryDestination = destinationsList[0] || "United Kingdom";

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* ── Welcome Greeting (Compact, Integrated) ─────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
              Consultancy Live Operations
            </span>
          </div>
          <DashboardGreeting />
          <p className="text-xs text-[#897B70]" suppressHydrationWarning>
            Pathway Education Consultancy • {format(currentDate, "EEEE, MMMM do, yyyy")}.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="rounded-xl border-white/10 bg-[#16100B]/80 text-xs text-[#F8F5F1] hover:bg-white/[0.06] hover:border-white/20 h-9"
          >
            <Link href="/appointments" className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>Today&apos;s Calendar</span>
            </Link>
          </Button>
          <CRMQuickActions />
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════
          LIQUID GLASS ASYMMETRIC GRID
          Left 8 Cols (Hero Trajectory Chart + 2 Feature Cards)
          Right 4 Cols (Stacked Portfolios Deck + Recent Inquiries)
      ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT COLUMN (67% Width) ─────────────────────────── */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* 1. PRIMARY HERO CHART CARD (Liquid Glass obsidian surface) */}
          <div className="rounded-3xl liquid-glass-hero p-6 relative overflow-hidden group">
            {/* Fine top hairline glow */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#FF6B00]/40 to-transparent" />

            {/* Header: Metric + Segmented Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-[11.5px] font-semibold text-[#897B70] uppercase tracking-wider block">
                  Total Pipeline Volume
                </span>
                <div className="flex items-baseline gap-2.5 mt-1">
                  <span className="text-3xl font-extrabold text-[#F8F5F1] tracking-tight font-mono">
                    {totalLeads > 0 ? `${totalLeads} Inquiries` : "0 Inquiries"}
                  </span>
                  {totalLeads > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {totalLeads} Active Leads
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/15 text-primary border border-primary/30">
                      Live Sync Active
                    </span>
                  )}
                </div>
              </div>

              {/* Segmented Period Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-full bg-black/50 border border-white/[0.08] self-start sm:self-auto backdrop-blur-md">
                {(["Day", "Week", "Month", "Year"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      period === p
                        ? "bg-white/[0.14] text-white shadow-sm"
                        : "text-[#897B70] hover:text-[#F8F5F1]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Real Lead & Pipeline Trajectory Curve */}
            <LeadTrendChart />
          </div>

          {/* 2. SUB-ROW: 2 DISTINCTIVE CARDS (Feature Banner + Bar Chart) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            
            {/* Card A: RADIANT BURNT-ORANGE FEATURE CARD */}
            <div className="sm:col-span-5 rounded-3xl liquid-glass-orange p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[250px] group">
              {/* Glossy atmospheric lighting accents */}
              <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-black/30 blur-2xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-white/15 blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-black/25 text-white/95 text-[10.5px] font-semibold border border-white/25 inline-block uppercase tracking-wider backdrop-blur-sm">
                  Direct Institutional Desk
                </span>
                <h3 className="text-xl font-extrabold leading-tight tracking-tight text-white">
                  Global Admissions Excellence
                </h3>
                <p className="text-xs text-white/85 leading-relaxed max-w-[220px]">
                  Direct accredited representation across UK, Canada, Australia &amp; USA partner institutions.
                </p>
              </div>

              {/* Verified Study Destination Hubs & CTA */}
              <div className="relative z-10 pt-4 space-y-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {destinationsList.slice(0, 4).map((d) => {
                    const lower = d.toLowerCase();
                    const code = lower.includes("kingdom")
                      ? "UK"
                      : lower.includes("state")
                      ? "US"
                      : lower.includes("canada")
                      ? "CA"
                      : lower.includes("australia")
                      ? "AU"
                      : d.slice(0, 2).toUpperCase();
                    return (
                      <div
                        key={d}
                        title={d}
                        className="h-7 px-2.5 rounded-lg bg-black/35 border border-white/25 flex items-center justify-center text-[10px] font-bold text-white shadow-sm backdrop-blur-sm"
                      >
                        {code}
                      </div>
                    );
                  })}
                  <span className="text-[11px] font-semibold text-white/95 pl-1.5">
                    {destinationsList.length} Global Hubs
                  </span>
                </div>

                <Link
                  href="/universities"
                  className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-white/95 text-zinc-950 text-xs font-bold shadow-xl shadow-black/25 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Explore Universities</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Card B: ENROLMENTS BAR CHART CARD */}
            <div className="sm:col-span-7 rounded-3xl liquid-glass-card p-6 flex flex-col justify-between relative overflow-hidden">
              {/* Header: Real metric + Segmented Pills */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-[11px] font-semibold text-[#897B70] uppercase tracking-wider block">
                    Enrolments
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-extrabold text-[#F8F5F1] tracking-tight font-mono">
                      {enrolmentRate}%
                    </span>
                    <span className="px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                      {enrolledCount > 0 ? `${enrolledCount} Enrolled` : "0 Enrolled"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 p-0.5 rounded-full bg-black/50 border border-white/[0.08] backdrop-blur-md">
                  {(["Monthly", "Term"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setBarTab(t)}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
                        barTab === t
                          ? "bg-white/[0.14] text-white shadow-sm"
                          : "text-[#897B70] hover:text-[#F8F5F1]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bar Chart with 100% Real Database Queries */}
              <EnrolmentsBarChart />
            </div>

          </div>
        </div>

        {/* ── RIGHT COLUMN (33% Width) ────────────────────────── */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* 3. ACTIVE PORTFOLIOS / STACKED CARDS */}
          <div className="rounded-3xl liquid-glass-card p-6 space-y-5 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F8F5F1] tracking-tight">
                My Portfolios
              </h3>
              <Link
                href="/destinations"
                className="text-[11.5px] font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                + View All
              </Link>
            </div>

            {/* Layered 3D Stacked Card Effect */}
            <div className="relative pt-3 pb-1">
              {/* Layer 3 */}
              <div className="h-3 rounded-2xl bg-gradient-to-r from-orange-600/35 to-amber-600/35 border-t border-orange-400/40 mx-6 -mb-2 shadow-sm" />
              {/* Layer 2 */}
              <div className="h-3 rounded-2xl bg-[#20140D] border-t border-white/[0.12] mx-3 -mb-2 shadow-md" />
              {/* Front Main Card */}
              <div className="rounded-2xl bg-gradient-to-br from-[#26170E] via-[#170E08] to-[#0D0704] border border-white/[0.12] p-5 text-white shadow-2xl relative overflow-hidden">
                {/* Top subtle highlight shimmer */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF6B00]/60 to-transparent" />

                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                    {primaryDestination}
                  </span>
                  <div className="h-5 px-2 rounded bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
                    <span className="text-[9px] font-mono font-bold text-amber-300 uppercase">PORTFOLIO</span>
                  </div>
                </div>

                <div className="space-y-1 mb-5">
                  <span className="text-[10px] text-[#897B70] uppercase tracking-wider block">
                    Active Admissions Caseload
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-[#F8F5F1] tracking-tight font-mono">
                      {appsCount} Applications
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
                      {studentsCount} Enrolled
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#897B70] pt-2 border-t border-white/[0.08]">
                  <span>Adviser: {profile?.name || "Director Desk"}</span>
                  <span className="font-mono text-[#BDB0A4]">Fall 2026 Term</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Button
                asChild
                className="rounded-2xl bg-[#20140D] hover:bg-[#2A1B12] border border-white/[0.08] text-xs font-semibold text-[#F8F5F1] h-10 shadow-sm"
              >
                <Link href="/applications" className="flex items-center justify-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span>Pipeline</span>
                </Link>
              </Button>

              <Button
                asChild
                className="rounded-2xl bg-gradient-to-r from-primary to-[#E05300] hover:opacity-90 text-xs font-semibold text-white h-10 shadow-lg shadow-primary/25"
              >
                <Link href="/leads" className="flex items-center justify-center gap-1.5">
                  <Plus className="h-4 w-4" />
                  <span>Add Lead</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* 4. RECENT INQUIRIES (100% Real Supabase Data & Empty State) */}
          <div className="rounded-3xl liquid-glass-card p-6 space-y-4 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F8F5F1] tracking-tight">
                Recent Inquiries
              </h3>
              <Link
                href="/leads"
                className="text-[11.5px] font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                View All &rarr;
              </Link>
            </div>

            {/* Inquiries List or Empty State */}
            {displayInquiries.length === 0 ? (
              <div className="p-6 rounded-2xl liquid-glass-pill border border-white/[0.06] text-center space-y-3">
                <div className="h-10 w-10 mx-auto rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-inner">
                  <Users className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[#F8F5F1]">No Inquiries Logged Yet</p>
                  <p className="text-[11px] text-[#897B70] leading-relaxed max-w-[240px] mx-auto">
                    Incoming leads from the portal and walk-in applicants will appear here in real time.
                  </p>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="h-8 rounded-xl bg-gradient-to-r from-primary to-[#E05300] hover:opacity-95 text-white text-xs font-semibold px-3 shadow-md shadow-primary/20"
                >
                  <Link href="/leads" className="flex items-center gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add First Lead</span>
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {displayInquiries.map((inq) => {
                  const initials = inq.name
                    ? inq.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()
                    : "ST";
                  const createdDate = inq.createdAt ? new Date(inq.createdAt) : new Date();
                  const timeFormatted = formatDistanceToNow(createdDate, { addSuffix: true });

                  return (
                    <div
                      key={inq.id}
                      className="p-3 rounded-2xl liquid-glass-pill flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-[#22150D] border border-primary/30 flex items-center justify-center font-bold text-xs text-primary shrink-0 group-hover:border-primary/60 transition-colors">
                          {initials}
                        </div>
                        <div className="min-w-0 leading-snug">
                          <span className="font-bold text-xs text-[#F8F5F1] block truncate group-hover:text-primary transition-colors">
                            {inq.name}
                          </span>
                          <span className="text-[10.5px] text-[#897B70] block truncate">
                            {inq.course || inq.destination}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-emerald-400 block font-mono">
                          {inq.status}
                        </span>
                        <span className="text-[10px] text-[#7E7065] block">
                          {timeFormatted}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
