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
  Trash2,
  Globe,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge, StudentStatus } from "@/components/ui/status-badge"
import { INITIAL_STUDENTS, Student } from "@/lib/mock-data"
import Link from "next/link"
import { toast } from "sonner"
import { CRMQuickActions } from "@/components/actions/crm-quick-actions"

const DELETED_STUDENTS_KEY = "pathway_deleted_students"

function getDeletedStudentIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_STUDENTS_KEY)
    if (raw) return new Set(JSON.parse(raw) as string[])
  } catch {}
  return new Set()
}

function persistDeletedStudentId(id: string) {
  try {
    const existing = getDeletedStudentIds()
    existing.add(id)
    localStorage.setItem(DELETED_STUDENTS_KEY, JSON.stringify(Array.from(existing)))
  } catch {}
}

export function StudentsClientView() {
  const [students, setStudents] = React.useState<Student[]>(() => {
    if (typeof window === "undefined") return INITIAL_STUDENTS
    const deleted = getDeletedStudentIds()
    return INITIAL_STUDENTS.filter((s) => !deleted.has(s.id))
  })
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
    persistDeletedStudentId(id);
    toast.success(`Student "${name}" deleted`);
  };

  const avgDocs = Math.round(students.reduce((acc, s) => acc + s.documentProgress, 0) / (students.length || 1))

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#F8F5F1]">
              Student Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/15 text-[#FF8A35] text-xs font-bold border border-orange-500/30">
              {students.length} Enrolled Profiles
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#BDB0A4] mt-1">
            Complete lifecycle tracking of enrolled students across admissions, documentation, visa filing, and deposits.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="rounded-xl border-white/[0.08] bg-[#15100D] hover:bg-[#1D1510] text-[#F8F5F1] text-xs h-9 px-3.5 flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5 text-orange-400" /> Export Roster
          </Button>
          <CRMQuickActions />
        </div>
      </div>

      {/* Quick Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/80 p-4 backdrop-blur-md">
          <p className="text-[11px] text-[#897B70] uppercase font-semibold">Active Roster</p>
          <p className="text-2xl font-bold text-[#F8F5F1] mt-1">{students.length}</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> 100% Verified records
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/80 p-4 backdrop-blur-md">
          <p className="text-[11px] text-[#897B70] uppercase font-semibold">In Visa Processing</p>
          <p className="text-2xl font-bold text-sky-400 mt-1">
            {students.filter(s => s.status === "Visa Processing" || s.visaStatus === "Lodged").length}
          </p>
          <p className="text-[11px] text-[#897B70] mt-1">Lodged at embassies</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/80 p-4 backdrop-blur-md">
          <p className="text-[11px] text-[#897B70] uppercase font-semibold">Visa Approved</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {students.filter(s => s.status === "Visa Approved" || s.visaStatus === "Approved").length}
          </p>
          <p className="text-[11px] text-[#897B70] mt-1">Ready for departure</p>
        </div>

        <div className="rounded-2xl border border-orange-500/25 bg-orange-500/[0.07] p-4 backdrop-blur-md">
          <p className="text-[11px] text-[#FF8A35] uppercase font-semibold">Avg Document Index</p>
          <p className="text-2xl font-bold text-[#FF8A35] mt-1">{avgDocs}%</p>
          <p className="text-[11px] text-orange-400/80 mt-1">Compliance index</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-4 backdrop-blur-md shadow-xl">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#897B70]" />
            <input
              placeholder="Search students by name, email, student code (e.g. STU-2041)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 h-9 rounded-xl bg-[#1D1510] border border-white/[0.08] text-xs text-[#F8F5F1] placeholder:text-[#897B70] outline-none focus:border-orange-500/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-xl border border-white/[0.08] bg-[#1D1510] px-3 text-xs text-[#F8F5F1] font-medium outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#1D1510]">All Statuses</option>
              <option value="Prospect" className="bg-[#1D1510]">Prospect</option>
              <option value="Counselling" className="bg-[#1D1510]">Counselling</option>
              <option value="Application" className="bg-[#1D1510]">Application</option>
              <option value="Offer Received" className="bg-[#1D1510]">Offer Received</option>
              <option value="Deposit Paid" className="bg-[#1D1510]">Deposit Paid</option>
              <option value="Visa Processing" className="bg-[#1D1510]">Visa Processing</option>
              <option value="Visa Approved" className="bg-[#1D1510]">Visa Approved</option>
              <option value="Enrolled" className="bg-[#1D1510]">Enrolled</option>
            </select>

            <select
              value={destFilter}
              onChange={(e) => setDestFilter(e.target.value)}
              className="h-9 rounded-xl border border-white/[0.08] bg-[#1D1510] px-3 text-xs text-[#F8F5F1] font-medium outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#1D1510]">All Destinations</option>
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
                className="h-9 text-xs text-[#897B70] hover:text-[#F8F5F1]"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Students High-Density Data Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 backdrop-blur-md shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#18120D] text-[#897B70] uppercase text-[11px] tracking-wider font-semibold">
                <th className="py-3.5 px-4">Student Profile</th>
                <th className="py-3.5 px-3">Destination &amp; Program</th>
                <th className="py-3.5 px-3">Counsellor</th>
                <th className="py-3.5 px-3">Stage</th>
                <th className="py-3.5 px-3">Visa Status</th>
                <th className="py-3.5 px-3">Documents %</th>
                <th className="py-3.5 px-3">Apps</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#897B70]">
                    No student records found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3.5 px-4 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-[#271A12] border border-orange-500/30 flex items-center justify-center font-bold text-xs text-[#FF8A35] shrink-0">
                          {s.avatar || s.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <Link
                            href={`/students/${s.id}`}
                            className="font-bold text-[#F8F5F1] hover:text-[#FF6B00] transition-colors block"
                          >
                            {s.name}
                          </Link>
                          <div className="text-[11px] text-[#897B70] flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-orange-400/90">{s.studentCode}</span>
                            <span>•</span>
                            <span className="font-mono">{s.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 min-w-[200px]">
                      <p className="font-medium text-[#F8F5F1]">{s.course}</p>
                      <p className="text-[11px] text-[#897B70] mt-0.5 flex items-center gap-1">
                        <Globe className="h-3 w-3 text-orange-400" />
                        <span>{s.destination}</span>
                        <span>•</span>
                        <span className="text-[#FF8A35] font-semibold">{s.intake}</span>
                      </p>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="text-xs text-[#F8F5F1] font-medium">{s.counsellor}</span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <StatusBadge status={s.status} />
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md border ${
                        s.visaStatus === "Approved"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : s.visaStatus === "Lodged"
                          ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
                          : "bg-[#1D1510] text-[#897B70] border-white/[0.08]"
                      }`}>
                        <ShieldCheck className="h-3 w-3" /> {s.visaStatus}
                      </span>
                    </td>

                    {/* Document Progress Bar */}
                    <td className="py-3.5 px-3 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#1D1510] h-2 rounded-full overflow-hidden border border-white/[0.08]">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              s.documentProgress === 100
                                ? "bg-emerald-400"
                                : s.documentProgress >= 60
                                ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8A35]"
                                : "bg-amber-400"
                            }`}
                            style={{ width: `${s.documentProgress}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-[#897B70] w-8 text-right font-mono">
                          {s.documentProgress}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-[#1D1510] text-xs font-semibold text-[#F8F5F1] border border-white/[0.08]">
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
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 px-2.5 text-xs text-[#BDB0A4] rounded-lg hover:text-[#FF6B00] hover:bg-white/[0.04]"
                        >
                          <Link href={`/students/${s.id}`}>
                            View Profile
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteStudent(s.id, s.name)}
                          className="h-8 w-8 p-0 text-[#897B70] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
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
      </div>
    </div>
  )
}
