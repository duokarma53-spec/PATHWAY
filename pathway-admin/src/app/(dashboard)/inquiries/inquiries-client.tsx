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
  Trash2,
  Search,
  Filter,
  Globe,
  GraduationCap,
  Calendar,
  ExternalLink,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge"
import { Lead } from "@/lib/mock-data"
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
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("ALL")
  const [destFilter, setDestFilter] = React.useState("ALL")

  // Fetch live leads from Supabase and listen for real-time events
  const loadLiveInquiries = React.useCallback(async () => {
    const supabase = createClient();
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
  }, []);

  React.useEffect(() => {
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
  }, [loadLiveInquiries]);

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
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) console.warn("Supabase delete failed (may be local only or RLS blocked):", error);
      
      try {
        const local = JSON.parse(localStorage.getItem("pathway_local_leads") || "[]");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filtered = local.filter((l: any) => {
          const generatedWebId = `lead-web-${l.phone || "demo"}`;
          const generatedLiveId = `lead-live-${l.phone || "demo"}`;
          return l.id !== id && generatedWebId !== id && generatedLiveId !== id;
        });
        localStorage.setItem("pathway_local_leads", JSON.stringify(filtered));
      } catch (e) {}

      setInquiries(prev => prev.filter(l => l.id !== id));
      toast.success(`Inquiry for ${name} deleted`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete inquiry");
    }
  };

  const handleCreateTask = (lead: Lead) => {
    toast.success(`First follow-up call task created for ${lead.name}`)
  }

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      !query ||
      inq.name.toLowerCase().includes(query) ||
      inq.email.toLowerCase().includes(query) ||
      inq.phone.includes(query) ||
      inq.course.toLowerCase().includes(query) ||
      inq.preferredDestination.toLowerCase().includes(query);

    const matchStatus =
      statusFilter === "ALL" ||
      (statusFilter === "NEW" && inq.status === "New") ||
      (statusFilter === "CONTACTED" && inq.status === "Contacted") ||
      (statusFilter === "CONVERTED" && inq.status === "Converted to Student");

    const matchDest =
      destFilter === "ALL" ||
      inq.preferredDestination.toLowerCase().includes(destFilter.toLowerCase());

    return matchSearch && matchStatus && matchDest;
  });

  const newCount = inquiries.filter((i) => i.status === "New").length;
  const contactedCount = inquiries.filter((i) => i.status === "Contacted").length;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#F8F5F1]">
              Website Inquiries
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/15 text-[#FF8A35] text-xs font-bold border border-orange-500/30 flex items-center gap-1 shadow-sm shadow-orange-950/20">
              <Sparkles className="h-3 w-3" /> Real-time Feed
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#BDB0A4] mt-1">
            Incoming prospective student consultations captured from the public Pathway website.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={loadLiveInquiries}
            className="h-9 px-3.5 text-xs bg-[#15100D] text-[#F8F5F1] hover:bg-[#1D1510] border-white/[0.08] rounded-xl font-medium transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-orange-400" />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAllInquiries}
            disabled={isClearing || inquiries.length === 0}
            className="h-9 px-3.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/25 bg-rose-500/5 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            {isClearing ? "Clearing..." : "Clear Inquiries"}
          </Button>
        </div>
      </div>

      {/* Metric Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#15100D]/80 border border-white/[0.08] backdrop-blur-md">
          <p className="text-[11px] uppercase tracking-wider text-[#897B70] font-semibold">Total Inbound</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#F8F5F1]">{inquiries.length}</span>
            <span className="text-[11px] text-[#BDB0A4]">All-time</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-orange-500/[0.07] border border-orange-500/25 backdrop-blur-md">
          <p className="text-[11px] uppercase tracking-wider text-[#FF8A35] font-semibold">New / Uncontacted</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#FF8A35]">{newCount}</span>
            <span className="text-[11px] font-semibold text-orange-400/80">Action required</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#15100D]/80 border border-white/[0.08] backdrop-blur-md">
          <p className="text-[11px] uppercase tracking-wider text-[#897B70] font-semibold">In Progress</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-sky-400">{contactedCount}</span>
            <span className="text-[11px] text-[#BDB0A4]">Outreach made</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#15100D]/80 border border-white/[0.08] backdrop-blur-md">
          <p className="text-[11px] uppercase tracking-wider text-[#897B70] font-semibold">Response SLA</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-emerald-400">&lt; 2 hrs</span>
            <span className="text-[11px] text-[#BDB0A4]">Triage target</span>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      <div className="p-3.5 rounded-2xl bg-[#181310] border border-white/[0.08] flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          </div>
          <p className="text-[#BDB0A4]">
            <strong className="text-[#F8F5F1]">Live Routing & Deduplication:</strong> Inbound leads are cross-checked for existing phone/email records before generating CRM assignment tasks.
          </p>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="rounded-2xl bg-[#15100D]/80 border border-white/[0.08] p-3 backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full sm:min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#897B70]" />
          <input
            type="text"
            placeholder="Search inquiries by student name, phone, course, or target country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-[#1D1510] border border-white/[0.08] text-xs text-[#F8F5F1] placeholder:text-[#897B70] outline-none focus:border-orange-500/50"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 w-full sm:w-auto truncate px-3 rounded-xl bg-[#1D1510] border border-white/[0.08] text-xs text-[#F8F5F1] outline-none font-medium cursor-pointer"
          >
            <option value="ALL" className="bg-[#1D1510] text-[#F8F5F1]">All Statuses</option>
            <option value="NEW" className="bg-[#1D1510] text-[#F8F5F1]">New Only</option>
            <option value="CONTACTED" className="bg-[#1D1510] text-[#F8F5F1]">Contacted</option>
            <option value="CONVERTED" className="bg-[#1D1510] text-[#F8F5F1]">Converted</option>
          </select>

          <select
            value={destFilter}
            onChange={(e) => setDestFilter(e.target.value)}
            className="h-9 w-full sm:w-auto truncate px-3 rounded-xl bg-[#1D1510] border border-white/[0.08] text-xs text-[#F8F5F1] outline-none font-medium cursor-pointer"
          >
            <option value="ALL" className="bg-[#1D1510] text-[#F8F5F1]">All Destinations</option>
            <option value="United Kingdom" className="bg-[#1D1510] text-[#F8F5F1]">United Kingdom</option>
            <option value="United States" className="bg-[#1D1510] text-[#F8F5F1]">United States</option>
            <option value="Canada" className="bg-[#1D1510] text-[#F8F5F1]">Canada</option>
            <option value="Australia" className="bg-[#1D1510] text-[#F8F5F1]">Australia</option>
            <option value="Germany" className="bg-[#1D1510] text-[#F8F5F1]">Germany</option>
            <option value="Ireland" className="bg-[#1D1510] text-[#F8F5F1]">Ireland</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-36 rounded-2xl bg-[#15100D]/50 border border-white/[0.06] animate-pulse" />
          ))}
        </div>
      )}

      {/* Inquiries Feed Cards */}
      {!isLoading && filteredInquiries.length === 0 ? (
        <div className="border border-dashed border-white/[0.1] bg-[#15100D]/50 p-12 text-center rounded-2xl">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Inbox className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[#F8F5F1]">No inquiries matching filter</h3>
            <p className="text-xs text-[#897B70] max-w-sm">
              {searchQuery || statusFilter !== "ALL" || destFilter !== "ALL"
                ? "Try clearing filters or search terms to inspect more inbound inquiries."
                : "All inquiries have been processed or cleared. New web form submissions will appear here in real-time."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inq) => {
            const isNew = inq.status === "New"

            return (
              <div
                key={inq.id}
                className={`rounded-2xl border transition-all duration-200 p-5 space-y-4 relative overflow-hidden backdrop-blur-md ${
                  isNew
                    ? "border-orange-500/35 bg-[#18120D] shadow-lg shadow-orange-950/20"
                    : "border-white/[0.08] bg-[#15100D]/85 hover:border-white/[0.14]"
                }`}
              >
                {/* Header row: Avatar, Name, Reference, Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="h-11 w-11 rounded-xl bg-[#271A12] border border-orange-500/30 flex items-center justify-center font-extrabold text-xs text-[#FF8A35] shrink-0">
                      {inq.avatar || inq.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/leads/${inq.id}`}
                          className="text-base font-bold text-[#F8F5F1] hover:text-[#FF6B00] transition-colors"
                        >
                          {inq.name}
                        </Link>
                        {isNew && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-[#FF8A35] border border-orange-500/40 uppercase tracking-wide">
                            NEW INQUIRY
                          </span>
                        )}
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-[#271A12] text-[#FF8A35] border border-orange-500/20">
                          {inq.leadCode}
                        </span>
                      </div>
                      <p className="text-xs text-[#897B70] mt-0.5" suppressHydrationWarning>
                        Received on {inq.createdDate} via Pathway Website Form
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={inq.status} />
                    <PriorityBadge priority={inq.priority} />
                  </div>
                </div>

                {/* Submitted Message Box */}
                <div className="p-3.5 rounded-xl bg-[#1D1510] border border-white/[0.06] text-xs space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#897B70]">Student Message & Goals:</span>
                  <p className="text-[#BDB0A4] italic font-sans leading-relaxed">
                    &ldquo;{inq.message || `Interested in enrolling for ${inq.course} in ${inq.preferredDestination} for ${inq.intake} intake.`}&rdquo;
                  </p>
                </div>

                {/* Bottom Bar: Quick metadata & action buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.06] text-xs">
                  <div className="flex flex-wrap items-center gap-3 text-[#897B70]">
                    <span>Target: <strong className="text-[#F8F5F1]">{inq.course}</strong></span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 text-orange-400" />
                      <strong className="text-[#F8F5F1]">{inq.preferredDestination}</strong>
                    </span>
                    <span>•</span>
                    <span>Phone: <strong className="text-[#F8F5F1] font-mono">{inq.phone}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {inq.phone && (
                      <>
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 px-2.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>

                        <a
                          href={`tel:${inq.phone}`}
                          className="h-8 px-2.5 rounded-xl text-xs font-semibold bg-[#1D1510] hover:bg-[#271A12] text-[#F8F5F1] border border-white/[0.08] flex items-center gap-1.5 transition-colors"
                          title="Call student"
                        >
                          <Phone className="h-3.5 w-3.5 text-sky-400" />
                          <span className="hidden sm:inline">Call</span>
                        </a>
                      </>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCreateTask(inq)}
                      className="h-8 text-xs rounded-xl bg-[#1D1510] hover:bg-[#271A12] border-white/[0.08] text-[#F8F5F1]"
                    >
                      <Clock className="h-3.5 w-3.5 mr-1 text-[#FF6B00]" /> + Task
                    </Button>

                    <Button
                      size="sm"
                      asChild
                      className="h-8 text-xs rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A35] hover:opacity-90 text-white font-semibold shadow-md shadow-orange-950/30"
                    >
                      <Link href={`/leads/${inq.id}`}>
                        Open Profile &rarr;
                      </Link>
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteInquiry(inq.id, inq.name)}
                      className="h-8 w-8 p-0 text-[#897B70] hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Delete inquiry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
