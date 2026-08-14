import { getDashboardData } from '@/lib/dashboard/queries'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Users, FileText, Calendar, CheckCircle, Plus, ArrowUpRight, Clock, AlertCircle } from 'lucide-react'
import { DashboardChart } from '@/components/dashboard-chart'
import { Button } from '@/components/ui/button'
import { AddLeadButton, ScheduleButton } from '@/components/actions/quick-actions'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function DashboardPage() {
  const data = await getDashboardData()

  // Real data gracefully falls back to 0 if the tables are empty or don't exist yet
  const kpis = data.kpis || { newLeads: 0, upcomingConsultations: 0, activeApplications: 0, offers: 0 }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Good morning, Admin.
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Here's what needs your attention today, {format(new Date(), 'EEEE, MMMM do')}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ScheduleButton className="h-9 px-4 rounded-full font-medium" />
          <AddLeadButton variant="default" className="h-9 px-4 rounded-full font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" />
        </div>
      </div>
      
      {/* KPI Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-sm hover:border-border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">New Leads</CardTitle>
            <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{kpis.newLeads}</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
              New this week
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:border-border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Consultations</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{kpis.upcomingConsultations}</div>
            <p className="text-xs text-muted-foreground font-medium flex items-center mt-1">
              Upcoming today
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:border-border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Active Applications</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{kpis.activeApplications}</div>
            <p className="text-xs text-muted-foreground font-medium flex items-center mt-1">
              In progress
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:border-border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Offers Received</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{kpis.offers}</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
              Recent offers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics & Funnel */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-2 border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Admissions Overview</CardTitle>
                <CardDescription className="text-xs mt-1">Application volume and success rate</CardDescription>
              </div>
              <select className="text-xs bg-muted/50 border-none rounded-md px-2 py-1 outline-none text-muted-foreground font-medium">
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="pl-2 h-[300px]">
            <DashboardChart />
          </CardContent>
        </Card>

        <Card className="col-span-1 border-border/50 shadow-sm flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Lead Funnel</CardTitle>
            <CardDescription className="text-xs mt-1">Current active pipeline</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4 pt-2">
              {[
                { label: 'New Leads', count: kpis.newLeads, percent: 100 },
                { label: 'Contacted', count: Math.floor(kpis.newLeads * 0.8), percent: 80 },
                { label: 'Qualified', count: Math.floor(kpis.newLeads * 0.5), percent: 50 },
                { label: 'Consultations', count: Math.floor(kpis.newLeads * 0.3), percent: 30 },
              ].map((stage, i) => (
                <div key={i} className="flex items-center justify-between group cursor-default">
                  <div className="w-1/3 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{stage.label}</div>
                  <div className="w-1/2 bg-muted/30 rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${stage.percent}%` }} />
                  </div>
                  <div className="w-1/6 text-right text-sm font-semibold">{stage.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Row: Priorities & Consultations */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-destructive" />
              Today's Priorities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.priorities.overdueTasks.length > 0 ? (
               <div className="space-y-4">
                 {data.priorities.overdueTasks.map((task: any) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 rounded-md border border-destructive/20 bg-destructive/5">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-destructive" />
                      <div>
                        <p className="text-sm font-semibold text-destructive">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Due {format(new Date(task.due_date), 'MMM d, h:mm a')}</p>
                      </div>
                    </div>
                 ))}
               </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <CheckCircle className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-sm font-medium">You're all caught up!</p>
                <p className="text-xs">No overdue tasks or urgent items.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming Consultations</CardTitle>
            <Link href="/consultations" className="text-xs text-accent font-medium hover:underline">View All</Link>
          </CardHeader>
          <CardContent>
            {data.upcomingConsultations.length > 0 ? (
               <div className="space-y-4">
                 {data.upcomingConsultations.map((consult: any) => (
                    <div key={consult.id} className="flex items-center gap-4 py-2 border-b last:border-0 border-border/50">
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-muted/40 text-center">
                        <span className="text-xs font-semibold text-primary">{format(new Date(consult.preferred_date || new Date()), 'h:mm')}</span>
                        <span className="text-[10px] uppercase text-muted-foreground">{format(new Date(consult.preferred_date || new Date()), 'a')}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{consult.name}</p>
                        <p className="text-xs text-muted-foreground">{consult.email}</p>
                      </div>
                      <div className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-semibold uppercase tracking-wider">
                        {consult.status}
                      </div>
                    </div>
                 ))}
               </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Calendar className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-sm font-medium">No consultations today</p>
                <Button variant="link" className="text-xs text-accent h-auto p-0 mt-1">Schedule one</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
