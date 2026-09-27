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

const COUNSELLOR_PERF = [
  { name: "Rohan Varma", leads: 42, converted: 18, conversionRate: "42.8%", revenue: "$36,000" },
  { name: "Neha Sharma", leads: 38, converted: 14, conversionRate: "36.8%", revenue: "$28,500" },
  { name: "Dev Patel", leads: 31, converted: 12, conversionRate: "38.7%", revenue: "$24,000" },
  { name: "Hatim Patel", leads: 22, converted: 11, conversionRate: "50.0%", revenue: "$22,000" },
]

const MONTHLY_REVENUE = [
  { month: "Apr", revenue: 14000, target: 12000 },
  { month: "May", revenue: 19500, target: 15000 },
  { month: "Jun", revenue: 24000, target: 20000 },
  { month: "Jul", revenue: 28500, target: 25000 },
  { month: "Aug", revenue: 34000, target: 30000 },
  { month: "Sep", revenue: 39500, target: 35000 },
]

export function ReportsClientView() {
  const [dateRange, setDateRange] = React.useState("This Month")

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
          <p className="text-2xl font-bold text-emerald-400 mt-1">39.2%</p>
          <p className="text-[11px] text-muted-foreground mt-1">+4.8% vs last quarter</p>
        </Card>
        <Card className="border-border/60 bg-card/75 p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">University Offer Ratio</p>
          <p className="text-2xl font-bold text-primary mt-1">74.5%</p>
          <p className="text-[11px] text-muted-foreground mt-1">From total submissions</p>
        </Card>
        <Card className="border-border/60 bg-card/75 p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Visa Success Rate</p>
          <p className="text-2xl font-bold text-violet-400 mt-1">98.2%</p>
          <p className="text-[11px] text-muted-foreground mt-1">UK, USA, CA & AU</p>
        </Card>
        <Card className="border-border/60 bg-card/75 p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Net Billed</p>
          <p className="text-2xl font-bold text-foreground mt-1">$110,500</p>
          <p className="text-[11px] text-emerald-400 mt-1">On track for fiscal targets</p>
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_REVENUE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              {COUNSELLOR_PERF.map((c) => (
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
