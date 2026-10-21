"use client"

import * as React from "react"
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Clock,
  UserCheck,
  FileText,
  DollarSign,
  GraduationCap,
  Globe,
  Upload,
  Plus,
  ShieldCheck,
  CheckSquare,
  AlertTriangle,
  Pin,
  ExternalLink,
  ChevronRight,
  Send,
  Trash2,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge"
import {
  INITIAL_STUDENTS,
  INITIAL_APPLICATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_TASKS,
  INITIAL_APPOINTMENTS,
  INITIAL_PAYMENTS,
  INITIAL_ACTIVITY_LOGS,
  Student,
  Application,
  StudentDocument,
  CRMTask,
  Appointment,
  PaymentRecord
} from "@/lib/mock-data"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const FALLBACK_EMPTY_STUDENT: Student = {
  id: "",
  studentCode: "STU-0000",
  name: "Student Profile",
  email: "",
  phone: "",
  dob: "",
  passportNumber: "",
  city: "",
  country: "",
  highestQualification: "",
  institution: "",
  gpaOrPercentage: "",
  englishTest: "",
  englishScore: "",
  destination: "",
  course: "",
  intake: "",
  counsellor: "Owner",
  status: "Enrolled",
  visaStatus: "Not Applied",
  enrollmentStatus: "Confirmed",
  documentProgress: 0,
  totalPaid: 0,
  balanceDue: 0,
  createdAt: new Date().toISOString().split("T")[0],
  applicationsCount: 0
};

