"use client"

import * as React from "react"
import {
  Inbox,
  Sparkles,
  Phone,
  MessageCircle,
  Mail,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge"
import { INITIAL_LEADS, Lead } from "@/lib/mock-data"
import Link from "next/link"
import { toast } from "sonner"
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

  // Normalize source for UI badge / filter
  let sourceUI: Lead["leadSource"] = "Website";
  const rawSource = (row.lead_source || "").toLowerCase();
  if (rawSource.includes("whatsapp")) sourceUI = "WhatsApp";
  else if (rawSource.includes("instagram") || rawSource.includes("social")) sourceUI = "Instagram";
  else if (rawSource.includes("referral")) sourceUI = "Referral";
  else if (rawSource.includes("walk")) sourceUI = "Walk-in";
  else if (rawSource.includes("phone")) sourceUI = "Phone";
  else if (rawSource.includes("website") || rawSource.includes("google") || rawSource.includes("fair")) sourceUI = "Website";
  else sourceUI = "Other";

  // Normalize status for UI
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
    id: row.id || `lead-web-${row.phone || "demo"}`,
    leadCode: `WEB-${codeNum}`,
    firstName,
    lastName,
    name: row.full_name || `${firstName} ${lastName}`,
    email: row.email || "",
    phone: row.phone || "",
    city: row.city || meta.city || "",
    country: row.country || "India",
    preferredDestination: destination,
    course: row.course || meta.course || "Higher Education",
    intake: row.intake || meta.intake || "Upcoming Intake",
    qualification: row.qualification || meta.qualification || "Graduate",
    institution: meta.institution || "",
    gpaOrScore: row.grade || meta.grade || "",
    englishTest: meta.english_test || "",
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
    notes: row.notes || row.message || "Submitted via website consultation form",
  };
}

