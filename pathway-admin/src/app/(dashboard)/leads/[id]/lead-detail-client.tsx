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
  UserPlus,
  Pin,
  Plus,
  MapPin,
  GraduationCap,
  Briefcase,
  Globe,
  FileText,
  DollarSign,
  Award,
  ChevronRight,
  Send,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { StatusBadge, PriorityBadge, LeadStatus } from "@/components/ui/status-badge"
import { INITIAL_LEADS, Lead } from "@/lib/mock-data"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

// Helper to map DB row to Lead interface
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbLeadToLead(row: any): Lead {
  const codeNum = row.id ? row.id.replace(/-/g, "").substring(0, 4).toUpperCase() : (row.phone ? row.phone.slice(-4) : "1001");
  const nameParts = (row.full_name || "Prospective Student").trim().split(" ");
  const firstName = nameParts[0] || "Prospective";
  const lastName = nameParts.slice(1).join(" ") || "Student";

  let sourceUI: Lead["leadSource"] = "Website";
  const rawSource = (row.lead_source || "").toLowerCase();
  if (rawSource.includes("whatsapp")) sourceUI = "WhatsApp";
  else if (rawSource.includes("instagram") || rawSource.includes("social")) sourceUI = "Instagram";
  else if (rawSource.includes("referral")) sourceUI = "Referral";
  else if (rawSource.includes("walk")) sourceUI = "Walk-in";
  else if (rawSource.includes("phone")) sourceUI = "Phone";
  else if (rawSource.includes("website") || rawSource.includes("google") || rawSource.includes("fair")) sourceUI = "Website";
  else sourceUI = "Other";

  let statusUI: Lead["status"] = "New";
  const rawStatus = (row.status || "").toLowerCase();
  if (rawStatus === "contacted") statusUI = "Contacted";
  else if (rawStatus === "lost") statusUI = "Lost";
  else if (rawStatus === "enrolled" || rawStatus === "converted") statusUI = "Converted to Student";
  else if (rawStatus === "interested") statusUI = "Interested";
  else statusUI = "New";

  const destMap: Record<string, string> = {
    "UK": "United Kingdom",
    "USA": "United States",
    "Canada": "Canada",
    "Australia": "Australia",
    "Germany": "Germany",
    "Ireland": "Ireland",
    "New Zealand": "New Zealand",
    "Dubai/UAE": "Dubai / UAE",
  };
  const destination = destMap[row.destination] || row.destination || "United Kingdom";

  return {
    id: row.id || `lead-live-${row.phone || "demo"}`,
    leadCode: `LD-${codeNum}`,
    firstName,
    lastName,
    name: row.full_name || `${firstName} ${lastName}`,
    email: row.email || "",
    phone: row.phone || "",
    preferredDestination: destination,
    course: row.course || "Higher Education",
    intake: row.intake || "Upcoming 2026",
    qualification: row.qualification || "Graduate",
    status: statusUI,
    priority: "High",
    leadSource: sourceUI,
    assignedCounsellor: "Owner",
    createdDate: row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    lastContacted: row.last_contacted_at ? new Date(row.last_contacted_at).toLocaleDateString() : "Pending first contact",
    nextFollowUp: row.next_followup_at ? new Date(row.next_followup_at).toLocaleDateString() : "To be scheduled",
    notesCount: row.message ? 1 : 0,
    message: row.message || "",
    notes: row.message || "Submitted via website consultation form",
  };
}

