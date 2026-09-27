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
  Send
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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

export function StudentDetailClient({ studentId }: { studentId: string }) {
  const initialStudent = INITIAL_STUDENTS.find(s => s.id === studentId) || INITIAL_STUDENTS[0]
  const [student, setStudent] = React.useState<Student>(initialStudent)
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
      author: "Hatim Patel (You)",
      role: "Super Admin",
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
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="rounded-xl hover:bg-muted/50 text-xs">
          <Link href="/students" className="flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back to Students
          </Link>
        </Button>
        <span className="text-muted-foreground/40">•</span>
        <span className="text-xs text-muted-foreground font-mono">{student.studentCode}</span>
      </div>

      {/* Header Profile Card */}
      <Card className="border-border/60 bg-card/85 backdrop-blur-xl shadow-lg">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start md:items-center gap-4">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-br from-emerald-500/25 to-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center font-bold text-xl md:text-2xl text-emerald-400 shrink-0 shadow-md">
                {student.avatar || student.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    {student.name}
                  </h1>
                  <StatusBadge status={student.status} />
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/30 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Visa: {student.visaStatus}
                  </span>
                </div>

                <p className="text-xs md:text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                  <span>Enrolled Course: <strong className="text-foreground">{student.course}</strong></span>
                  <span>•</span>
                  <span>{student.destination}</span>
                  <span>•</span>
                  <span>Intake: <strong className="text-primary">{student.intake}</strong></span>
                  <span>•</span>
                  <span>Counsellor: <strong className="text-foreground">{student.counsellor}</strong></span>
                </p>
              </div>
            </div>

            {/* Quick Contact & Info */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`tel:${student.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-muted/60 hover:bg-muted text-foreground border border-border/60 transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-blue-400" /> Call
              </a>
              <a
                href={`https://wa.me/${student.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
              <a
                href={`mailto:${student.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-muted/60 hover:bg-muted text-foreground border border-border/60 transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-amber-400" /> Email
              </a>
            </div>
          </div>

          {/* Document Completion Bar */}
          <div className="mt-6 pt-5 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Documents Verified:</span>
              <div className="flex-1 bg-muted/70 h-2.5 rounded-full overflow-hidden border border-border/40">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${student.documentProgress}%` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-400">{student.documentProgress}%</span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-muted-foreground">Paid: </span>
                <strong className="text-foreground">${student.totalPaid}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Due: </span>
                <strong className={student.balanceDue > 0 ? "text-amber-400 font-bold" : "text-emerald-400"}>
                  ${student.balanceDue}
                </strong>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="border-b border-border/50 flex items-center gap-1 overflow-x-auto custom-scrollbar pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs md:text-sm font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === tab.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
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
          <Card className="border-border/60 bg-card/75 backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" /> Personal & Identification
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-2 gap-4 text-xs md:text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase font-medium">Passport Number</p>
                <p className="font-semibold text-foreground mt-0.5 font-mono">{student.passportNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase font-medium">Date of Birth</p>
                <p className="font-medium text-foreground mt-0.5">{student.dob}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase font-medium">City & Country</p>
                <p className="font-medium text-foreground mt-0.5">{student.city}, {student.country}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase font-medium">Enrolled Since</p>
                <p className="font-medium text-foreground mt-0.5">{student.createdAt}</p>
              </div>
            </CardContent>
          </Card>

          {/* Academic Profile */}
          <Card className="border-border/60 bg-card/75 backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-emerald-400" /> Academic & English Scores
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-2 gap-4 text-xs md:text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase font-medium">Highest Qualification</p>
                <p className="font-medium text-foreground mt-0.5">{student.highestQualification}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase font-medium">Previous Institution</p>
                <p className="font-medium text-foreground mt-0.5">{student.institution}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase font-medium">Graduation Score</p>
                <p className="font-semibold text-emerald-400 mt-0.5">{student.gpaOrPercentage}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase font-medium">English Test Score</p>
                <p className="font-semibold text-primary mt-0.5">{student.englishTest}: {student.englishScore}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Applications */}
      {activeTab === "applications" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">University Applications ({studentApps.length})</h3>
            <Button size="sm" asChild className="bg-primary text-primary-foreground text-xs rounded-xl">
              <Link href="/applications">View All Applications</Link>
            </Button>
          </div>
          <div className="grid gap-3">
            {studentApps.map(app => (
              <Card key={app.id} className="border-border/60 bg-card/75 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-foreground">{app.university}</h4>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {app.course} • {app.country} • Intake: <strong className="text-foreground">{app.intake}</strong>
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      Ref: {app.applicationCode} • Tuition: {app.fees} • Deadline: {app.deadline}
                    </p>
                  </div>
                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-muted/70 text-foreground font-medium">
                      Offer: {app.offerStatus}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Deposit: {app.depositStatus}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Documents */}
      {activeTab === "documents" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Submitted Documents ({docs.length})</h3>
              <p className="text-xs text-muted-foreground">Review and verify required student paperwork.</p>
            </div>
          </div>
          <div className="grid gap-3">
            {docs.map(doc => (
              <Card key={doc.id} className="border-border/60 bg-card/75 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{doc.fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.category} • {doc.fileSize} • Uploaded {doc.uploadDate}
                      </p>
                      {doc.notes && <p className="text-[11px] text-primary/80 mt-0.5 italic">{doc.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={doc.status} />
                    {!doc.verified && (
                      <Button
                        size="sm"
                        onClick={() => handleVerifyDoc(doc.id)}
                        className="h-8 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
                      >
                        Verify & Approve
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Tasks */}
      {activeTab === "tasks" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <h3 className="text-base font-semibold text-foreground">Assigned Tasks & Follow-ups</h3>
          <div className="space-y-2">
            {tasks.map(t => (
              <Card key={t.id} className="border-border/60 bg-card/75 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTask(t.id)}
                      className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                        t.status === "Completed" ? "bg-emerald-500 border-emerald-500 text-white" : "border-border bg-muted/40"
                      }`}
                    >
                      {t.status === "Completed" && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                    <div>
                      <p className={`text-sm font-semibold ${t.status === "Completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {t.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Due: {new Date(t.dueDate).toLocaleDateString()} • Assigned: {t.assignedStaff}
                      </p>
                    </div>
                  </div>
                  <PriorityBadge priority={t.priority} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Appointments */}
      {activeTab === "appointments" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <h3 className="text-base font-semibold text-foreground">Counselling & Review Appointments</h3>
          <div className="grid gap-3">
            {studentAppts.map(apt => (
              <Card key={apt.id} className="border-border/60 bg-card/75 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{apt.type}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {apt.date} at {apt.time} ({apt.mode}) with {apt.counsellor}
                  </p>
                  <p className="text-[11px] text-muted-foreground italic mt-0.5">&ldquo;{apt.notes}&rdquo;</p>
                </div>
                <StatusBadge status={apt.status} />
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Notes */}
      {activeTab === "notes" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <form onSubmit={handleAddNote} className="space-y-2">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a private note on this student profile..."
              rows={3}
              className="w-full rounded-xl border border-border/60 bg-muted/30 p-3 text-xs text-foreground placeholder:text-muted-foreground outline-none"
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground text-xs rounded-xl">
                <Send className="h-3.5 w-3.5 mr-1" /> Post Note
              </Button>
            </div>
          </form>

          <div className="space-y-3 pt-2">
            {notes.map(n => (
              <Card key={n.id} className="border-border/60 bg-card/75 p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{n.author} ({n.role})</span>
                  <span className="text-[10px] text-muted-foreground">{n.timestamp}</span>
                </div>
                <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">{n.content}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Payments */}
      {activeTab === "payments" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <h3 className="text-base font-semibold text-foreground">Invoices & Payment Records</h3>
          <div className="grid gap-3">
            {studentPayments.map(p => (
              <Card key={p.id} className="border-border/60 bg-card/75 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{p.invoiceRef}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{p.service}</p>
                  <p className="text-xs text-muted-foreground">
                    Paid via {p.method} on {p.paymentDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-foreground">${p.amountPaid} / ${p.amount}</p>
                  {p.remaining > 0 && <p className="text-xs text-amber-400 font-semibold">${p.remaining} remaining</p>}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: Activity */}
      {activeTab === "activity" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <h3 className="text-base font-semibold text-foreground">Audit Activity History</h3>
          <div className="space-y-3">
            {INITIAL_ACTIVITY_LOGS.map(log => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-card/60 border border-border/40 text-xs">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-foreground">
                    <strong className="text-primary">{log.actor}</strong> {log.action} for <strong>{log.entity}</strong>
                  </p>
                  <span className="text-[10px] text-muted-foreground/70">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
