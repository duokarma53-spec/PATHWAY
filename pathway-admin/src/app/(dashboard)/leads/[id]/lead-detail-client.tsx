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
  Trash2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  UserCheck
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

  // Parse structured notes/metadata if available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let meta: Record<string, any> = {};
  if (row.notes) {
    try {
      if (typeof row.notes === "string" && row.notes.trim().startsWith("{")) {
        meta = JSON.parse(row.notes);
      }
    } catch (e) {
      // not JSON
    }
  }

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
  const destination = destMap[row.destination] || row.destination || "Not specified";

  return {
    id: row.id || `lead-live-${row.phone || "demo"}`,
    leadCode: `LD-${codeNum}`,
    firstName,
    lastName,
    name: row.full_name || `${firstName} ${lastName}`,
    email: row.email || "Not specified",
    phone: row.phone || "Not specified",
    dob: meta.dob || row.dob || "",
    city: row.city || meta.city || "",
    country: row.country || "India",
    preferredDestination: destination,
    course: row.course || meta.course || "General Counselling",
    intake: row.intake || meta.intake || "Upcoming Intake",
    qualification: row.qualification || meta.qualification || "Not specified",
    institution: meta.institution || "",
    gpaOrScore: row.grade || meta.grade || "",
    englishTest: meta.english_test || "",
    englishScore: meta.english_score || "",
    studyLevel: meta.study_level || "",
    budget: meta.budget || "",
    status: statusUI,
    priority: "High",
    leadSource: sourceUI,
    assignedCounsellor: "Owner",
    createdDate: row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    lastContacted: row.last_contacted_at ? new Date(row.last_contacted_at).toISOString().split("T")[0] : "Pending first contact",
    nextFollowUp: row.next_followup_at ? new Date(row.next_followup_at).toISOString().split("T")[0] : "To be scheduled",
    notesCount: row.message ? 1 : 0,
    message: row.message || "",
    notes: row.notes || row.message || "",
  };
}

const FALLBACK_EMPTY_LEAD: Lead = {
  id: "",
  leadCode: "LD-0000",
  firstName: "Lead",
  lastName: "Profile",
  name: "Lead Profile",
  email: "Not specified",
  phone: "Not specified",
  preferredDestination: "Not selected",
  course: "General Counseling",
  intake: "Upcoming",
  qualification: "Not specified",
  leadSource: "Website",
  assignedCounsellor: "Owner",
  status: "New",
  priority: "Medium",
  createdDate: new Date().toISOString().split("T")[0],
  lastContacted: "Not yet",
  nextFollowUp: "To be scheduled",
  notesCount: 0,
};