export function LeadDetailClient({ leadId }: { leadId: string }) {
  const router = useRouter()
  // Locate lead from mock store (or fallback to first)
  const initialLead = INITIAL_LEADS.find((l) => l.id === leadId) || INITIAL_LEADS[0]
  const [lead, setLead] = React.useState<Lead>(initialLead)

  // Fetch live lead if opened from Supabase or localStorage
  React.useEffect(() => {
    const supabase = createClient();
    async function loadLiveLead() {
      try {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .eq("id", leadId)
          .maybeSingle();

        if (data && !error) {
          const mapped = mapDbLeadToLead(data);
          setLead(mapped);
          if (data.message) {
            setNotes((prev) => [
              {
                id: "note-inquiry-msg",
                author: "Website Lead Form",
                role: "Inquiry Message",
                content: data.message,
                timestamp: mapped.createdDate,
                isPinned: true,
              },
              ...prev.filter((n) => n.id !== "note-inquiry-msg"),
            ]);
          }
          return;
        }

        // Check local storage fallback
        if (typeof window !== "undefined") {
          const local = JSON.parse(localStorage.getItem("pathway_local_leads") || "[]");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const foundLocal = local.find((l: any) => l.id === leadId);
          if (foundLocal) {
            setLead(mapDbLeadToLead(foundLocal));
          }
        }
      } catch (err) {
        console.debug("Lead fetch error:", err);
      }
    }

    loadLiveLead();
  }, [leadId]);

  // Timeline events
  const [timeline, setTimeline] = React.useState(
    lead.timeline || [
      {
        id: "tl-init",
        stage: "Inquiry received",
        title: "Inquiry Submitted via Website Form",
        description: `Student expressed interest in ${lead.course} for ${lead.preferredDestination}.`,
        timestamp: lead.createdDate ? new Date(lead.createdDate).toLocaleString() : "Recently",
        actor: "System",
        completed: true
      },
      {
        id: "tl-2",
        stage: "Counsellor contacted",
        title: "Assigned & Initial Outreach",
        description: `Routed to senior counsellor ${lead.assignedCounsellor}.`,
        timestamp: "Yesterday, 2:30 PM",
        actor: lead.assignedCounsellor,
        completed: true
      }
    ]
  )

  // Notes
  const [notes, setNotes] = React.useState(
    lead.notes || [
      {
        id: "note-1",
        author: lead.assignedCounsellor,
        role: "Counsellor",
        content: "Student has high academic standing. Interested in university scholarship options. Follow up with course brochure.",
        timestamp: "Yesterday, 3:15 PM",
        isPinned: true
      }
    ]
  )
  const [newNote, setNewNote] = React.useState("")
  const [newTimelineTitle, setNewTimelineTitle] = React.useState("")
  const [showAddTimelineModal, setShowAddTimelineModal] = React.useState(false)

  // Quick Status change
  const handleStatusChange = (newStatus: LeadStatus) => {
    setLead((prev) => ({ ...prev, status: newStatus }))
    toast.success(`Lead status updated to ${newStatus}`)
  }

  // Convert to student
  const handleConvertToStudent = () => {
    setLead((prev) => ({ ...prev, status: "Converted to Student" }))
    toast.success(`${lead.name} successfully converted to official Student record!`)
    setTimeout(() => {
      router.push("/students")
    }, 1000)
  }

  // Add Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return
    const noteObj = {
      id: "note-" + Date.now(),
      author: "Admin (You)",
      role: "Admin",
      content: newNote.trim(),
      timestamp: "Just now",
      isPinned: false
    }
    setNotes([noteObj, ...notes])
    setNewNote("")
    toast.success("Internal note added to lead profile")
  }

  // Pin / Unpin Note
  const handleTogglePin = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isPinned: !n.isPinned } : n))
    )
  }

  // Add Timeline Event
  const handleAddTimeline = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTimelineTitle.trim()) return
    const event = {
      id: "tl-" + Date.now(),
      stage: "Staff Update",
      title: newTimelineTitle.trim(),
      description: "Milestone logged manually by counselor.",
      timestamp: "Just now",
      actor: "Admin",
      completed: true
    }
    setTimeline([event, ...timeline])
    setNewTimelineTitle("")
    setShowAddTimelineModal(false)
    toast.success("Timeline milestone added")
  }

  const standardStages = [
    "Inquiry received",
    "Counsellor contacted",
    "Counselling completed",
    "Documents requested",
    "Application started",
    "Application submitted",
    "Offer received",
    "Visa process",
    "Enrolled"
  ]

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Top Navigation Back */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="rounded-xl hover:bg-muted/50 text-xs">
          <Link href="/leads" className="flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back to Leads
          </Link>
        </Button>
        <span className="text-muted-foreground/40">•</span>
        <span className="text-xs text-muted-foreground font-mono">{lead.leadCode}</span>
      </div>

      {/* Profile Header Banner */}
      <Card className="border-border/60 bg-card/85 backdrop-blur-xl shadow-lg overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Avatar & Basic Info */}
            <div className="flex items-start md:items-center gap-4">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/40 flex items-center justify-center font-bold text-xl md:text-2xl text-primary shrink-0 shadow-md">
                {lead.avatar || lead.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    {lead.name}
                  </h1>
                  <StatusBadge status={lead.status} />
                  <PriorityBadge priority={lead.priority} />
                </div>

                <p className="text-xs md:text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                  <span>Target: <strong className="text-foreground">{lead.course}</strong></span>
                  <span>•</span>
                  <span>{lead.preferredDestination}</span>
                  <span>•</span>
                  <span>Intake: <strong className="text-primary">{lead.intake}</strong></span>
                  <span>•</span>
                  <span>Assigned to <strong className="text-foreground">{lead.assignedCounsellor}</strong></span>
                </p>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`tel:${lead.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-muted/60 hover:bg-muted text-foreground border border-border/60 transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-blue-400" /> Call
              </a>
              <a
                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
              <a
                href={`mailto:${lead.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-muted/60 hover:bg-muted text-foreground border border-border/60 transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-amber-400" /> Email
              </a>

              {lead.status !== "Converted to Student" ? (
                <Button
                  onClick={handleConvertToStudent}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <UserPlus className="h-4 w-4" /> Convert to Student
                </Button>
              ) : (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Converted Student
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide on desktop): Information Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Personal Details */}
          <Card className="border-border/60 bg-card/75 backdrop-blur-md shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
                <Globe className="h-4 w-4 text-primary" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs md:text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Full Name</p>
                <p className="font-medium text-foreground mt-0.5">{lead.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Phone Number</p>
                <p className="font-medium text-foreground mt-0.5">{lead.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Email Address</p>
                <p className="font-medium text-foreground mt-0.5">{lead.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Date of Birth</p>
                <p className="font-medium text-foreground mt-0.5">{lead.dob || "May 14, 2003"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">City</p>
                <p className="font-medium text-foreground mt-0.5">{lead.city || "Mumbai"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Country of Origin</p>
                <p className="font-medium text-foreground mt-0.5">{lead.country || "India"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Academic & Education */}
          <Card className="border-border/60 bg-card/75 backdrop-blur-md shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
                <GraduationCap className="h-4 w-4 text-emerald-400" /> Academic Background
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs md:text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Highest Qualification</p>
                <p className="font-medium text-foreground mt-0.5">{lead.qualification}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Institution</p>
                <p className="font-medium text-foreground mt-0.5">{lead.institution || "Recognized State University"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">GPA / Percentage</p>
                <p className="font-medium text-emerald-400 font-semibold mt-0.5">{lead.gpaOrScore || "8.4 CGPA"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">English Proficiency Test</p>
                <p className="font-medium text-foreground mt-0.5">{lead.englishTest || "IELTS Academic"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Test Score</p>
                <p className="font-medium text-primary font-semibold mt-0.5">{lead.englishScore || "7.5 Overall"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Study Level</p>
                <p className="font-medium text-foreground mt-0.5">{lead.studyLevel || "Postgraduate (Masters)"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Study Preferences */}
          <Card className="border-border/60 bg-card/75 backdrop-blur-md shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
                <Briefcase className="h-4 w-4 text-blue-400" /> Study Abroad Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs md:text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Destination</p>
                <p className="font-medium text-foreground mt-0.5">{lead.preferredDestination}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Program / Major</p>
                <p className="font-medium text-foreground mt-0.5">{lead.course}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Target Intake</p>
                <p className="font-medium text-primary font-semibold mt-0.5">{lead.intake}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Annual Budget</p>
                <p className="font-medium text-foreground mt-0.5">{lead.budget || "£25,000 - £32,000/yr"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Lead Source</p>
                <p className="font-medium text-foreground mt-0.5">{lead.leadSource}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Next Follow-up Due</p>
                <p className="font-medium text-amber-400 mt-0.5">{lead.nextFollowUp}</p>
              </div>
            </CardContent>
            {lead.message && (
              <div className="mx-5 mb-5 p-3.5 rounded-xl bg-muted/40 border border-border/50 text-xs">
                <span className="font-semibold text-foreground">Initial Inquiry Note: </span>
                <span className="text-muted-foreground italic">&ldquo;{lead.message}&rdquo;</span>
              </div>
            )}
          </Card>

          {/* Section 4: Chronological Journey Timeline */}
          <Card className="border-border/60 bg-card/75 backdrop-blur-md shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
                  <Clock className="h-4 w-4 text-purple-400" /> Student Journey Pipeline & Timeline
                </CardTitle>
                <CardDescription className="text-xs">
                  Chronological progression from website inquiry to enrollment.
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddTimelineModal(true)}
                className="text-xs rounded-xl h-8 border-border"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Milestone
              </Button>
            </CardHeader>
            <CardContent className="p-5">
              {/* Visual Pipeline Bar */}
              <div className="pb-6 mb-6 border-b border-border/30 overflow-x-auto custom-scrollbar">
                <div className="flex items-center min-w-[650px] gap-2">
                  {standardStages.map((stage, i) => {
                    const isPassed =
                      lead.status === "Converted to Student" ||
                      (lead.status === "Application Started" && i <= 4) ||
                      (lead.status === "Counselling Completed" && i <= 2) ||
                      (lead.status === "Contacted" && i <= 1) ||
                      i === 0
                    return (
                      <div key={stage} className="flex items-center gap-2 flex-1">
                        <div
                          className={`flex items-center justify-center h-7 px-2.5 rounded-full text-[10px] font-semibold whitespace-nowrap border transition-all ${
                            isPassed
                              ? "bg-primary/20 text-primary border-primary/40"
                              : "bg-muted/40 text-muted-foreground/60 border-border/40"
                          }`}
                        >
                          {i + 1}. {stage}
                        </div>
                        {i < standardStages.length - 1 && (
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Chronological Timeline items */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
                {timeline.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-card border border-primary-foreground" />
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                        <span className="text-[11px] text-muted-foreground font-mono">{item.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
                      <p className="text-[10px] text-primary/80 mt-1 font-medium">Logged by: {item.actor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Internal Notes & Status Management */}
        <div className="space-y-6">
          {/* Status Change Selector */}
          <Card className="border-border/60 bg-card/75 backdrop-blur-md shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-semibold text-foreground">Update Lead Status</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                className="w-full h-10 rounded-xl border border-border/70 bg-muted/40 px-3 text-xs text-foreground font-semibold outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Counselling Scheduled">Counselling Scheduled</option>
                <option value="Counselling Completed">Counselling Completed</option>
                <option value="Interested">Interested</option>
                <option value="Application Started">Application Started</option>
                <option value="Converted to Student">Converted to Student</option>
                <option value="Not Interested">Not Interested</option>
                <option value="Lost">Lost</option>
              </select>

              <div className="text-[11px] text-muted-foreground pt-1">
                Moving this lead to &ldquo;Converted to Student&rdquo; will automatically generate an active student record.
              </div>
            </CardContent>
          </Card>

          {/* Internal Notes System */}
          <Card className="border-border/60 bg-card/75 backdrop-blur-md shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-primary" /> Counsellor Internal Notes
                </CardTitle>
                <CardDescription className="text-xs">
                  Private team notes. Pinned notes stay on top.
                </CardDescription>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-bold text-muted-foreground">
                {notes.length}
              </span>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add confidential discussion note or follow-up summary..."
                  rows={3}
                  className="w-full rounded-xl border border-border/60 bg-muted/30 p-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50"
                />
                <div className="flex justify-end">
                  <Button type="submit" size="sm" className="h-7 text-xs rounded-lg bg-primary text-primary-foreground">
                    <Send className="h-3 w-3 mr-1" /> Post Note
                  </Button>
                </div>
              </form>

              {/* Notes List */}
              <div className="space-y-3 pt-2">
                {notes
                  .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                  .map((note) => (
                    <div
                      key={note.id}
                      className={`p-3 rounded-xl border transition-all text-xs space-y-1.5 ${
                        note.isPinned
                          ? "bg-primary/10 border-primary/40 shadow-sm"
                          : "bg-muted/30 border-border/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-semibold text-foreground">
                          <span>{note.author}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">({note.role})</span>
                        </div>
                        <button
                          onClick={() => handleTogglePin(note.id)}
                          className={`p-1 rounded hover:bg-muted ${note.isPinned ? "text-primary" : "text-muted-foreground"}`}
                          title={note.isPinned ? "Unpin note" : "Pin note to top"}
                        >
                          <Pin className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                      <div className="text-[10px] text-muted-foreground/70">{note.timestamp}</div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Manual Timeline Event Modal */}
      {showAddTimelineModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border/70 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-foreground">Add Custom Timeline Milestone</h3>
            <p className="text-xs text-muted-foreground">
              Record a significant action, student meeting, or document submission.
            </p>
            <input
              type="text"
              value={newTimelineTitle}
              onChange={(e) => setNewTimelineTitle(e.target.value)}
              placeholder="e.g. Conducted mock visa interview with student"
              className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowAddTimelineModal(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddTimeline} className="bg-primary text-primary-foreground">
                Save Milestone
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
