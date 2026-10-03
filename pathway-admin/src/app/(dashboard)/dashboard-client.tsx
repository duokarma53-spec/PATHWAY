"use client";

import * as React from "react";
import {
  Users,
  GraduationCap,
  FileText,
  Sparkles,
  Calendar,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { KPICard } from "@/components/ui/kpi-card";
import { Button } from "@/components/ui/button";
import {
  LeadTrendChart,
  ConversionFunnel
} from "@/components/dashboard/crm-dashboard-charts";
import { CRMQuickActions } from "@/components/actions/crm-quick-actions";
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";
import Link from "next/link";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";

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
  const [leads, setLeads] = React.useState<RealLead[]>([]);
  const [studentsCount, setStudentsCount] = React.useState(0);
  const [appsCount, setAppsCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

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
            destination: r.destination || "Study Abroad",
            course: r.course || r.qualification || "Higher Education",
            status: r.status || "New",
            leadSource: r.lead_source || "Website Inquiry",
            intake: r.intake || "Upcoming Intake",
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
      } catch (err) {
        console.error("Dashboard real data fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();

    // Supabase Realtime: re-fetch on any leads / students / applications change
    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => fetchDashboardData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        () => fetchDashboardData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications" },
        () => fetchDashboardData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const totalLeads = leads.length;
  const newInquiries = leads.filter(
    (l) => (l.status || "").toLowerCase() === "new"
  ).length;
  const recentInquiries = leads.slice(0, 4);

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Consultancy Live Operations
            </span>
          </div>
          <DashboardGreeting />
          <p className="text-xs md:text-sm text-muted-foreground" suppressHydrationWarning>
            Pathway Education Consultancy overview for {format(currentDate, "EEEE, MMMM do, yyyy")}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="rounded-xl border-border/70 text-xs">
            <Link href="/appointments" className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" /> Today&apos;s Calendar
            </Link>
          </Button>
          <CRMQuickActions />
        </div>
      </div>

      {/* KPI Cards - 4 core real-time metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <KPICard
          title="Total Leads"
          value={String(totalLeads)}
          subtitle="All time inquiries"
          trend={totalLeads > 0 ? `${totalLeads} active` : "Ready to test"}
          trendPositive={totalLeads > 0}
          icon={Users}
          iconColor="text-primary"
          iconBg="bg-primary/10 border-primary/20"
        />
        <KPICard
          title="New Inquiries"
          value={String(newInquiries)}
          subtitle="Needs first response"
          trend={newInquiries > 0 ? `${newInquiries} pending` : "No pending"}
          trendPositive={newInquiries === 0}
          icon={Sparkles}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10 border-amber-500/20"
        />
        <KPICard
          title="Active Students"
          value={String(studentsCount)}
          subtitle="Converted profiles"
          trend={studentsCount > 0 ? `${studentsCount} enrolled` : "Fresh pipeline"}
          trendPositive={true}
          icon={GraduationCap}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
        />
        <KPICard
          title="Applications In Progress"
          value={String(appsCount)}
          subtitle="Under university review"
          trend={`${appsCount} active`}
          trendPositive={true}
          icon={FileText}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10 border-blue-500/20"
        />
      </div>

      {/* Row 2: Analytics & Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Trend Chart */}
        <Card className="lg:col-span-2 border-border/60 bg-card/75 backdrop-blur-xl shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Lead Generation & Enrolments Over Time</CardTitle>
              <CardDescription className="text-xs">
                Real monthly trajectory of incoming student inquiries vs enrolled students.
              </CardDescription>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-muted text-muted-foreground font-medium">
              Last 6 Months
            </span>
          </CardHeader>
          <CardContent className="pt-2">
            <LeadTrendChart />
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="border-border/60 bg-card/75 backdrop-blur-xl shadow-md flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">Consultancy Conversion Funnel</CardTitle>
            <CardDescription className="text-xs">
              Inquiry → Counselling → Application → Visa → Enrolled
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ConversionFunnel />
          </CardContent>
        </Card>
      </div>

      {/* Row 3: "Today's Tasks & Priorities" + "Recent Inquiries" */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks & Consultations */}
        <Card className="lg:col-span-2 border-border/60 bg-card/75 backdrop-blur-xl shadow-md">
          <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Today&apos;s High-Priority Tasks & Appointments
              </CardTitle>
              <CardDescription className="text-xs">
                Time-sensitive follow-ups, calls, and booked student consultations.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs text-primary hover:underline">
              <Link href="/tasks">View All Tasks &rarr;</Link>
            </Button>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            <div className="py-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center space-y-2">
              <div className="h-10 w-10 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-center text-muted-foreground">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <p className="font-semibold text-foreground">No pending tasks or appointments today</p>
              <p className="max-w-sm text-[11px] leading-relaxed">
                As counselors schedule student consultations and follow-up deadlines, they will appear here in chronological order.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recently Received Inquiries */}
        <Card className="border-border/60 bg-card/75 backdrop-blur-xl shadow-md flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" /> Recent Inquiries
              </CardTitle>
              <CardDescription className="text-xs">Incoming leads from website forms.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs text-primary hover:underline">
              <Link href="/inquiries">View All</Link>
            </Button>
          </CardHeader>

          <CardContent className="p-4 space-y-3 flex-1">
            {recentInquiries.length === 0 ? (
              <p className="text-xs text-muted-foreground py-8 text-center">
                No inquiries yet. Real submissions from the website will appear here live.
              </p>
            ) : (
              recentInquiries.map((lead) => (
                <Link
                  key={lead.id}
                  href="/inquiries"
                  className="block p-3 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/40 hover:bg-muted/50 transition-all group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {lead.name}
                    </span>
                    {lead.status.toLowerCase() === "new" && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    {lead.course} • {lead.destination}
                  </p>
                  <div className="text-[10px] text-muted-foreground/70 flex items-center justify-between mt-1">
                    <span>Source: {lead.leadSource}</span>
                    <span>{lead.intake}</span>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