export function LeadDetailClient({ leadId }: { leadId: string }) {
  const router = useRouter()
  // Locate lead from store (or fallback)
  const initialLead = INITIAL_LEADS.find((l) => l.id === leadId) || FALLBACK_EMPTY_LEAD
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
        timestamp: lead.createdDate ? new Date(lead.createdDate).toLocaleDateString() : "Recently",
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

  // Notes — start empty; only real data from Supabase or user input
  const [notes, setNotes] = React.useState<{
    id: string;
    author: string;
    role: string;
    content: string;
    timestamp: string;
    isPinned: boolean;
  }[]>([])
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

  const handleDeleteLead = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete lead "${lead.name}"?`)) {
      return
    }

    // Always clean localStorage first to prevent stale data from re-appearing
    try {
      const local = JSON.parse(localStorage.getItem("pathway_local_leads") || "[]")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filtered = local.filter((l: any) => l.id !== lead.id)
      localStorage.setItem("pathway_local_leads", JSON.stringify(filtered))
    } catch (e) {}

    try {
      const supabase = createClient()
      const { error } = await supabase.from("leads").delete().eq("id", lead.id)
      if (error) {
        console.error("Supabase delete error:", error)
        toast.error(`Failed to delete lead: ${error.message}`)
        return
      }
      toast.success(`Lead "${lead.name}" deleted`)
      router.push("/leads")
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete lead")
    }
  }

  // Pin / Unpin Note
  const handleTogglePin = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isPinned: !n.isPinned } : n))
    )
  }

  // Delete Note
  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId))
    toast.success("Note deleted")
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="rounded-xl bg-[#1D1510] hover:bg-[#271A12] text-[#F8F5F1] hover:text-[#FF6B00] border border-white/[0.08] text-xs h-8 px-3"
          >
            <Link href="/leads" className="flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Leads
            </Link>
          </Button>
          <span className="text-[#897B70]/50">•</span>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-[#271A12] text-[#FF8A35] border border-orange-500/20">
            {lead.leadCode}
          </span>
          <span className="text-xs text-[#897B70] hidden sm:inline">
            Created on {lead.createdDate}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteLead}
            className="border-rose-500/25 bg-rose-500/5 text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 rounded-xl text-xs h-8 px-3 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete Lead
          </Button>
        </div>
      </div>

      {/* Profile Header Banner: Warm Obsidian with Amber Accent */}
      <div className="relative rounded-2xl bg-[#15100D]/90 border border-white/[0.08] p-6 md:p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/[0.07] via-transparent to-transparent pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Avatar & Identity */}
          <div className="flex items-start md:items-center gap-5">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-[#271A12] border-2 border-orange-500/30 flex items-center justify-center font-extrabold text-xl md:text-2xl text-[#FF8A35] shrink-0 shadow-lg shadow-orange-950/40">
              {lead.avatar || lead.name.slice(0, 2).toUpperCase()}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#F8F5F1]">
                  {lead.name}
                </h1>
                <StatusBadge status={lead.status} />
                <PriorityBadge priority={lead.priority} />
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.05] text-[#BDB0A4] border border-white/[0.08]">
                  Source: {lead.leadSource}
                </span>
              </div>

              <div className="text-xs md:text-sm text-[#BDB0A4] flex flex-wrap items-center gap-2">
                <span>Target: <strong className="text-[#F8F5F1] font-semibold">{lead.course}</strong></span>
                <span className="text-[#897B70]">•</span>
                <span className="inline-flex items-center gap-1 text-[#F8F5F1]">
                  <Globe className="h-3.5 w-3.5 text-orange-400" />
                  {lead.preferredDestination}
                </span>
                <span className="text-[#897B70]">•</span>
                <span>Intake: <strong className="text-[#FF8A35] font-semibold">{lead.intake}</strong></span>
                <span className="text-[#897B70]">•</span>
                <span>Assigned: <strong className="text-[#F8F5F1]">{lead.assignedCounsellor}</strong></span>
              </div>
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
            {lead.phone && lead.phone !== "Not specified" && (
              <>
                <a
                  href={`tel:${lead.phone}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1D1510] hover:bg-[#271A12] text-[#F8F5F1] border border-white/[0.08] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-sky-400" /> Call
                </a>
                <a
                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
              </>
            )}

            {lead.email && lead.email !== "Not specified" && (
              <a
                href={`mailto:${lead.email}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1D1510] hover:bg-[#271A12] text-[#F8F5F1] border border-white/[0.08] transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-amber-400" /> Email
              </a>
            )}

            {lead.status !== "Converted to Student" ? (
              <Button
                onClick={handleConvertToStudent}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 h-9 px-4"
              >
                <UserPlus className="h-4 w-4" /> Convert to Student
              </Button>
            ) : (
              <span className="px-3.5 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Converted Student
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide on desktop): Information Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Personal Details */}
          <div className="rounded-2xl bg-[#15100D]/80 border border-white/[0.08] backdrop-blur-md shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                  <Globe className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-[#F8F5F1]">Personal Information</h3>
              </div>
              <span className="text-[11px] text-[#897B70]">Candidate Demographics</span>
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-5 text-xs md:text-sm">
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase tracking-wider font-semibold">Full Name</p>
                <p className="font-semibold text-[#F8F5F1]">{lead.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase tracking-wider font-semibold">Phone Number</p>
                <p className="font-medium text-[#F8F5F1] font-mono">{lead.phone || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase tracking-wider font-semibold">Email Address</p>
                <p className="font-medium text-[#F8F5F1] truncate">{lead.email || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase tracking-wider font-semibold">Date of Birth</p>
                <p className="font-medium text-[#F8F5F1]">{lead.dob || "Not specified"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase tracking-wider font-semibold">City</p>
                <p className="font-medium text-[#F8F5F1]">{lead.city || "Not specified"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase tracking-wider font-semibold">Country of Origin</p>
                <p className="font-medium text-[#F8F5F1]">{lead.country || "India"}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Academic & Education */}
          <div className="rounded-2xl bg-[#15100D]/80 border border-white/[0.08] backdrop-blur-md shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-[#F8F5F1]">Academic Background</h3>
              </div>
              <span className="text-[11px] text-[#897B70]">Prior Qualifications</span>
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-5 text-xs md:text-sm">
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase tracking-wider font-semibold">Highest Qualification</p>
                <p className="font-semibold text-[#F8F5F1]">{lead.qualification || "Not specified"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase tracking-wider font-semibold">Institution</p>
                <p className="font-medium text-[#F8F5F1]">{lead.institution || "To be discussed"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase tracking-wider font-semibold">GPA / Percentage</p>
                <p className="font-bold text-emerald-400">{lead.gpaOrScore || "Pending review"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase tracking-wider font-semibold">English Proficiency</p>
                <p className="font-medium text-[#F8F5F1]">{lead.englishTest || "Pending / Not Taken"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase tracking-wider font-semibold">Test Score</p>
                <p className="font-bold text-[#FF8A35]">{lead.englishScore || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase tracking-wider font-semibold">Study Level</p>
                <p className="font-medium text-[#F8F5F1]">{lead.studyLevel || "Higher Education"}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Study Preferences */}
          <div className="rounded-2xl bg-[#15100D]/80 border border-white/[0.08] backdrop-blur-md shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                  <Briefcase className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-[#F8F5F1]">Study Abroad Preferences</h3>
              </div>
              <span className="text-[11px] text-[#897B70]">Intake & Course Target</span>
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-5 text-xs md:text-sm">
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase tracking-wider font-semibold">Destination</p>
                <p className="font-semibold text-[#F8F5F1]">{lead.preferredDestination || "Not specified"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase tracking-wider font-semibold">Program / Major</p>
                <p className="font-semibold text-[#F8F5F1]">{lead.course || "General Counselling"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase tracking-wider font-semibold">Target Intake</p>
                <p className="font-bold text-[#FF8A35]">{lead.intake || "Upcoming intake"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase tracking-wider font-semibold">Annual Budget</p>
                <p className="font-medium text-[#F8F5F1]">{lead.budget || "To be discussed"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase tracking-wider font-semibold">Lead Source</p>
                <p className="font-medium text-[#F8F5F1]">{lead.leadSource}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#897B70] text-[11px] uppercase tracking-wider font-semibold">Next Follow-up Due</p>
                <p className="font-bold text-amber-400">{lead.nextFollowUp}</p>
              </div>
            </div>
            {lead.message && (
              <div className="mx-6 mb-6 p-4 rounded-xl bg-[#1D1510] border border-orange-500/20 text-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-orange-400" />
                  <span className="font-semibold text-[#F8F5F1]">Initial Website Inquiry Submission:</span>
                </div>
                <p className="text-[#BDB0A4] italic leading-relaxed">&ldquo;{lead.message}&rdquo;</p>
              </div>
            )}
          </div>

          {/* Section 4: Chronological Journey Timeline */}
          <div className="rounded-2xl bg-[#15100D]/80 border border-white/[0.08] backdrop-blur-md shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F8F5F1]">Student Journey Pipeline & Milestones</h3>
                  <p className="text-[11px] text-[#897B70]">
                    Progression tracking from initial contact to visa issuance
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddTimelineModal(true)}
                className="text-xs rounded-xl h-8 px-3 border-white/[0.08] bg-[#1D1510] hover:bg-[#271A12] text-[#F8F5F1] hover:text-[#FF6B00]"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Milestone
              </Button>
            </div>

            <div className="p-6">
              {/* Visual Pipeline Bar */}
              <div className="pb-6 mb-6 border-b border-white/[0.08] overflow-x-auto custom-scrollbar">
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
                          className={`flex items-center justify-center h-7 px-3 rounded-full text-[10px] font-bold whitespace-nowrap border transition-all ${
                            isPassed
                              ? "bg-orange-500/20 text-[#FF8A35] border-orange-500/40 shadow-sm shadow-orange-950/20"
                              : "bg-[#1D1510] text-[#897B70] border-white/[0.06]"
                          }`}
                        >
                          {i + 1}. {stage}
                        </div>
                        {i < standardStages.length - 1 && (
                          <ChevronRight className="h-3.5 w-3.5 text-[#897B70]/40 shrink-0" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Chronological Timeline items */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.08]">
                {timeline.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full bg-[#FF6B00] ring-4 ring-[#15100D] border border-orange-300" />
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-[#F8F5F1]">{item.title}</h4>
                        <span className="text-[11px] text-[#897B70] font-mono">{item.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#BDB0A4] mt-1 leading-relaxed">{item.description}</p>
                      <p className="text-[10px] text-orange-400/90 mt-1.5 font-medium flex items-center gap-1">
                        <span>Logged by:</span>
                        <strong className="text-[#F8F5F1]">{item.actor}</strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Internal Notes & Status Management */}
        <div className="space-y-6">
          {/* Status Change Selector */}
          <div className="rounded-2xl bg-[#15100D]/80 border border-white/[0.08] backdrop-blur-md shadow-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold text-[#F8F5F1]">Update Lead Status</h3>
              <p className="text-[11px] text-[#897B70] mt-0.5">Control progression through CRM lifecycle</p>
            </div>
            <div className="p-5 space-y-3">
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                className="w-full h-10 rounded-xl border border-white/[0.12] bg-[#1D1510] px-3 text-xs text-[#F8F5F1] font-semibold outline-none focus:ring-1 focus:ring-orange-500/50"
              >
                <option value="New" className="bg-[#1D1510] text-[#F8F5F1]">New</option>
                <option value="Contacted" className="bg-[#1D1510] text-[#F8F5F1]">Contacted</option>
                <option value="Counselling Scheduled" className="bg-[#1D1510] text-[#F8F5F1]">Counselling Scheduled</option>
                <option value="Counselling Completed" className="bg-[#1D1510] text-[#F8F5F1]">Counselling Completed</option>
                <option value="Interested" className="bg-[#1D1510] text-[#F8F5F1]">Interested</option>
                <option value="Application Started" className="bg-[#1D1510] text-[#F8F5F1]">Application Started</option>
                <option value="Converted to Student" className="bg-[#1D1510] text-[#F8F5F1]">Converted to Student</option>
                <option value="Not Interested" className="bg-[#1D1510] text-[#F8F5F1]">Not Interested</option>
                <option value="Lost" className="bg-[#1D1510] text-[#F8F5F1]">Lost</option>
              </select>

              <div className="text-[11px] text-[#897B70] leading-relaxed pt-1">
                Moving this lead to <strong className="text-emerald-400">&ldquo;Converted to Student&rdquo;</strong> will automatically generate an active student record for admission tracking.
              </div>
            </div>
          </div>

          {/* Internal Notes System */}
          <div className="rounded-2xl bg-[#15100D]/80 border border-white/[0.08] backdrop-blur-md shadow-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#F8F5F1] flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-orange-400" /> Counsellor Internal Notes
                </h3>
                <p className="text-[11px] text-[#897B70] mt-0.5">
                  Private team discussion & log
                </p>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#271A12] border border-orange-500/20 font-bold text-[#FF8A35]">
                {notes.length}
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2.5">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add confidential discussion note, meeting summary, or follow-up notes..."
                  rows={3}
                  className="w-full rounded-xl border border-white/[0.1] bg-[#1D1510] p-3 text-xs text-[#F8F5F1] placeholder:text-[#897B70] outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    className="h-8 text-xs font-semibold rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A35] hover:opacity-90 text-white shadow-md shadow-orange-950/30"
                  >
                    <Send className="h-3 w-3 mr-1.5" /> Post Note
                  </Button>
                </div>
              </form>

              {/* Notes List */}
              <div className="space-y-3 pt-2">
                {notes.length === 0 ? (
                  <p className="text-xs text-[#897B70] text-center py-4 italic">
                    No notes recorded yet. Add initial discussion summary above.
                  </p>
                ) : (
                  notes
                    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                    .map((note) => (
                      <div
                        key={note.id}
                        className={`p-3.5 rounded-xl border transition-all text-xs space-y-2 ${
                          note.isPinned
                            ? "bg-orange-500/[0.08] border-orange-500/30 shadow-sm"
                            : "bg-[#1D1510] border-white/[0.06]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-[#F8F5F1]">
                            <span>{note.author}</span>
                            <span className="text-[10px] text-[#897B70] font-normal">({note.role})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleTogglePin(note.id)}
                              className={`p-1 rounded hover:bg-white/[0.06] transition-colors ${
                                note.isPinned ? "text-[#FF8A35]" : "text-[#897B70]"
                              }`}
                              title={note.isPinned ? "Unpin note" : "Pin note to top"}
                            >
                              <Pin className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-1 rounded text-[#897B70] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete note"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-[#BDB0A4] leading-relaxed whitespace-pre-wrap">{note.content}</p>
                        <div className="text-[10px] text-[#897B70]">{note.timestamp}</div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Timeline Event Modal */}
      {showAddTimelineModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#15100D] border border-white/[0.12] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#F8F5F1]">Add Custom Timeline Milestone</h3>
            <p className="text-xs text-[#BDB0A4]">
              Record a significant action, student meeting, or document submission.
            </p>
            <input
              type="text"
              value={newTimelineTitle}
              onChange={(e) => setNewTimelineTitle(e.target.value)}
              placeholder="e.g. Conducted mock visa interview with student"
              className="w-full rounded-xl border border-white/[0.12] bg-[#1D1510] p-3 text-xs text-[#F8F5F1] placeholder:text-[#897B70] outline-none focus:border-orange-500/50"
              autoFocus
            />
            <div className="flex justify-end gap-2.5 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddTimelineModal(false)}
                className="text-xs text-[#BDB0A4] hover:text-[#F8F5F1] hover:bg-white/[0.06] rounded-xl"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAddTimeline}
                className="bg-gradient-to-r from-[#FF6B00] to-[#FF8A35] hover:opacity-90 text-white rounded-xl text-xs font-semibold shadow-md shadow-orange-950/40"
              >
                Save Milestone
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
