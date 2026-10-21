"use client"

import * as React from "react"
import {
  Kanban,
  Table as TableIcon,
  Search,
  Filter,
  Plus,
  Landmark,
  GraduationCap,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Download,
  Building2,
  DollarSign,
  Trash2,
  Layers,
  ChevronRight,
  ChevronLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge, ApplicationStatus } from "@/components/ui/status-badge"
import { INITIAL_APPLICATIONS, Application } from "@/lib/mock-data"
import { toast } from "sonner"
import { CRMQuickActions } from "@/components/actions/crm-quick-actions"

const DELETED_APPS_KEY = "pathway_deleted_applications"

function getDeletedAppIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_APPS_KEY)
    if (raw) return new Set(JSON.parse(raw) as string[])
  } catch {}
  return new Set()
}

function persistDeletedAppId(id: string) {
  try {
    const existing = getDeletedAppIds()
    existing.add(id)
    localStorage.setItem(DELETED_APPS_KEY, JSON.stringify(Array.from(existing)))
  } catch {}
}

const PIPELINE_COLUMNS: ApplicationStatus[] = [
  "Shortlisted",
  "Documents Pending",
  "Ready to Apply",
  "Application Submitted",
  "Under Review",
  "Conditional Offer",
  "Unconditional Offer",
  "Deposit Pending",
  "Deposit Paid",
  "Visa Processing",
  "Completed"
]

const PIPELINE_PHASES = [
  { id: "ALL", label: "All 11 Stages", stages: PIPELINE_COLUMNS },
  { id: "PREP", label: "Preparation", stages: ["Shortlisted", "Documents Pending", "Ready to Apply"] as ApplicationStatus[] },
  { id: "REVIEW", label: "Review & Submission", stages: ["Application Submitted", "Under Review"] as ApplicationStatus[] },
  { id: "OFFERS", label: "Offer Decisions", stages: ["Conditional Offer", "Unconditional Offer"] as ApplicationStatus[] },
  { id: "ENROLLMENT", label: "Deposit & Visa", stages: ["Deposit Pending", "Deposit Paid", "Visa Processing", "Completed"] as ApplicationStatus[] },
]

