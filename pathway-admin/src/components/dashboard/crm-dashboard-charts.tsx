"use client"

import * as React from "react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"
import { createClient } from "@/lib/supabase/client"
import { format, subMonths } from "date-fns"

// ─────────────────────────────────────────────────────────────────────────────
// 1. DOMINANT LEAD & PIPELINE TRAJECTORY CHART (Liquid Glass Hero Chart)
// ─────────────────────────────────────────────────────────────────────────────
export function LeadTrendChart() {
  const [mounted, setMounted] = React.useState(false)
  const [trendData, setTrendData] = React.useState<{ month: string; leads: number; conversions: number }[]>([])
  const [totalLeadsCount, setTotalLeadsCount] = React.useState(0)
  const [peakMonth, setPeakMonth] = React.useState<{ month: string; leads: number } | null>(null)

  React.useEffect(() => {
    setMounted(true)
    const supabase = createClient()

    async function loadMonthlyTrends() {
      // Build past 6 calendar months
      const months: { [key: string]: { month: string; leads: number; conversions: number; rawDate: Date } } = {}
      for (let i = 5; i >= 0; i--) {
        const d = subMonths(new Date(), i)
        const key = format(d, "MMM yyyy")
        const label = format(d, "MMM")
        months[key] = { month: label, leads: 0, conversions: 0, rawDate: d }
      }

      try {
        const { data } = await supabase
          .from("leads")
          .select("created_at, status")

        let total = 0
        let maxLeads = 0
        let peak: { month: string; leads: number } | null = null

        if (data && data.length > 0) {
          data.forEach((row) => {
            if (!row.created_at) return
            total++
            const date = new Date(row.created_at)
            const key = format(date, "MMM yyyy")
            if (months[key]) {
              months[key].leads += 1
              if (["enrolled", "completed"].includes((row.status || "").toLowerCase())) {
                months[key].conversions += 1
              }
            }
          })

          Object.values(months).forEach((m) => {
            if (m.leads > maxLeads) {
              maxLeads = m.leads
              peak = { month: m.month, leads: m.leads }
            }
          })
        }

        setTotalLeadsCount(total)
        setPeakMonth(peak)
        setTrendData(
          Object.values(months).map(({ month, leads, conversions }) => ({
            month,
            leads,
            conversions,
          }))
        )
      } catch (err) {
        console.error("Error loading lead trends:", err)
      }
    }

    loadMonthlyTrends()

    // Supabase Realtime: update chart on any leads change
    const channel = supabase
      .channel("lead-trend-realtime-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => loadMonthlyTrends()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (!mounted) {
    return <div className="h-[250px] w-full rounded-2xl bg-[#140E0A]/60 animate-pulse" />
  }

  return (
    <div className="relative w-full">
      {/* Floating Peak Callout Badge (Only shown when real leads exist) */}
      {totalLeadsCount > 0 && peakMonth && peakMonth.leads > 0 && (
        <div className="absolute right-[24%] top-1 z-10 hidden sm:flex flex-col items-center pointer-events-none animate-in fade-in duration-500">
          <div className="px-3 py-1.5 rounded-xl bg-white text-zinc-950 shadow-2xl shadow-black/80 border border-white/40 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11.5px] font-bold font-mono text-zinc-900">
              Peak: {peakMonth.month} ({peakMonth.leads} Inquiries)
            </span>
          </div>
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-white -mt-[1px]" />
        </div>
      )}

      {/* Empty State Overlay when no lead records exist */}
      {totalLeadsCount === 0 && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4">
          <div className="liquid-glass-pill p-5 rounded-2xl border border-white/[0.08] text-center max-w-sm shadow-2xl space-y-2 backdrop-blur-md">
            <div className="h-8 w-8 mx-auto rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-inner">
              <span className="text-base font-bold">↗</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#F8F5F1]">No Inquiry Trajectory Yet</p>
              <p className="text-[11px] text-[#897B70] leading-relaxed mt-0.5">
                Real inquiry trajectory and enrolment conversions will chart automatically as prospective students are captured.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`h-[250px] w-full transition-opacity duration-300 ${totalLeadsCount === 0 ? "opacity-25" : "opacity-100"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 24, right: 10, left: -24, bottom: 0 }}>
            <defs>
              {/* Rich warm amber-orange liquid gradient */}
              <linearGradient id="heroOrangeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6B00" stopOpacity={0.65} />
                <stop offset="30%" stopColor="#E05300" stopOpacity={0.35} />
                <stop offset="70%" stopColor="#8A2B00" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#0D0704" stopOpacity={0.0} />
              </linearGradient>

              {/* Secondary Emerald Flow */}
              <linearGradient id="heroEmeraldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.04)" />
            <XAxis dataKey="month" stroke="#7E7065" fontSize={11} tickLine={false} axisLine={false} dy={8} />
            <YAxis stroke="#7E7065" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#16100B",
                border: "1px solid rgba(255, 107, 0, 0.35)",
                borderRadius: "14px",
                boxShadow: "0 16px 36px rgba(0, 0, 0, 0.8)",
                color: "#F8F5F1",
                fontSize: "12px",
                padding: "10px 14px",
              }}
              labelStyle={{ color: "#F8F5F1", fontWeight: 700, marginBottom: "4px" }}
              itemStyle={{ padding: "2px 0" }}
            />

            <Area
              type="monotone"
              dataKey="leads"
              name="Inquiries"
              stroke="#FF7A1A"
              strokeWidth={2.8}
              fillOpacity={1}
              fill="url(#heroOrangeGrad)"
              activeDot={{ r: 6, fill: "#FF8A35", stroke: "#0D0A08", strokeWidth: 2.5 }}
            />
            <Area
              type="monotone"
              dataKey="conversions"
              name="Enrolled"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#heroEmeraldGrad)"
              activeDot={{ r: 4, fill: "#10B981", stroke: "#0D0A08", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Scrubber Timeline Bar (Liquid Glass timeline matching Reference) */}
      <div className="pt-2 px-1">
        <div className="relative h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden border border-white/[0.04]">
          <div className={`absolute top-0 bottom-0 left-[35%] right-[20%] bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] ${totalLeadsCount === 0 ? "opacity-30" : "opacity-100"}`} />
        </div>
        <div className="flex items-center justify-between pt-2.5 text-[11px] text-[#897B70] font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Inquiries Pipeline
            </span>
            <span className="flex items-center gap-1.5 text-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Confirmed Enrolments
            </span>
          </div>
          <span className="text-[10px] text-[#897B70] font-mono">
            {totalLeadsCount > 0 ? `${totalLeadsCount} Total Records` : "Live Sync Active"}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. ENROLMENTS BAR CHART (100% Real Database Queries & Liquid Glass)
// ─────────────────────────────────────────────────────────────────────────────
export function EnrolmentsBarChart() {
  const [mounted, setMounted] = React.useState(false)
  const [barData, setBarData] = React.useState<{ month: string; value: number; isHighlight: boolean }[]>([])
  const [totalEnrolments, setTotalEnrolments] = React.useState(0)

  React.useEffect(() => {
    setMounted(true)
    const supabase = createClient()

    async function loadMonthlyEnrolments() {
      const months: { [key: string]: { month: string; value: number; isHighlight: boolean } } = {}
      for (let i = 5; i >= 0; i--) {
        const d = subMonths(new Date(), i)
        const key = format(d, "MMM yyyy")
        const label = format(d, "MMM")
        months[key] = { month: label, value: 0, isHighlight: false }
      }

      try {
        // Query enrolled leads or students
        const { data: leads } = await supabase
          .from("leads")
          .select("created_at, status")

        let total = 0
        let maxVal = 0
        let maxKey = ""

        if (leads && leads.length > 0) {
          leads.forEach((row) => {
            if (!row.created_at) return
            const status = (row.status || "").toLowerCase()
            if (["enrolled", "completed", "offer_accepted"].includes(status)) {
              total++
              const date = new Date(row.created_at)
              const key = format(date, "MMM yyyy")
              if (months[key]) {
                months[key].value += 1
              }
            }
          })

          Object.entries(months).forEach(([k, m]) => {
            if (m.value > maxVal) {
              maxVal = m.value
              maxKey = k
            }
          })
          if (maxKey && months[maxKey]) {
            months[maxKey].isHighlight = true
          }
        }

        setTotalEnrolments(total)
        setBarData(Object.values(months))
      } catch (err) {
        console.error("Error loading enrolments bar chart:", err)
      }
    }

    loadMonthlyEnrolments()

    const channel = supabase
      .channel("enrolments-bar-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => loadMonthlyEnrolments()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (!mounted) {
    return <div className="h-[180px] w-full rounded-2xl bg-[#140E0A]/60 animate-pulse" />
  }

  return (
    <div className="w-full relative">
      {totalEnrolments === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="liquid-glass-pill px-3 py-1.5 rounded-xl border border-white/[0.08] text-[11px] text-[#897B70] shadow-md backdrop-blur-sm">
            0 Confirmed Enrolments Logged
          </div>
        </div>
      )}

      <div className={`h-[160px] w-full transition-opacity duration-300 ${totalEnrolments === 0 ? "opacity-35" : "opacity-100"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 12, right: 0, left: -25, bottom: 0 }}>
            <defs>
              {/* Vibrant glowing emerald bar for active peak */}
              <linearGradient id="emeraldActiveBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.04)" />
            <XAxis dataKey="month" stroke="#7E7065" fontSize={11} tickLine={false} axisLine={false} dy={6} />
            <YAxis stroke="#7E7065" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#16100B",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#F8F5F1",
                fontSize: "12px",
                padding: "8px 12px",
              }}
              formatter={(val: any) => [`${val} Students`, "Enrolments"]}
            />

            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              barSize={28}
            >
              {barData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isHighlight && entry.value > 0 ? "url(#emeraldActiveBar)" : "#221913"}
                  stroke={entry.isHighlight && entry.value > 0 ? "#34D399" : "rgba(255, 255, 255, 0.04)"}
                  strokeWidth={entry.isHighlight && entry.value > 0 ? 1 : 0.5}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// 3. Conversion Funnel (Preserved)
// ─────────────────────────────────────────────────────────────────────────────
export function ConversionFunnel() {
  const [stages, setStages] = React.useState([
    { label: "1. Website Inquiries", count: 0, percent: 0, color: "bg-primary" },
    { label: "2. Contacted", count: 0, percent: 0, color: "bg-amber-400" },
    { label: "3. 1-on-1 Counselling", count: 0, percent: 0, color: "bg-indigo-400" },
    { label: "4. Application Submitted", count: 0, percent: 0, color: "bg-blue-400" },
    { label: "5. University Offers", count: 0, percent: 0, color: "bg-teal-400" },
    { label: "6. Visa Processed", count: 0, percent: 0, color: "bg-violet-400" },
    { label: "7. Enrolled Students", count: 0, percent: 0, color: "bg-emerald-400" },
  ])
  const [totalLeads, setTotalLeads] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const supabase = createClient()

    async function loadFunnelData() {
      try {
        const { data: leads, error } = await supabase
          .from("leads")
          .select("id, status")

        if (error || !leads) {
          setLoading(false)
          return
        }

        const total = leads.length
        setTotalLeads(total)

        const isContacted = (s: string) => !["new", "lost"].includes(s.toLowerCase())
        const isCounselling = (s: string) =>
          ["counselling", "in_counselling", "appointment", "application", "application_submitted", "offer", "offer_received", "visa", "visa_processing", "visa_approved", "enrolled", "completed"].includes(s.toLowerCase())
        const isApplication = (s: string) =>
          ["application", "application_submitted", "offer", "offer_received", "visa", "visa_processing", "visa_approved", "enrolled", "completed"].includes(s.toLowerCase())
        const isOffer = (s: string) =>
          ["offer", "offer_received", "visa", "visa_processing", "visa_approved", "enrolled", "completed"].includes(s.toLowerCase())
        const isVisa = (s: string) =>
          ["visa", "visa_processing", "visa_approved", "enrolled", "completed"].includes(s.toLowerCase())
        const isEnrolled = (s: string) =>
          ["enrolled", "completed"].includes(s.toLowerCase())

        const contactedCount = leads.filter((l) => isContacted(l.status || "")).length
        const counsellingCount = leads.filter((l) => isCounselling(l.status || "")).length
        const appCount = leads.filter((l) => isApplication(l.status || "")).length
        const offerCount = leads.filter((l) => isOffer(l.status || "")).length
        const visaCount = leads.filter((l) => isVisa(l.status || "")).length
        const enrolledCount = leads.filter((l) => isEnrolled(l.status || "")).length

        const calcPercent = (count: number) => (total > 0 ? Math.round((count / total) * 100) : 0)

        setStages([
          { label: "1. Website Inquiries", count: total, percent: total > 0 ? 100 : 0, color: "bg-gradient-to-r from-orange-500 to-orange-400" },
          { label: "2. Contacted", count: contactedCount, percent: calcPercent(contactedCount), color: "bg-gradient-to-r from-amber-500 to-amber-400" },
          { label: "3. 1-on-1 Counselling", count: counsellingCount, percent: calcPercent(counsellingCount), color: "bg-gradient-to-r from-violet-500 to-violet-400" },
          { label: "4. Application Submitted", count: appCount, percent: calcPercent(appCount), color: "bg-gradient-to-r from-blue-500 to-blue-400" },
          { label: "5. University Offers", count: offerCount, percent: calcPercent(offerCount), color: "bg-gradient-to-r from-teal-500 to-teal-400" },
          { label: "6. Visa Processed", count: visaCount, percent: calcPercent(visaCount), color: "bg-gradient-to-r from-purple-500 to-purple-400" },
          { label: "7. Enrolled Students", count: enrolledCount, percent: calcPercent(enrolledCount), color: "bg-gradient-to-r from-emerald-500 to-emerald-400" },
        ])
      } catch (err) {
        console.error("Funnel load error:", err)
      } finally {
        setLoading(false)
      }
    }

    loadFunnelData()

    const channel = supabase
      .channel("conversion-funnel-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => loadFunnelData()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="space-y-3 pt-1">
      {stages.map((stage) => (
        <div key={stage.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#E8DED5] text-[11.5px] truncate pr-2">{stage.label}</span>
            <span className="font-semibold text-[#897B70] shrink-0 text-right">
              <span className="text-[#F8F5F1] font-mono">{stage.count}</span>{" "}
              <span className="text-[11px] opacity-80">({stage.percent}%)</span>
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden border border-white/[0.04]">
            <div
              className={`h-full rounded-full transition-all duration-700 ${stage.color}`}
              style={{ width: `${stage.percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