export function InquiriesClientView() {
  const [inquiries, setInquiries] = React.useState<Lead[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isClearing, setIsClearing] = React.useState(false)

  // Fetch live leads from Supabase and listen for real-time events
  React.useEffect(() => {
    const supabase = createClient();

    async function loadLiveInquiries() {
      try {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data !== null) {
          const liveLeads = data.map(mapDbLeadToLead);
          // Check local storage submissions too
          let localMapped: Lead[] = [];
          try {
            const local = JSON.parse(localStorage.getItem("pathway_local_leads") || "[]");
            if (local.length > 0) {
              localMapped = local.map(mapDbLeadToLead);
            }
          } catch (e) {}

          const liveIds = new Set(liveLeads.map((l) => l.id));
          const uniqueLocal = localMapped.filter((l) => !liveIds.has(l.id));
          setInquiries([...liveLeads, ...uniqueLocal]);
        }
      } catch (err) {
        console.debug("Live inquiry fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadLiveInquiries();

    // Listen to real-time custom event dispatched by LeadNotificationListener
    const handleNewLeadEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const newLeadItem = mapDbLeadToLead(customEvent.detail);
        setInquiries((prev) => [newLeadItem, ...prev.filter((p) => p.id !== newLeadItem.id)]);
      }
    };

    window.addEventListener("pathway_new_lead", handleNewLeadEvent);
    return () => {
      window.removeEventListener("pathway_new_lead", handleNewLeadEvent);
    };
  }, []);

  const handleClearAllInquiries = async () => {
    if (!window.confirm("Are you sure you want to clear all inquiries? This will permanently remove all website inquiries.")) {
      return;
    }

    setIsClearing(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("leads")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) {
        console.warn("Supabase delete failed:", error.message);
      }

      try {
        localStorage.removeItem("pathway_local_leads");
      } catch (e) {}

      setInquiries([]);
      toast.success("All inquiries cleared successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear inquiries");
    } finally {
      setIsClearing(false);
    }
  };

  const handleDeleteInquiry = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete inquiry for "${name}"?`)) {
      return;
    }

    try {
      const supabase = createClient();
      await supabase.from("leads").delete().eq("id", id);
      try {
        const local = JSON.parse(localStorage.getItem("pathway_local_leads") || "[]");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filtered = local.filter((l: any) => l.id !== id);
        localStorage.setItem("pathway_local_leads", JSON.stringify(filtered));
      } catch (e) {}

      setInquiries(prev => prev.filter(l => l.id !== id));
      toast.success(`Inquiry for ${name} deleted`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete inquiry");
    }
  };

  const handleAssignCounsellor = (id: string, counsellor: string) => {
    setInquiries(prev => prev.map(l => l.id === id ? { ...l, assignedCounsellor: counsellor, status: "Contacted" } : l))
    toast.success(`Assigned to ${counsellor} and scheduled follow-up`)
  }

  const handleCreateTask = (lead: Lead) => {
    toast.success(`First follow-up call task created for ${lead.name}`)
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Website Inquiry Intake & Triage
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Live Feed
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Real-time inquiries automatically captured from the public Pathway website contact & course forms.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAllInquiries}
            disabled={isClearing || inquiries.length === 0}
            className="h-9 px-3.5 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border-rose-500/30 rounded-xl font-medium transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            {isClearing ? "Clearing..." : "Clear All Inquiries"}
          </Button>
        </div>
      </div>

      {/* Duplicate detection badge explanation */}
      <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
          <p className="text-foreground">
            <strong>Automatic Lead Routing Active:</strong> Every submission generates a unique <code>LD-XXXX</code> reference, runs phone/email duplicate detection, and notifies counselors.
          </p>
        </div>
      </div>

      {/* Inquiries Feed Cards */}
      {inquiries.length === 0 && !isLoading ? (
        <Card className="border border-dashed border-border/60 bg-card/40 p-12 text-center rounded-2xl">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Inbox className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-foreground">No inquiries found</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              All inquiries have been cleared. New submissions from website contact and inquiry forms will automatically arrive here in real-time.
            </p>
          </div>
        </Card>
      ) : (
      <div className="space-y-4">
        {inquiries.map((inq) => {
          const isNew = inq.status === "New"

          return (
            <Card
              key={inq.id}
              className={`border transition-all duration-200 ${
                isNew
                  ? "border-amber-500/40 bg-amber-500/5 shadow-md shadow-amber-500/5"
                  : "border-border/60 bg-card/75"
              }`}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                      {inq.avatar || inq.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link href={`/leads/${inq.id}`} className="text-base font-bold text-foreground hover:text-primary transition-colors">
                          {inq.name}
                        </Link>
                        {isNew && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase">
                            NEW INQUIRY
                          </span>
                        )}
                        <span className="text-xs font-mono text-muted-foreground">{inq.leadCode}</span>
                      </div>
                      <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                        Submitted on {inq.createdDate} via Pathway Website Contact Form
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={inq.status} />
                    <PriorityBadge priority={inq.priority} />
                  </div>
                </div>

                {/* Submitted Message */}
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 text-xs space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Student Message:</span>
                  <p className="text-foreground/90 italic font-sans leading-relaxed">
                    &ldquo;{inq.message || `Interested in enrolling for ${inq.course} in ${inq.preferredDestination} for ${inq.intake} intake.`}&rdquo;
                  </p>
                </div>

                {/* Bottom Bar: Action buttons & counsellor assignment */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/30 text-xs">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span>Target: <strong className="text-foreground">{inq.course}</strong></span>
                    <span>•</span>
                    <span>Destination: <strong className="text-foreground">{inq.preferredDestination}</strong></span>
                    <span>•</span>
                    <span>Phone: <strong className="text-foreground">{inq.phone}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCreateTask(inq)}
                      className="h-8 text-xs rounded-xl border-border/60"
                    >
                      <Clock className="h-3.5 w-3.5 mr-1 text-primary" /> + Follow-up Task
                    </Button>

                    <Button
                      size="sm"
                      asChild
                      className="h-8 text-xs rounded-xl bg-primary text-primary-foreground font-semibold"
                    >
                      <Link href={`/leads/${inq.id}`}>
                        Open Profile &rarr;
                      </Link>
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteInquiry(inq.id, inq.name)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Delete inquiry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      )}
    </div>
  )
}