export function ApplicationsClientView() {
  const [applications, setApplications] = React.useState<Application[]>(() => {
    if (typeof window === "undefined") return INITIAL_APPLICATIONS
    const deleted = getDeletedAppIds()
    return INITIAL_APPLICATIONS.filter((a) => !deleted.has(a.id))
  })
  const [viewMode, setViewMode] = React.useState<"kanban" | "table">("kanban")
  const [search, setSearch] = React.useState("")
  const [countryFilter, setCountryFilter] = React.useState("ALL")
  const [counsellorFilter, setCounsellorFilter] = React.useState("ALL")
  const [activePhase, setActivePhase] = React.useState("ALL")

  const filteredApps = React.useMemo(() => {
    return applications.filter((app) => {
      const matchSearch =
        search === "" ||
        app.university.toLowerCase().includes(search.toLowerCase()) ||
        app.studentName.toLowerCase().includes(search.toLowerCase()) ||
        app.course.toLowerCase().includes(search.toLowerCase()) ||
        app.applicationCode.toLowerCase().includes(search.toLowerCase())

      const matchCountry = countryFilter === "ALL" || app.country === countryFilter
      const matchCounsellor = counsellorFilter === "ALL" || app.counsellor === counsellorFilter

      return matchSearch && matchCountry && matchCounsellor
    })
  }, [applications, search, countryFilter, counsellorFilter])

  // Shift application stage forwards/backwards
  const handleMoveStage = (appId: string, direction: "next" | "prev") => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app
        const currentIndex = PIPELINE_COLUMNS.indexOf(app.status)
        if (currentIndex === -1) return app

        const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1
        if (newIndex < 0 || newIndex >= PIPELINE_COLUMNS.length) return app

        const newStatus = PIPELINE_COLUMNS[newIndex]
        toast.success(`Moved ${app.studentName}'s application to "${newStatus}"`)
        return { ...app, status: newStatus }
      })
    )
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Application Code", "Student", "University", "Country", "Course", "Intake", "Counsellor", "Status", "Offer Status", "Deposit Status", "Fees"]
    const rows = filteredApps.map(a => [
      a.applicationCode,
      `"${a.studentName}"`,
      `"${a.university}"`,
      `"${a.country}"`,
      `"${a.course}"`,
      a.intake,
      `"${a.counsellor}"`,
      a.status,
      a.offerStatus,
      a.depositStatus,
      `"${a.fees}"`
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `pathway_applications_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Exported ${filteredApps.length} applications`)
  }

  // Delete application
  const handleDeleteApplication = (id: string, code: string) => {
    if (!window.confirm(`Are you sure you want to delete application "${code}"?`)) {
      return;
    }
    setApplications((prev) => prev.filter((a) => a.id !== id));
    persistDeletedAppId(id);
    toast.success(`Application "${code}" deleted`);
  };

  const visibleColumns = React.useMemo(() => {
    const currentPhaseObj = PIPELINE_PHASES.find(p => p.id === activePhase)
    return currentPhaseObj ? currentPhaseObj.stages : PIPELINE_COLUMNS
  }, [activePhase])

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#F8F5F1]">
              Application Pipeline
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/15 text-[#FF8A35] text-xs font-bold border border-orange-500/30">
              {applications.length} Submissions Active
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#BDB0A4] mt-1">
            Complete 11-stage admissions pipeline tracking university offers, deposit payments, and visa clearances.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View mode toggle */}
          <div className="flex items-center rounded-xl bg-[#15100D] border border-white/[0.08] p-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "kanban"
                  ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8A35] text-white shadow-md shadow-orange-950/40"
                  : "text-[#897B70] hover:text-[#F8F5F1]"
              }`}
            >
              <Kanban className="h-3.5 w-3.5" /> Pipeline Board
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "table"
                  ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8A35] text-white shadow-md shadow-orange-950/40"
                  : "text-[#897B70] hover:text-[#F8F5F1]"
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" /> Table View
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="rounded-xl border-white/[0.08] bg-[#15100D] hover:bg-[#1D1510] text-[#F8F5F1] text-xs h-9 px-3.5 flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5 text-orange-400" /> Export CSV
          </Button>

          <CRMQuickActions />
        </div>
      </div>

      {/* Filter and Phase Navigation Toolbar */}
      <div className="rounded-2xl bg-[#15100D]/85 border border-white/[0.08] p-4 backdrop-blur-md shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#897B70]" />
            <input
              placeholder="Search by university, student name, course or code (e.g. APP-401)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 h-9 rounded-xl bg-[#1D1510] border border-white/[0.08] text-xs text-[#F8F5F1] placeholder:text-[#897B70] outline-none focus:border-orange-500/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="h-9 rounded-xl border border-white/[0.08] bg-[#1D1510] px-3 text-xs text-[#F8F5F1] font-medium outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#1D1510]">All Countries</option>
              <option value="United Kingdom" className="bg-[#1D1510]">United Kingdom</option>
              <option value="United States" className="bg-[#1D1510]">United States</option>
              <option value="Canada" className="bg-[#1D1510]">Canada</option>
              <option value="Australia" className="bg-[#1D1510]">Australia</option>
            </select>

            <select
              value={counsellorFilter}
              onChange={(e) => setCounsellorFilter(e.target.value)}
              className="h-9 rounded-xl border border-white/[0.08] bg-[#1D1510] px-3 text-xs text-[#F8F5F1] font-medium outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#1D1510]">All Counsellors</option>
              <option value="Rohan Varma" className="bg-[#1D1510]">Rohan Varma</option>
              <option value="Neha Sharma" className="bg-[#1D1510]">Neha Sharma</option>
              <option value="Dev Patel" className="bg-[#1D1510]">Dev Patel</option>
            </select>
          </div>
        </div>

        {/* Phase Focus Tabs for Kanban */}
        {viewMode === "kanban" && (
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#897B70] text-[11px] font-semibold mr-1 flex items-center gap-1">
                <Layers className="h-3 w-3 text-orange-400" /> Focus Phase:
              </span>
              {PIPELINE_PHASES.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(phase.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activePhase === phase.id
                      ? "bg-[#271A12] text-[#FF8A35] border border-orange-500/30"
                      : "text-[#897B70] hover:text-[#F8F5F1] hover:bg-white/[0.04]"
                  }`}
                >
                  {phase.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-[#897B70] hidden md:inline font-mono">
              Showing {visibleColumns.length} of 11 Columns
            </span>
          </div>
        )}
      </div>

      {/* View Mode 1: Interactive Kanban Board */}
      {viewMode === "kanban" ? (
        <div className="overflow-x-auto pb-6 custom-scrollbar -mx-4 px-4 md:-mx-8 md:px-8">
          <div className="flex gap-4 items-start">
            {visibleColumns.map((stage) => {
              const stageApps = filteredApps.filter((a) => a.status === stage)
              const count = stageApps.length

              return (
                <div
                  key={stage}
                  className="w-[280px] shrink-0 rounded-2xl border border-white/[0.08] bg-[#15100D]/90 backdrop-blur-md flex flex-col max-h-[75vh] shadow-xl overflow-hidden"
                >
                  {/* Column Header */}
                  <div className="p-3.5 border-b border-white/[0.08] bg-[#18120D] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F8F5F1] truncate">{stage}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#271A12] text-[#FF8A35] border border-orange-500/20">
                      {count}
                    </span>
                  </div>

                  {/* Cards container */}
                  <div className="p-3 space-y-3 overflow-y-auto custom-scrollbar flex-1 min-h-[140px]">
                    {stageApps.length === 0 ? (
                      <div className="py-8 text-center text-[11px] text-[#897B70]/70 border border-dashed border-white/[0.06] rounded-xl">
                        No submissions
                      </div>
                    ) : (
                      stageApps.map((app) => (
                        <div
                          key={app.id}
                          className="p-3.5 rounded-xl border border-white/[0.08] bg-[#1D1510] hover:border-orange-500/40 hover:bg-[#271A12]/80 shadow-md transition-all space-y-2 group"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <h4 className="text-xs font-bold text-[#F8F5F1] leading-tight group-hover:text-orange-400 transition-colors">
                              {app.university}
                            </h4>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-black/40 text-orange-400">
                                {app.applicationCode}
                              </span>
                              <button
                                onClick={() => handleDeleteApplication(app.id, app.applicationCode)}
                                className="text-[#897B70] hover:text-rose-400 transition-colors p-0.5"
                                title="Delete Application"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          <p className="text-[11px] text-[#FF8A35] font-medium truncate">{app.course}</p>

                          <div className="pt-1.5 border-t border-white/[0.06] text-[11px] text-[#BDB0A4] flex items-center justify-between">
                            <span className="font-semibold text-[#F8F5F1] truncate">{app.studentName}</span>
                            <span className="shrink-0 text-[10px] text-[#897B70]">{app.country}</span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-[#897B70]">
                            <span>Intake: <strong className="text-[#F8F5F1]">{app.intake}</strong></span>
                            <span>{app.fees}</span>
                          </div>

                          {/* Stage shift buttons */}
                          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-1">
                            <button
                              onClick={() => handleMoveStage(app.id, "prev")}
                              className="p-1 rounded-lg text-[#897B70] hover:text-[#F8F5F1] hover:bg-white/[0.06] transition-colors disabled:opacity-20"
                              title="Move to previous stage"
                              disabled={PIPELINE_COLUMNS.indexOf(app.status) === 0}
                            >
                              <ArrowLeft className="h-3 w-3" />
                            </button>

                            <span className="text-[10px] text-[#897B70] font-medium truncate">
                              {app.counsellor}
                            </span>

                            <button
                              onClick={() => handleMoveStage(app.id, "next")}
                              className="p-1 rounded-lg text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 transition-colors disabled:opacity-20 flex items-center gap-0.5 text-[10px] font-semibold"
                              title="Advance to next stage"
                              disabled={PIPELINE_COLUMNS.indexOf(app.status) === PIPELINE_COLUMNS.length - 1}
                            >
                              <span>Next</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* View Mode 2: Table View */
        <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 backdrop-blur-md shadow-xl overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#18120D] text-[#897B70] uppercase text-[11px] tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Application</th>
                  <th className="py-3.5 px-3">Student</th>
                  <th className="py-3.5 px-3">University</th>
                  <th className="py-3.5 px-3">Course &amp; Intake</th>
                  <th className="py-3.5 px-3">Pipeline Status</th>
                  <th className="py-3.5 px-3">Offer Status</th>
                  <th className="py-3.5 px-3">Deposit</th>
                  <th className="py-3.5 px-3">Deadline</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-[#897B70]">
                      No application records found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-orange-400">
                        {app.applicationCode}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-[#F8F5F1]">
                        {app.studentName}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-[#F8F5F1] block">{app.university}</span>
                        <span className="text-[11px] text-[#897B70]">{app.country}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="font-medium text-[#F8F5F1]">{app.course}</p>
                        <p className="text-[11px] text-orange-400 font-semibold">{app.intake}</p>
                      </td>
                      <td className="py-3.5 px-3">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded text-xs bg-[#1D1510] text-[#BDB0A4] font-medium border border-white/[0.08]">
                          {app.offerStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={app.depositStatus === "Paid" ? "text-emerald-400 font-semibold" : "text-[#897B70]"}>
                          {app.depositStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-[#897B70] font-mono">
                        {app.deadline}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteApplication(app.id, app.applicationCode)}
                          className="p-1 rounded-lg text-[#897B70] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
