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
  ExternalLink
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
  const codeNum = row.id ? row.id.substring(0, 4).toUpperCase() : Math.floor(1000 + Math.random() * 9000);
  return {
    id: row.id || `lead-web-${Date.now()}`,
    leadCode: `WEB-${codeNum}`,
    name: row.full_name || "Prospective Student",
    email: row.email || "",
    phone: row.phone || "",
    preferredDestination: row.destination || "United Kingdom",
    course: row.course || "Higher Education",
    intake: row.intake || "Upcoming 2026",
    qualification: row.qualification || "Graduate",
    status: (row.status === "new" ? "New" : "New") as any,
    priority: "High" as any,
    leadSource: "Website",
    assignedCounsellor: "Admin",
    createdDate: row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    lastContactDate: "Pending first contact",
    score: 90,
    notes: row.message || "Submitted via website consultation form",
  };
}

export function InquiriesClientView() {
  const websiteInquiries = INITIAL_LEADS.filter(l => l.leadSource === "Website")
  const [inquiries, setInquiries] = React.useState<Lead[]>(websiteInquiries)
  const [isLoading, setIsLoading] = React.useState(true)

  // Fetch live leads from Supabase and listen for real-time events
  React.useEffect(() => {
    const supabase = createClient();

    async function loadLiveInquiries() {
      try {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const liveLeads = data.map(mapDbLeadToLead);
          // Merge live leads on top of initial mock data without duplicates
          setInquiries((prev) => {
            const liveIds = new Set(liveLeads.map((l) => l.id));
            const remainingMock = prev.filter((p) => !liveIds.has(p.id));
            return [...liveLeads, ...remainingMock];
          });
        }
      } catch (err) {
        console.debug("Live inquiry fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadLiveInquiries();

    // Check localStorage for any inquiries submitted in this browser
    try {
      const local = JSON.parse(localStorage.getItem("pathway_local_leads") || "[]");
      if (local.length > 0) {
        const localMapped = local.map(mapDbLeadToLead);
        setInquiries((prev) => [...localMapped, ...prev]);
      }
    } catch (e) {}

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="rounded-xl border-border/70 text-xs">
            <a href="http://localhost:3000/contact" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
              <span>View Public Website Form</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
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
                      <p className="text-xs text-muted-foreground">
                        Submitted on {new Date(inq.createdDate).toLocaleString()} via Pathway Website Contact Form
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
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
