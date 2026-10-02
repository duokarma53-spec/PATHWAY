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
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge, ApplicationStatus } from "@/components/ui/status-badge"
import { INITIAL_APPLICATIONS, Application } from "@/lib/mock-data"
import { toast } from "sonner"
import { CRMQuickActions } from "@/components/actions/crm-quick-actions"

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

export function ApplicationsClientView() {
  const [applications, setApplications] = React.useState<Application[]>(INITIAL_APPLICATIONS)
  const [viewMode, setViewMode] = React.useState<"kanban" | "table">("kanban")
  const [search, setSearch] = React.useState("")
  const [countryFilter, setCountryFilter] = React.useState("ALL")
  const [counsellorFilter, setCounsellorFilter] = React.useState("ALL")

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
    toast.success(`Application "${code}" deleted`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 min-w-0">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Application Pipeline & Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
              {applications.length} Submissions
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Visual admission pipeline tracking shortlisting, offer issuances, fee deposits, and visa filing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View mode toggle */}
          <div className="flex items-center rounded-xl bg-card border border-border/60 p-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "kanban"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Kanban className="h-3.5 w-3.5" /> Pipeline Board
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "table"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" /> Table View
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="rounded-xl border-border/70 hover:bg-muted/50 text-xs flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </Button>

          <CRMQuickActions />
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-border/60 bg-card/75 backdrop-blur-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter by university, student name, course or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-muted/30 border-border/50 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground font-medium outline-none"
              >
                <option value="ALL">All Countries</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>

              <select
                value={counsellorFilter}
                onChange={(e) => setCounsellorFilter(e.target.value)}
                className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground font-medium outline-none"
              >
                <option value="ALL">All Counsellors</option>
                <option value="Rohan Varma">Rohan Varma</option>
                <option value="Neha Sharma">Neha Sharma</option>
                <option value="Dev Patel">Dev Patel</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Mode 1: Interactive Kanban Board */}
      {viewMode === "kanban" ? (
        <div className="overflow-x-auto pb-6 custom-scrollbar -mx-4 px-4 md:-mx-8 md:px-8">
          <div className="flex gap-4 min-w-[1700px] items-start">
            {PIPELINE_COLUMNS.map((stage) => {
              const stageApps = filteredApps.filter((a) => a.status === stage)
              const count = stageApps.length

              return (
                <div
                  key={stage}
                  className="w-[280px] shrink-0 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md flex flex-col max-h-[75vh]"
                >
                  {/* Column Header */}
                  <div className="p-3.5 border-b border-border/40 flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground truncate">{stage}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground">
                      {count}
                    </span>
                  </div>

                  {/* Cards container */}
                  <div className="p-3 space-y-3 overflow-y-auto custom-scrollbar flex-1">
                    {stageApps.length === 0 ? (
                      <div className="py-8 text-center text-[11px] text-muted-foreground/60 border border-dashed border-border/30 rounded-xl">
                        No applications
                      </div>
                    ) : (
                      stageApps.map((app) => (
                        <div
                          key={app.id}
                          className="p-3.5 rounded-xl border border-border/60 bg-card hover:border-primary/40 shadow-sm transition-all space-y-2 group"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-bold text-foreground leading-tight">{app.university}</h4>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] font-mono text-muted-foreground">{app.applicationCode}</span>
                              <button
                                onClick={() => handleDeleteApplication(app.id, app.applicationCode)}
                                className="text-muted-foreground/60 hover:text-rose-500 transition-colors p-0.5"
                                title="Delete Application"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          <p className="text-[11px] text-primary font-medium truncate">{app.course}</p>

                          <div className="pt-1 border-t border-border/30 text-[11px] text-muted-foreground flex items-center justify-between">
                            <span className="font-semibold text-foreground truncate">{app.studentName}</span>
                            <span className="shrink-0">{app.country}</span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-muted-foreground/80">
                            <span>Intake: {app.intake}</span>
                            <span>{app.fees}</span>
                          </div>

                          {/* Stage shift buttons */}
                          <div className="pt-2 border-t border-border/30 flex items-center justify-between gap-1">
                            <button
                              onClick={() => handleMoveStage(app.id, "prev")}
                              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors disabled:opacity-20"
                              title="Move to previous stage"
                              disabled={PIPELINE_COLUMNS.indexOf(app.status) === 0}
                            >
                              <ArrowLeft className="h-3 w-3" />
                            </button>

                            <span className="text-[10px] text-muted-foreground font-medium truncate">
                              {app.counsellor}
                            </span>

                            <button
                              onClick={() => handleMoveStage(app.id, "next")}
                              className="p-1 rounded-lg text-primary hover:bg-primary/10 transition-colors disabled:opacity-20 flex items-center gap-0.5 text-[10px] font-semibold"
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
        <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30 text-muted-foreground uppercase text-[11px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Application</th>
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3">University</th>
                  <th className="py-3 px-3">Course & Intake</th>
                  <th className="py-3 px-3">Pipeline Status</th>
                  <th className="py-3 px-3">Offer Status</th>
                  <th className="py-3 px-3">Deposit</th>
                  <th className="py-3 px-3">Deadline</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-muted-foreground">
                      No application records found. Click &quot;New Application&quot; to submit an application.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-muted-foreground">
                        {app.applicationCode}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-foreground">
                      {app.studentName}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-foreground block">{app.university}</span>
                      <span className="text-[11px] text-muted-foreground">{app.country}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-medium text-foreground">{app.course}</p>
                      <p className="text-[11px] text-primary">{app.intake}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-xs bg-muted/60 text-foreground font-medium">
                        {app.offerStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={app.depositStatus === "Paid" ? "text-emerald-400 font-semibold" : "text-muted-foreground"}>
                        {app.depositStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-muted-foreground font-mono">
                      {app.deadline}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteApplication(app.id, app.applicationCode)}
                        className="p-1 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
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
        </Card>
      )}
    </div>
  )
}
