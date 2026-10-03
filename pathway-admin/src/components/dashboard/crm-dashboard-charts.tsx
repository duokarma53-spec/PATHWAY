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

export function LeadTrendChart() {
  const [mounted, setMounted] = React.useState(false)
  const [trendData, setTrendData] = React.useState<{ month: string; leads: number; conversions: number }[]>([])

  React.useEffect(() => {
    setMounted(true)
    const supabase = createClient()

    async function loadMonthlyTrends() {
      // Build past 6 months slots
      const months: { [key: string]: { month: string; leads: number; conversions: number } } = {}
      for (let i = 5; i >= 0; i--) {
        const d = subMonths(new Date(), i)
        const key = format(d, "MMM yyyy")
        const label = format(d, "MMM")
        months[key] = { month: label, leads: 0, conversions: 0 }
      }

      const { data } = await supabase
        .from("leads")
        .select("created_at, status")

      if (data && data.length > 0) {
        data.forEach((row) => {
          if (!row.created_at) return
          const date = new Date(row.created_at)
          const key = format(date, "MMM yyyy")
          if (months[key]) {
            months[key].leads += 1
            if (["enrolled", "completed"].includes((row.status || "").toLowerCase())) {
              months[key].conversions += 1
            }
          }
        })
      }

      setTrendData(Object.values(months))
    }

    loadMonthlyTrends()

    // Supabase Realtime: update chart on any leads change
    const channel = supabase
      .channel("lead-trend-realtime")
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
    return <div className="h-[260px] w-full rounded-xl bg-linen/30 animate-pulse" />
  }

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E5C05D" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#E5C05D" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} dy={8} />
          <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#131B2E",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              color: "#F8FAFC",
              fontSize: "12px",
            }}
          />
          <Area type="monotone" dataKey="leads" name="Real Inquiries" stroke="#E5C05D" strokeWidth={2.5} fillOpacity={1} fill="url(#leadGrad)" />
          <Area type="monotone" dataKey="conversions" name="Enrolled Students" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#convGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function LeadsBySourceChart() {
  const [mounted, setMounted] = React.useState(false)
  const [sourceData, setSourceData] = React.useState<{ name: string; value: number; color: string }[]>([])

  React.useEffect(() => {
    setMounted(true)
    const supabase = createClient()

    async function loadSources() {
      const { data } = await supabase.from("leads").select("lead_source")
      const counts: Record<string, number> = {}
      const colors = ["#E5C05D", "#10B981", "#6366F1", "#3B82F6", "#EC4899", "#8B5CF6"]

      if (data && data.length > 0) {
        data.forEach((r) => {
          const s = r.lead_source || "Website Form"
          counts[s] = (counts[s] || 0) + 1
        })
        const total = data.length
        const mapped = Object.keys(counts).map((key, i) => ({
          name: key,
          value: Math.round((counts[key] / total) * 100),
          color: colors[i % colors.length],
        }))
        setSourceData(mapped)
      } else {
        setSourceData([])
      }
    }

    loadSources()
  }, [])

  if (!mounted) {
    return <div className="h-[240px] w-full rounded-xl bg-linen/30 animate-pulse" />
  }

  if (sourceData.length === 0) {
    return (
      <div className="h-[240px] flex items-center justify-center text-xs text-muted-foreground">
        No inquiry sources recorded yet. Real inquiry origins will display here.
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 h-[240px]">
      <div className="h-[200px] w-[200px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sourceData}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {sourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#131B2E",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#F8FAFC",
                fontSize: "12px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 flex-1 w-full text-xs">
        {sourceData.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground truncate">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
            <span className="font-bold text-foreground">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LeadsByDestinationChart() {
  const [mounted, setMounted] = React.useState(false)
  const [destinationData, setDestinationData] = React.useState<{ name: string; leads: number }[]>([])

  React.useEffect(() => {
    setMounted(true)
    const supabase = createClient()

    async function loadDestinations() {
      const { data } = await supabase.from("leads").select("destination")
      if (data && data.length > 0) {
        const counts: Record<string, number> = {}
        data.forEach((r) => {
          const d = r.destination || "General Inquiry"
          counts[d] = (counts[d] || 0) + 1
        })
        const mapped = Object.keys(counts).map((key) => ({
          name: key,
          leads: counts[key],
        }))
        setDestinationData(mapped)
      } else {
        setDestinationData([])
      }
    }

    loadDestinations()
  }, [])

  if (!mounted) {
    return <div className="h-[220px] w-full rounded-xl bg-linen/30 animate-pulse" />
  }

  if (destinationData.length === 0) {
    return (
      <div className="h-[220px] flex items-center justify-center text-xs text-muted-foreground">
        No country destination inquiries recorded yet.
      </div>
    )
  }

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={destinationData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} dy={6} />
          <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#131B2E",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#F8FAFC",
              fontSize: "12px"
            }}
          />
          <Bar dataKey="leads" name="Real Inquiries" fill="#E5C05D" radius={[6, 6, 0, 0]} barSize={26} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

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

        // Count real records by their live progression status
        const isContacted = (s: string) =>
          !["new", "lost"].includes(s.toLowerCase())
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
          { label: "1. Website Inquiries", count: total, percent: total > 0 ? 100 : 0, color: "bg-primary" },
          { label: "2. Contacted", count: contactedCount, percent: calcPercent(contactedCount), color: "bg-amber-400" },
          { label: "3. 1-on-1 Counselling", count: counsellingCount, percent: calcPercent(counsellingCount), color: "bg-indigo-400" },
          { label: "4. Application Submitted", count: appCount, percent: calcPercent(appCount), color: "bg-blue-400" },
          { label: "5. University Offers", count: offerCount, percent: calcPercent(offerCount), color: "bg-teal-400" },
          { label: "6. Visa Processed", count: visaCount, percent: calcPercent(visaCount), color: "bg-violet-400" },
          { label: "7. Enrolled Students", count: enrolledCount, percent: calcPercent(enrolledCount), color: "bg-emerald-400" },
        ])
      } catch (err) {
        console.error("Funnel load error:", err)
      } finally {
        setLoading(false)
      }
    }

    loadFunnelData()

    // Supabase Realtime: update funnel on any leads change (INSERT, UPDATE, DELETE)
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
    <div className="space-y-3 pt-2">
      {stages.map((stage) => (
        <div key={stage.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">{stage.label}</span>
            <span className="font-bold text-muted-foreground">
              {stage.count} ({stage.percent}%)
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted/40 overflow-hidden border border-border/20">
            <div
              className={`h-full rounded-full transition-all duration-700 ${stage.color}`}
              style={{ width: `${stage.percent}%` }}
            />
          </div>
        </div>
      ))}

      {totalLeads === 0 && !loading && (
        <p className="text-[11px] text-muted-foreground text-center pt-2">
          Live conversion pipeline active. As real student inquiries arrive, stages will advance automatically.
        </p>
      )}
    </div>
  )
}