export function StudentDetailClient({ studentId }: { studentId: string }) {
  const router = useRouter()
  const initialStudent = INITIAL_STUDENTS.find(s => s.id === studentId) || FALLBACK_EMPTY_STUDENT
  const [student, setStudent] = React.useState<Student>(initialStudent)

  const handleDeleteStudent = () => {
    if (!window.confirm(`Are you sure you want to delete student "${student.name}"?`)) {
      return
    }
    toast.success(`Student "${student.name}" deleted`)
    router.push("/students")
  }
  const [activeTab, setActiveTab] = React.useState<"overview" | "applications" | "documents" | "tasks" | "appointments" | "notes" | "payments" | "activity">("overview")

  // Sub-entity data
  const studentApps = INITIAL_APPLICATIONS.filter(a => a.studentId === student.id || a.studentName === student.name)
  const [docs, setDocs] = React.useState<StudentDocument[]>(
    INITIAL_DOCUMENTS.filter(d => d.studentId === student.id || d.studentName === student.name)
  )
  const [tasks, setTasks] = React.useState<CRMTask[]>(
    INITIAL_TASKS.filter(t => t.entityName.includes(student.name.split(" ")[0]))
  )
  const studentAppts = INITIAL_APPOINTMENTS.filter(a => a.studentName.includes(student.name.split(" ")[0]))
  const studentPayments = INITIAL_PAYMENTS.filter(p => p.studentId === student.id || p.studentName === student.name)

  // Notes state
  const [notes, setNotes] = React.useState([
    {
      id: "sn-1",
      author: student.counsellor,
      role: "Lead Counsellor",
      content: `Student submitted all original degree transcripts. IELTS score card verified online. Ready for visa filing as soon as CAS letter is issued.`,
      timestamp: "Yesterday, 4:00 PM",
      isPinned: true
    }
  ])
  const [newNote, setNewNote] = React.useState("")

  const handleVerifyDoc = (docId: string) => {
    setDocs(prev => prev.map(d => d.id === docId ? { ...d, verified: true, status: "Approved" } : d))
    toast.success("Document verified and approved")
  }

  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: t.status === "Completed" ? "Pending" : "Completed" } : t))
    toast.success("Task updated")
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return
    const noteObj = {
      id: "sn-" + Date.now(),
      author: "Admin (You)",
      role: "Admin",
      content: newNote.trim(),
      timestamp: "Just now",
      isPinned: false
    }
    setNotes([noteObj, ...notes])
    setNewNote("")
    toast.success("Internal note saved to student profile")
  }

  const tabs = [
    { id: "overview", label: "Overview", count: null },
    { id: "applications", label: "Applications", count: studentApps.length },
    { id: "documents", label: "Documents", count: docs.length },
    { id: "tasks", label: "Tasks", count: tasks.length },
    { id: "appointments", label: "Appointments", count: studentAppts.length },
    { id: "notes", label: "Notes", count: notes.length },
    { id: "payments", label: "Payments", count: studentPayments.length },
    { id: "activity", label: "Activity", count: null },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="rounded-xl bg-[#1D1510] hover:bg-[#271A12] text-[#F8F5F1] hover:text-[#FF6B00] border border-white/[0.08] text-xs h-8 px-3"
          >
            <Link href="/students" className="flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Students
            </Link>
          </Button>
          <span className="text-[#897B70]/50">•</span>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-[#271A12] text-[#FF8A35] border border-orange-500/20">
            {student.studentCode}
          </span>
          <span className="text-xs text-[#897B70] hidden sm:inline">
            Enrolled since {student.createdAt}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDeleteStudent}
          className="border-rose-500/25 bg-rose-500/5 text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 rounded-xl text-xs h-8 px-3 flex items-center gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete Student
        </Button>
      </div>

      {/* Header Profile Card: Warm Obsidian */}
      <div className="relative rounded-2xl bg-[#15100D]/90 border border-white/[0.08] p-6 md:p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/[0.06] via-transparent to-transparent pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-5">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-[#271A12] border-2 border-orange-500/30 flex items-center justify-center font-extrabold text-xl md:text-2xl text-[#FF8A35] shrink-0 shadow-lg shadow-orange-950/40">
              {student.avatar || student.name.slice(0, 2).toUpperCase()}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#F8F5F1]">
                  {student.name}
                </h1>
                <StatusBadge status={student.status} />
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Visa: {student.visaStatus}
                </span>
              </div>

              <p className="text-xs md:text-sm text-[#BDB0A4] flex flex-wrap items-center gap-2">
                <span>Enrolled: <strong className="text-[#F8F5F1]">{student.course}</strong></span>
                <span className="text-[#897B70]">•</span>
                <span className="inline-flex items-center gap-1 text-[#F8F5F1]">
                  <Globe className="h-3.5 w-3.5 text-orange-400" />
                  {student.destination}
                </span>
                <span className="text-[#897B70]">•</span>
                <span>Intake: <strong className="text-[#FF8A35]">{student.intake}</strong></span>
                <span className="text-[#897B70]">•</span>
                <span>Counsellor: <strong className="text-[#F8F5F1]">{student.counsellor}</strong></span>
              </p>
            </div>
          </div>

          {/* Quick Contact & Info */}
          <div className="flex flex-wrap items-center gap-2">
            {student.phone && (
              <>
                <a
                  href={`tel:${student.phone}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1D1510] hover:bg-[#271A12] text-[#F8F5F1] border border-white/[0.08] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-sky-400" /> Call
                </a>
                <a
                  href={`https://wa.me/${student.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
              </>
            )}
            {student.email && (
              <a
                href={`mailto:${student.email}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1D1510] hover:bg-[#271A12] text-[#F8F5F1] border border-white/[0.08] transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-amber-400" /> Email
              </a>
            )}
          </div>
        </div>

        {/* Document Completion Bar & Financials */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <span className="text-xs font-medium text-[#897B70] whitespace-nowrap">Documents Verified:</span>
            <div className="flex-1 bg-[#1D1510] h-2.5 rounded-full overflow-hidden border border-white/[0.08]">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${student.documentProgress}%` }}
              />
            </div>
            <span className="text-xs font-bold text-emerald-400 font-mono">{student.documentProgress}%</span>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <div>
              <span className="text-[#897B70]">Total Paid: </span>
              <strong className="text-[#F8F5F1]">₹{(student.totalPaid || 0).toLocaleString('en-IN')}</strong>
            </div>
            <div>
              <span className="text-[#897B70]">Balance Due: </span>
              <strong className={student.balanceDue > 0 ? "text-amber-400 font-bold" : "text-emerald-400"}>
                ₹{(student.balanceDue || 0).toLocaleString('en-IN')}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-white/[0.08] flex items-center gap-1 overflow-x-auto custom-scrollbar pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs md:text-sm font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "border-orange-500 text-[#FF8A35] bg-[#271A12]/40"
                : "border-transparent text-[#897B70] hover:text-[#F8F5F1] hover:bg-white/[0.02]"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.id
                  ? "bg-orange-500/20 text-[#FF8A35] border border-orange-500/30"
                  : "bg-[#1D1510] text-[#897B70]"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in-50 duration-200">
          {/* Personal Info */}
          <div className="rounded-2xl bg-[#15100D]/85 border border-white/[0.08] backdrop-blur-md shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F8F5F1] flex items-center gap-2">
                <Globe className="h-4 w-4 text-orange-400" /> Personal &amp; Identification
              </h3>
              <span className="text-[11px] text-[#897B70]">Passport &amp; Contact</span>
            </div>
            <div className="p-6 grid grid-cols-2 gap-5 text-xs md:text-sm">
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase font-semibold">Passport Number</p>
                <p className="font-semibold text-[#F8F5F1] font-mono">{student.passportNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase font-semibold">Date of Birth</p>
                <p className="font-medium text-[#F8F5F1]">{student.dob}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase font-semibold">City &amp; Country</p>
                <p className="font-medium text-[#F8F5F1]">{student.city}, {student.country}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase font-semibold">Enrolled Since</p>
                <p className="font-medium text-[#F8F5F1]">{student.createdAt}</p>
              </div>
            </div>
          </div>

          {/* Academic Profile */}
          <div className="rounded-2xl bg-[#15100D]/85 border border-white/[0.08] backdrop-blur-md shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F8F5F1] flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-emerald-400" /> Academic &amp; English Scores
              </h3>
              <span className="text-[11px] text-[#897B70]">Test Credentials</span>
            </div>
            <div className="p-6 grid grid-cols-2 gap-5 text-xs md:text-sm">
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase font-semibold">Highest Qualification</p>
                <p className="font-semibold text-[#F8F5F1]">{student.highestQualification}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase font-semibold">Previous Institution</p>
                <p className="font-medium text-[#F8F5F1]">{student.institution}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase font-semibold">Graduation Score</p>
                <p className="font-bold text-emerald-400">{student.gpaOrPercentage}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase font-semibold">English Test Score</p>
                <p className="font-bold text-[#FF8A35]">{student.englishTest}: {student.englishScore}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Applications */}
      {activeTab === "applications" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#F8F5F1]">University Applications ({studentApps.length})</h3>
            <Button size="sm" asChild className="bg-gradient-to-r from-[#FF6B00] to-[#FF8A35] text-white text-xs rounded-xl shadow-md">
              <Link href="/applications">View All Applications</Link>
            </Button>
          </div>
          <div className="grid gap-3">
            {studentApps.map(app => (
              <div key={app.id} className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-5 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-[#F8F5F1]">{app.university}</h4>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-xs text-[#BDB0A4]">
                      {app.course} • {app.country} • Intake: <strong className="text-orange-400">{app.intake}</strong>
                    </p>
                    <p className="text-[11px] text-[#897B70] font-mono">
                      Ref: {app.applicationCode} • Tuition: {app.fees} • Deadline: {app.deadline}
                    </p>
                  </div>
                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-[#1D1510] text-[#F8F5F1] font-medium border border-white/[0.08]">
                      Offer: {app.offerStatus}
                    </span>
                    <span className="text-[11px] text-[#897B70]">
                      Deposit: {app.depositStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Documents */}
      {activeTab === "documents" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#F8F5F1]">Submitted Documents ({docs.length})</h3>
              <p className="text-xs text-[#897B70]">Review and verify required student paperwork.</p>
            </div>
          </div>
          <div className="grid gap-3">
            {docs.map(doc => (
              <div key={doc.id} className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-4 shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#F8F5F1]">{doc.fileName}</p>
                      <p className="text-xs text-[#BDB0A4]">
                        {doc.category} • {doc.fileSize} • Uploaded {doc.uploadDate}
                      </p>
                      {doc.notes && <p className="text-[11px] text-orange-400 mt-0.5 italic">{doc.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={doc.status} />
                    {!doc.verified && (
                      <Button
                        size="sm"
                        onClick={() => handleVerifyDoc(doc.id)}
                        className="h-8 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md"
                      >
                        Verify &amp; Approve
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Tasks */}
      {activeTab === "tasks" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <h3 className="text-base font-bold text-[#F8F5F1]">Assigned Tasks &amp; Follow-ups</h3>
          <div className="space-y-2.5">
            {tasks.map(t => (
              <div key={t.id} className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-4 shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTask(t.id)}
                      className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                        t.status === "Completed" ? "bg-emerald-500 border-emerald-500 text-white" : "border-white/[0.2] bg-[#1D1510]"
                      }`}
                    >
                      {t.status === "Completed" && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                    <div>
                      <p className={`text-sm font-semibold ${t.status === "Completed" ? "line-through text-[#897B70]" : "text-[#F8F5F1]"}`}>
                        {t.title}
                      </p>
                      <p className="text-xs text-[#897B70] mt-0.5">
                        Due: {new Date(t.dueDate).toLocaleDateString()} • Assigned: {t.assignedStaff}
                      </p>
                    </div>
                  </div>
                  <PriorityBadge priority={t.priority} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Appointments */}
      {activeTab === "appointments" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <h3 className="text-base font-bold text-[#F8F5F1]">Counselling &amp; Review Appointments</h3>
          <div className="grid gap-3">
            {studentAppts.map(apt => (
              <div key={apt.id} className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-4 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#F8F5F1]">{apt.type}</p>
                  <p className="text-xs text-[#BDB0A4] mt-0.5">
                    {apt.date} at {apt.time} ({apt.mode}) with {apt.counsellor}
                  </p>
                  <p className="text-[11px] text-[#897B70] italic mt-0.5">&ldquo;{apt.notes}&rdquo;</p>
                </div>
                <StatusBadge status={apt.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Notes */}
      {activeTab === "notes" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <form onSubmit={handleAddNote} className="space-y-2.5">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a confidential note on this student profile..."
              rows={3}
              className="w-full rounded-xl border border-white/[0.1] bg-[#1D1510] p-3 text-xs text-[#F8F5F1] placeholder:text-[#897B70] outline-none focus:border-orange-500/50"
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" className="bg-gradient-to-r from-[#FF6B00] to-[#FF8A35] text-white text-xs rounded-xl shadow-md">
                <Send className="h-3.5 w-3.5 mr-1.5" /> Post Note
              </Button>
            </div>
          </form>

          <div className="space-y-3 pt-2">
            {notes.map(n => (
              <div key={n.id} className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-4 shadow-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F8F5F1]">{n.author} ({n.role})</span>
                  <span className="text-[10px] text-[#897B70]">{n.timestamp}</span>
                </div>
                <p className="text-xs text-[#BDB0A4] whitespace-pre-wrap leading-relaxed">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Payments */}
      {activeTab === "payments" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <h3 className="text-base font-bold text-[#F8F5F1]">Invoices &amp; Payment Records</h3>
          <div className="grid gap-3">
            {studentPayments.map(p => (
              <div key={p.id} className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-orange-400 font-semibold">{p.invoiceRef}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-sm font-bold text-[#F8F5F1]">{p.service}</p>
                  <p className="text-xs text-[#897B70]">
                    Paid via {p.method} on {p.paymentDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-[#F8F5F1]">₹{p.amountPaid.toLocaleString('en-IN')} / ₹{p.amount.toLocaleString('en-IN')}</p>
                  {p.remaining > 0 && <p className="text-xs text-amber-400 font-semibold">₹{p.remaining.toLocaleString('en-IN')} remaining</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: Activity */}
      {activeTab === "activity" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <h3 className="text-base font-bold text-[#F8F5F1]">Audit Activity History</h3>
          <div className="space-y-3">
            {INITIAL_ACTIVITY_LOGS.map(log => (
              <div key={log.id} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#15100D]/85 border border-white/[0.08] text-xs">
                <Clock className="h-4 w-4 text-[#897B70] mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-[#BDB0A4]">
                    <strong className="text-orange-400">{log.actor}</strong> {log.action} for <strong className="text-[#F8F5F1]">{log.entity}</strong>
                  </p>
                  <span className="text-[10px] text-[#897B70]">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
