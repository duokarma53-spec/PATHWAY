"use client"

import * as React from "react"
import {
  Search,
  Filter,
  Download,
  GraduationCap,
  Calendar,
  FileText,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge, StudentStatus } from "@/components/ui/status-badge"
import { INITIAL_STUDENTS, Student } from "@/lib/mock-data"
import Link from "next/link"
import { toast } from "sonner"
import { CRMQuickActions } from "@/components/actions/crm-quick-actions"

export function StudentsClientView() {
  const [students, setStudents] = React.useState<Student[]>(INITIAL_STUDENTS)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("ALL")
  const [destFilter, setDestFilter] = React.useState("ALL")
  const [counsellorFilter, setCounsellorFilter] = React.useState("ALL")

  const filteredStudents = React.useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        search === "" ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(search.toLowerCase()) ||
        s.course.toLowerCase().includes(search.toLowerCase())

      const matchStatus = statusFilter === "ALL" || s.status === statusFilter
      const matchDest = destFilter === "ALL" || s.destination === destFilter
      const matchCounsellor = counsellorFilter === "ALL" || s.counsellor === counsellorFilter

      return matchSearch && matchStatus && matchDest && matchCounsellor
    })
  }, [students, search, statusFilter, destFilter, counsellorFilter])

  // Quick CSV Export
  const handleExportCSV = () => {
    const headers = ["Student ID", "Name", "Email", "Phone", "Destination", "Course", "Intake", "Counsellor", "Status", "Visa Status", "Docs %"]
    const rows = filteredStudents.map(s => [
      s.studentCode,
      `"${s.name}"`,
      s.email,
      s.phone,
      `"${s.destination}"`,
      `"${s.course}"`,
      s.intake,
      `"${s.counsellor}"`,
      s.status,
      s.visaStatus,
      `${s.documentProgress}%`
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `pathway_students_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Exported ${filteredStudents.length} student records`)
  }

  // Delete student
  const handleDeleteStudent = (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete student "${name}"?`)) {
      return;
    }
    setStudents((prev) => prev.filter((s) => s.id !== id));
    toast.success(`Student "${name}" deleted`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Student Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              {students.length} Enrolled Profiles
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Complete lifecycle tracking of converted students across applications, documentation, visa filing, and deposits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="rounded-xl border-border/70 hover:bg-muted/50 text-xs flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Export Roster
          </Button>
          <CRMQuickActions />
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="border-border/60 bg-card/75 backdrop-blur-md p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Active Pipeline</p>
          <p className="text-2xl font-bold text-foreground mt-1">{students.length}</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> 100% Verified profiles
          </p>
        </Card>
        <Card className="border-border/60 bg-card/75 backdrop-blur-md p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">In Visa Processing</p>
          <p className="text-2xl font-bold text-violet-400 mt-1">
            {students.filter(s => s.status === "Visa Processing" || s.visaStatus === "Lodged").length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Lodged at embassies</p>
        </Card>
        <Card className="border-border/60 bg-card/75 backdrop-blur-md p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Visa Approved</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {students.filter(s => s.status === "Visa Approved" || s.visaStatus === "Approved").length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Ready for departure</p>
        </Card>
        <Card className="border-border/60 bg-card/75 backdrop-blur-md p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Avg Document Completion</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {Math.round(students.reduce((acc, s) => acc + s.documentProgress, 0) / (students.length || 1))}%
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Compliance index</p>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="border-border/60 bg-card/75 backdrop-blur-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name, email, student code (e.g. STU-2041)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-muted/30 border-border/50 focus:bg-background text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground font-medium outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Prospect">Prospect</option>
                <option value="Counselling">Counselling</option>
                <option value="Application">Application</option>
                <option value="Offer Received">Offer Received</option>
                <option value="Deposit Paid">Deposit Paid</option>
                <option value="Visa Processing">Visa Processing</option>
                <option value="Visa Approved">Visa Approved</option>
                <option value="Enrolled">Enrolled</option>
              </select>

              <select
                value={destFilter}
                onChange={(e) => setDestFilter(e.target.value)}
                className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground font-medium outline-none"
              >
                <option value="ALL">All Destinations</option>
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

              {(search || statusFilter !== "ALL" || destFilter !== "ALL" || counsellorFilter !== "ALL") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch("")
                    setStatusFilter("ALL")
                    setDestFilter("ALL")
                    setCounsellorFilter("ALL")
                  }}
                  className="h-9 text-xs text-muted-foreground"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30 text-muted-foreground uppercase text-[11px] tracking-wider font-semibold">
                <th className="py-3 px-4">Student Profile</th>
                <th className="py-3 px-3">Destination & Program</th>
                <th className="py-3 px-3">Counsellor</th>
                <th className="py-3 px-3">Stage</th>
                <th className="py-3 px-3">Visa Status</th>
                <th className="py-3 px-3">Documents %</th>
                <th className="py-3 px-3">Apps</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    No student records found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="py-3.5 px-4 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-400 shrink-0">
                          {s.avatar || s.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <Link
                            href={`/students/${s.id}`}
                            className="font-semibold text-foreground hover:text-emerald-400 transition-colors block"
                          >
                            {s.name}
                          </Link>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-muted-foreground/80">{s.studentCode}</span>
                            <span>•</span>
                            <span>{s.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 min-w-[200px]">
                      <p className="font-medium text-foreground">{s.course}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {s.destination} • <span className="text-primary font-medium">{s.intake}</span>
                      </p>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="text-xs text-foreground font-medium">{s.counsellor}</span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <StatusBadge status={s.status} />
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md border ${
                        s.visaStatus === "Approved"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : s.visaStatus === "Lodged"
                          ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                          : "bg-muted/60 text-muted-foreground border-border/40"
                      }`}>
                        <ShieldCheck className="h-3 w-3" /> {s.visaStatus}
                      </span>
                    </td>

                    {/* Document Progress Bar */}
                    <td className="py-3.5 px-3 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted/60 h-2 rounded-full overflow-hidden border border-border/30">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              s.documentProgress === 100
                                ? "bg-emerald-400"
                                : s.documentProgress >= 60
                                ? "bg-primary"
                                : "bg-amber-400"
                            }`}
                            style={{ width: `${s.documentProgress}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-muted-foreground w-8 text-right">
                          {s.documentProgress}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-muted/70 text-xs font-semibold text-foreground">
                        {s.applicationsCount}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/${s.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                          title="WhatsApp Student"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                        <Button variant="ghost" size="sm" asChild className="h-8 px-2.5 text-xs rounded-lg hover:text-emerald-400">
                          <Link href={`/students/${s.id}`}>
                            View Profile
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteStudent(s.id, s.name)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
