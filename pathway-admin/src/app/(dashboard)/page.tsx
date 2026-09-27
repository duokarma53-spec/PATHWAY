import * as React from "react"
import {
  Users,
  UserPlus,
  GraduationCap,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Clock,
  FolderOpen,
  ArrowUpRight,
  Calendar,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  PhoneCall,
  Check
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { KPICard } from "@/components/ui/kpi-card"
import { Button } from "@/components/ui/button"
import {
  LeadTrendChart,
  LeadsBySourceChart,
  LeadsByDestinationChart,
  ConversionFunnel
} from "@/components/dashboard/crm-dashboard-charts"
import { CRMQuickActions } from "@/components/actions/crm-quick-actions"
import {
  INITIAL_LEADS,
  INITIAL_STUDENTS,
  INITIAL_APPLICATIONS,
  INITIAL_TASKS,
  INITIAL_APPOINTMENTS,
  INITIAL_ACTIVITY_LOGS
} from "@/lib/mock-data"
import Link from "next/link"
import { format } from "date-fns"

export const metadata = {
  title: "Pathway CRM | Executive Consultancy Dashboard",
  description: "Comprehensive operations, student pipeline, and lead management platform.",
}

export default function DashboardPage() {
  const currentDate = new Date()

  // Recent leads (especially 'New' ones)
  const recentInquiries = INITIAL_LEADS.slice(0, 4)
  const todayTasks = INITIAL_TASKS.slice(0, 4)
  const todayAppointments = INITIAL_APPOINTMENTS.slice(0, 3)

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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Good morning, Hatim.
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
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

      {/* Top 8 KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <KPICard
          title="Total Leads"
          value="142"
          subtitle="All time inquiries"
          trend="+18% MoM"
          trendPositive={true}
          icon={Users}
          iconColor="text-primary"
          iconBg="bg-primary/10 border-primary/20"
        />
        <KPICard
          title="New Inquiries"
          value="14"
          subtitle="Needs first response"
          trend="+5 today"
          trendPositive={true}
          icon={Sparkles}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10 border-amber-500/20"
        />
        <KPICard
          title="Active Students"
          value="38"
          subtitle="Converted profiles"
          trend="85% retention"
          trendPositive={true}
          icon={GraduationCap}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
        />
        <KPICard
          title="Applications in Progress"
          value="28"
          subtitle="Under university review"
          trend="+4 this week"
          trendPositive={true}
          icon={FileText}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10 border-blue-500/20"
        />
        <KPICard
          title="Offers Received"
          value="19"
          subtitle="Conditional & Firm"
          trend="68% offer rate"
          trendPositive={true}
          icon={CheckCircle2}
          iconColor="text-teal-400"
          iconBg="bg-teal-500/10 border-teal-500/20"
        />
        <KPICard
          title="Visa Applications"
          value="12"
          subtitle="Lodged at embassies"
          trend="100% grant rate"
          trendPositive={true}
          icon={ShieldCheck}
          iconColor="text-violet-400"
          iconBg="bg-violet-500/10 border-violet-500/20"
        />
        <KPICard
          title="Upcoming Follow-ups"
          value="9"
          subtitle="Due within 48 hours"
          trend="2 urgent calls"
          trendPositive={false}
          icon={Clock}
          iconColor="text-orange-400"
          iconBg="bg-orange-500/10 border-orange-500/20"
        />
        <KPICard
          title="Pending Documents"
          value="15"
          subtitle="Awaiting student upload"
          trend="Action required"
          trendPositive={false}
          icon={FolderOpen}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/10 border-cyan-500/20"
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
                Monthly trajectory of incoming student inquiries vs final enrolled students.
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

      {/* Row 3: Destination Distribution & Source Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/60 bg-card/75 backdrop-blur-xl shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">Leads by Destination Country</CardTitle>
            <CardDescription className="text-xs">Top study abroad destinations preferred by prospective students.</CardDescription>
          </CardHeader>
          <CardContent>
            <LeadsByDestinationChart />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/75 backdrop-blur-xl shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">Lead Acquisition Channels</CardTitle>
            <CardDescription className="text-xs">Breakdown of sources feeding the CRM pipeline.</CardDescription>
          </CardHeader>
          <CardContent>
            <LeadsBySourceChart />
          </CardContent>
        </Card>
      </div>

      {/* Row 4: "Today's Tasks & Priorities" + "Recent Inquiries" */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks & Urgent Follow-ups */}
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
            {/* Appointments today */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Upcoming Sessions Today
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {todayAppointments.map((apt) => (
                  <div key={apt.id} className="p-3 rounded-xl bg-muted/30 border border-border/40 flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0 mt-0.5">
                      {apt.time}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{apt.studentName}</p>
                      <p className="text-[11px] text-muted-foreground">{apt.type} • {apt.mode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overdue / Urgent Tasks */}
            <div className="space-y-2 pt-2 border-t border-border/30">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Follow-ups & Reminders
              </p>
              <div className="space-y-2">
                {todayTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{t.title}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Target: {t.entityName} • Assigned: {t.assignedStaff}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground font-medium shrink-0">
                      {t.category}
                    </span>
                  </div>
                ))}
              </div>
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
              <Link href="/leads">View All</Link>
            </Button>
          </CardHeader>

          <CardContent className="p-4 space-y-3 flex-1">
            {recentInquiries.map((lead) => (
              <Link
                key={lead.id}
                href={`/leads/${lead.id}`}
                className="block p-3 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/40 hover:bg-muted/50 transition-all group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {lead.name}
                  </span>
                  {lead.status === "New" && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                  {lead.course} • {lead.preferredDestination}
                </p>
                <div className="text-[10px] text-muted-foreground/70 flex items-center justify-between mt-1">
                  <span>Source: {lead.leadSource}</span>
                  <span>{lead.intake}</span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Row 5: Recent Activity Feed */}
      <Card className="border-border/60 bg-card/75 backdrop-blur-xl shadow-md">
        <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-foreground">Operational Activity Feed</CardTitle>
            <CardDescription className="text-xs">Live audit stream of staff updates and student submissions.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-xs text-primary hover:underline">
            <Link href="/audit-logs">Audit Log &rarr;</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INITIAL_ACTIVITY_LOGS.map((act) => (
              <div key={act.id} className="p-3.5 rounded-xl bg-muted/20 border border-border/40 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">{act.actor}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{act.timestamp}</span>
                </div>
                <p className="text-foreground/90 leading-snug">
                  {act.action} <strong>{act.entity}</strong>
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
