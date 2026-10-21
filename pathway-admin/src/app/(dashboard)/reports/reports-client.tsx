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
  Award,
  Sparkles,
  ArrowUpRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
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
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#F8F5F1]">
              Executive Analytics &amp; Reports
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/15 text-[#FF8A35] text-xs font-bold border border-orange-500/30 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Real-time Sync
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#BDB0A4] mt-1">
            Analyze counselor conversions, admission success rates, monthly consultancy billings, and visa outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date range selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-9 rounded-xl border border-white/[0.08] bg-[#1D1510] px-3 text-xs text-[#F8F5F1] font-semibold outline-none cursor-pointer"
          >
            <option value="Today" className="bg-[#1D1510]">Today</option>
            <option value="This Week" className="bg-[#1D1510]">This Week</option>
            <option value="This Month" className="bg-[#1D1510]">This Month</option>
            <option value="This Quarter" className="bg-[#1D1510]">This Quarter</option>
            <option value="This Year" className="bg-[#1D1510]">This Year</option>
          </select>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleExport("csv")}
            className="text-xs rounded-xl border-white/[0.08] bg-[#15100D] hover:bg-[#1D1510] text-[#F8F5F1] h-9 px-3"
          >
            <Download className="h-3.5 w-3.5 mr-1 text-orange-400" /> CSV
          </Button>

          <Button
            size="sm"
            onClick={() => handleExport("pdf")}
            className="text-xs rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A35] text-white font-semibold shadow-md shadow-orange-950/40 h-9 px-3.5"
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Top 4 Performance Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-4 backdrop-blur-md shadow-xl space-y-1">
          <p className="text-[11px] text-[#897B70] uppercase font-semibold">Consultancy Conversion</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{metrics.conversionRate.toFixed(1)}%</p>
          <p className="text-[11px] text-[#897B70]">Based on all captured leads</p>
        </div>

        <div className="rounded-2xl border border-orange-500/25 bg-orange-500/[0.07] p-4 backdrop-blur-md shadow-xl space-y-1">
          <p className="text-[11px] text-[#FF8A35] uppercase font-semibold">University Offer Ratio</p>
          <p className="text-2xl font-bold text-[#FF8A35] mt-1">{metrics.offerRatio.toFixed(1)}%</p>
          <p className="text-[11px] text-orange-400/80">From total submissions</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-4 backdrop-blur-md shadow-xl space-y-1">
          <p className="text-[11px] text-[#897B70] uppercase font-semibold">Visa Success Rate</p>
          <p className="text-2xl font-bold text-sky-400 mt-1">{metrics.visaSuccessRate.toFixed(1)}%</p>
          <p className="text-[11px] text-[#897B70]">From completed visa filing</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-4 backdrop-blur-md shadow-xl space-y-1">
          <p className="text-[11px] text-[#897B70] uppercase font-semibold">Total Net Billed</p>
          <p className="text-2xl font-bold text-[#F8F5F1] mt-1">${metrics.totalRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400">Real-time synced</p>
        </div>
      </div>

      {/* Revenue Trajectory Chart */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-5 backdrop-blur-md shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#F8F5F1]">Consultancy Revenue vs Target ($)</h3>
            <p className="text-xs text-[#897B70]">Cumulative advisory retainers, application fees, and service charges.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-[#F8F5F1]">
              <span className="h-3 w-3 rounded-sm bg-[#FF6B00]" /> Achieved Revenue
            </span>
            <span className="flex items-center gap-1.5 text-[#897B70]">
              <span className="h-3 w-3 rounded-sm bg-[#BDB0A4]/30" /> Monthly Target
            </span>
          </div>
        </div>

        <div className="h-[260px] w-full pt-2">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#897B70" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#897B70" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#15100D",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                    color: "#F8F5F1",
                    fontSize: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
                  }}
                />
                <Bar dataKey="revenue" name="Achieved Revenue" fill="#FF6B00" radius={[4, 4, 0, 0]} barSize={26} />
                <Bar dataKey="target" name="Monthly Target" fill="rgba(189, 176, 164, 0.25)" radius={[4, 4, 0, 0]} barSize={26} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full rounded-xl bg-white/[0.02] animate-pulse" />
          )}
        </div>
      </div>

      {/* Counsellor Workload & Performance Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 backdrop-blur-md shadow-xl overflow-hidden">
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#F8F5F1] flex items-center gap-2">
              <Award className="h-4 w-4 text-[#FF6B00]" /> Counsellor Scorecard &amp; Attribution
            </h3>
            <p className="text-xs text-[#897B70] mt-0.5">
              Individual conversion productivity, student allocations, and generated revenue.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#18120D] text-[#897B70] uppercase text-[11px] tracking-wider font-semibold">
                <th className="py-3.5 px-4">Counsellor Name</th>
                <th className="py-3.5 px-3">Assigned Leads</th>
                <th className="py-3.5 px-3">Converted Students</th>
                <th className="py-3.5 px-3">Conversion Rate</th>
                <th className="py-3.5 px-4 text-right">Attributed Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {metrics.counsellorPerf.map((c) => (
                <tr key={c.name} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#F8F5F1]">
                    {c.name}
                  </td>
                  <td className="py-3.5 px-3 text-[#BDB0A4]">
                    {c.leads} inquiries
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-emerald-400">
                    {c.converted} enrolled
                  </td>
                  <td className="py-3.5 px-3 font-bold text-[#F8F5F1]">
                    {c.conversionRate}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-orange-400 font-mono">
                    {c.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
