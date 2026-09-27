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

const LEAD_TREND_DATA = [
  { month: "Apr", leads: 45, conversions: 18 },
  { month: "May", leads: 62, conversions: 24 },
  { month: "Jun", leads: 78, conversions: 35 },
  { month: "Jul", leads: 95, conversions: 42 },
  { month: "Aug", leads: 120, conversions: 58 },
  { month: "Sep", leads: 142, conversions: 65 },
]

const SOURCE_DATA = [
  { name: "Website Form", value: 45, color: "#E5C05D" },
  { name: "WhatsApp Direct", value: 25, color: "#10B981" },
  { name: "Referrals", value: 15, color: "#6366F1" },
  { name: "Phone / Walk-in", value: 10, color: "#3B82F6" },
  { name: "Instagram Ads", value: 5, color: "#EC4899" },
]

const DESTINATION_DATA = [
  { name: "UK", leads: 52 },
  { name: "USA", leads: 38 },
  { name: "Canada", leads: 32 },
  { name: "Australia", leads: 26 },
  { name: "Germany", leads: 12 },
]

export function LeadTrendChart() {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={LEAD_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
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
          <Area type="monotone" dataKey="leads" name="Total Inquiries" stroke="#E5C05D" strokeWidth={2.5} fillOpacity={1} fill="url(#leadGrad)" />
          <Area type="monotone" dataKey="conversions" name="Enrolled Students" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#convGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function LeadsBySourceChart() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 h-[240px]">
      <div className="h-[200px] w-[200px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={SOURCE_DATA}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {SOURCE_DATA.map((entry, index) => (
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
        {SOURCE_DATA.map((item) => (
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
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={DESTINATION_DATA} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} dy={6} />
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
          <Bar dataKey="leads" name="Leads" fill="#E5C05D" radius={[6, 6, 0, 0]} barSize={26} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ConversionFunnel() {
  const funnelStages = [
    { label: "1. Website Inquiries", count: 180, percent: 100, color: "bg-primary" },
    { label: "2. Contacted", count: 144, percent: 80, color: "bg-amber-400" },
    { label: "3. 1-on-1 Counselling", count: 98, percent: 54, color: "bg-indigo-400" },
    { label: "4. Application Submitted", count: 68, percent: 38, color: "bg-blue-400" },
    { label: "5. University Offers", count: 48, percent: 27, color: "bg-teal-400" },
    { label: "6. Visa Processed", count: 36, percent: 20, color: "bg-violet-400" },
    { label: "7. Enrolled Students", count: 32, percent: 18, color: "bg-emerald-400" },
  ]

  return (
    <div className="space-y-3 pt-2">
      {funnelStages.map((stage) => (
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
    </div>
  )
}
