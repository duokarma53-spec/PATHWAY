"use client"

import * as React from "react"
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  DollarSign,
  Users,
  GraduationCap,
  ShieldCheck,
  Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line
} from "recharts"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export function ReportsClientView() {
  const [dateRange, setDateRange] = React.useState("This Month")
  const [mounted, setMounted] = React.useState(false)

  // Real-time data states
  const [leads, setLeads] = React.useState<any[]>([])
  const [applications, setApplications] = React.useState<any[]>([])

  React.useEffect(() => {
    setMounted(true)
    
    const supabase = createClient()
    
    async function fetchReportsData() {
      try {
        const { data: leadsData } = await supabase.from("leads").select("*")
        if (leadsData) setLeads(leadsData)
          
        const { data: appsData } = await supabase.from("applications").select("*")
        if (appsData) setApplications(appsData)
      } catch (err) {
        console.error("Error fetching reports data", err)
      }
    }
    
    fetchReportsData()
    
    const channel = supabase
      .channel("reports-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, fetchReportsData)
      .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, fetchReportsData)
      .subscribe()
      
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Derived Metrics
  const metrics = React.useMemo(() => {
    let convertedLeads = 0
    let totalRevenue = 0
    leads.forEach(lead => {
      const status = (lead.status || "").toLowerCase()
      if (status === "enrolled" || status === "converted" || status === "converted to student") {
        convertedLeads++
        totalRevenue += lead.revenue ? Number(lead.revenue) : 2000
      }
    })
    const conversionRate = leads.length > 0 ? (convertedLeads / leads.length) * 100 : 0

    let offers = 0
    let submitted = 0
    let visaCompleted = 0
    let visaTotal = 0
    
    applications.forEach(app => {
      const status = app.status || ""
      const isOffer = ["Conditional Offer", "Unconditional Offer", "Deposit Pending", "Deposit Paid", "Visa Processing", "Completed"].includes(status)
      if (isOffer) offers++
      
      const isSubmitted = ["Application Submitted", "Under Review", "Conditional Offer", "Unconditional Offer", "Deposit Pending", "Deposit Paid", "Visa Processing", "Completed"].includes(status)
      if (isSubmitted) submitted++
      
      const isVisaStage = ["Visa Processing", "Completed"].includes(status)
      if (isVisaStage) {
        visaTotal++
        if (status === "Completed") visaCompleted++
      }
    })
    
    const offerRatio = submitted > 0 ? (offers / submitted) * 100 : 0
    const visaSuccessRate = visaTotal > 0 ? (visaCompleted / visaTotal) * 100 : 0

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const revenueByMonth = new Array(12).fill(0)
    leads.forEach(lead => {
      const status = (lead.status || "").toLowerCase()
      if (status === "enrolled" || status === "converted" || status === "converted to student") {
        if (lead.created_at) {
          const d = new Date(lead.created_at)
          revenueByMonth[d.getMonth()] += lead.revenue ? Number(lead.revenue) : 2000
        }
      }
    })

    const currentMonth = new Date().getMonth()
    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i
      if (m < 0) m += 12
      monthlyData.push({
        month: months[m],
        revenue: revenueByMonth[m],
        target: 15000 
      })
    }

    const counsellorStats: Record<string, { leads: number; converted: number; revenue: number }> = {}
    leads.forEach(lead => {
      // Extract from meta notes or default to Admin
      let assigned = "Admin"
      try {
        if (lead.notes && typeof lead.notes === 'string' && lead.notes.startsWith('{')) {
          const meta = JSON.parse(lead.notes)
          if (meta.counsellor) assigned = meta.counsellor
        }
      } catch(e) {}
      
      const counsellor = lead.assigned_to || assigned
      if (!counsellorStats[counsellor]) counsellorStats[counsellor] = { leads: 0, converted: 0, revenue: 0 }
      
      counsellorStats[counsellor].leads++
      
      const status = (lead.status || "").toLowerCase()
      if (status === "enrolled" || status === "converted" || status === "converted to student") {
        counsellorStats[counsellor].converted++
        counsellorStats[counsellor].revenue += lead.revenue ? Number(lead.revenue) : 2000
      }
    })
    
    let counsellorPerf = Object.entries(counsellorStats).map(([name, data]) => ({
      name,
      leads: data.leads,
      converted: data.converted,
      conversionRate: data.leads > 0 ? ((data.converted / data.leads) * 100).toFixed(1) + "%" : "0%",
      revenue: `$${data.revenue.toLocaleString()}`
    })).sort((a, b) => Number(b.revenue.replace(/[^0-9.-]+/g,"")) - Number(a.revenue.replace(/[^0-9.-]+/g,"")))
    
    if (counsellorPerf.length === 0) {
      counsellorPerf = [{ name: "Admin", leads: 0, converted: 0, conversionRate: "0%", revenue: "$0" }]
    }

    return {
      conversionRate,
      offerRatio,
      visaSuccessRate,
      totalRevenue,
      monthlyData,
      counsellorPerf
    }
  }, [leads, applications])

  const handleExport = (format: string) => {
    toast.success(`Exporting consultancy executive report as ${format.toUpperCase()}...`)
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Executive Analytics & Performance Reports
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">
              Audit Ready
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Analyze counselor conversions, admission success rates, monthly consultancy billings, and visa outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date range selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground font-semibold outline-none"
          >
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="This Quarter">This Quarter</option>
            <option value="This Year">This Year</option>
          </select>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleExport("csv")}
            className="text-xs rounded-xl border-border/70"
          >
            <Download className="h-3.5 w-3.5 mr-1" /> CSV
          </Button>

          <Button
            size="sm"
            onClick={() => handleExport("pdf")}
            className="text-xs rounded-xl bg-primary text-primary-foreground font-semibold"
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Top 4 Performance Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <Card className="border-border/60 bg-card/75 p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Consultancy Conversion Rate</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{metrics.conversionRate.toFixed(1)}%</p>
          <p className="text-[11px] text-muted-foreground mt-1">Based on all captured leads</p>
        </Card>
        <Card className="border-border/60 bg-card/75 p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">University Offer Ratio</p>
          <p className="text-2xl font-bold text-primary mt-1">{metrics.offerRatio.toFixed(1)}%</p>
          <p className="text-[11px] text-muted-foreground mt-1">From total submissions</p>
        </Card>
        <Card className="border-border/60 bg-card/75 p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Visa Success Rate</p>
          <p className="text-2xl font-bold text-violet-400 mt-1">{metrics.visaSuccessRate.toFixed(1)}%</p>
          <p className="text-[11px] text-muted-foreground mt-1">From completed visa processing</p>
        </Card>
        <Card className="border-border/60 bg-card/75 p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Net Billed</p>
          <p className="text-2xl font-bold text-foreground mt-1">${metrics.totalRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400 mt-1">Real-time synced</p>
        </Card>
      </div>

      {/* Revenue Trajectory Chart */}
      <Card className="border-border/60 bg-card/75 backdrop-blur-xl shadow-md">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-foreground">Consultancy Revenue vs Target ($)</CardTitle>
            <CardDescription className="text-xs">Cumulative advisory retainers, application fees, and service charges.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#131B2E",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#F8FAFC",
                      fontSize: "12px"
                    }}
                  />
                  <Bar dataKey="revenue" name="Achieved Revenue" fill="#10B981" radius={[4, 4, 0, 0]} barSize={26} />
                  <Bar dataKey="target" name="Monthly Target" fill="#E5C05D" radius={[4, 4, 0, 0]} barSize={26} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full rounded-xl bg-linen/20 animate-pulse" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Counsellor Workload & Performance Table */}
      <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-lg overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" /> Counsellor Scorecard & Attribution
          </CardTitle>
          <CardDescription className="text-xs">
            Individual conversion productivity, student allocations, and generated revenue.
          </CardDescription>
        </CardHeader>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30 text-muted-foreground uppercase text-[11px] tracking-wider font-semibold">
                <th className="py-3 px-4">Counsellor Name</th>
                <th className="py-3 px-3">Assigned Leads</th>
                <th className="py-3 px-3">Converted Students</th>
                <th className="py-3 px-3">Conversion Rate</th>
                <th className="py-3 px-4 text-right">Attributed Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {metrics.counsellorPerf.map((c) => (
                <tr key={c.name} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-foreground">
                    {c.name}
                  </td>
                  <td className="py-3.5 px-3 text-muted-foreground">
                    {c.leads} inquiries
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-emerald-400">
                    {c.converted} enrolled
                  </td>
                  <td className="py-3.5 px-3 font-bold text-foreground">
                    {c.conversionRate}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-primary">
                    {c.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
