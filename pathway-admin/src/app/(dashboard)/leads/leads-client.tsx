"use client"

import * as React from "react"
import {
  Search,
  Filter,
  Download,
  Phone,
  MessageCircle,
  MoreVertical,
  UserCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpDown,
  Plus,
  RefreshCw,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge"
import { INITIAL_LEADS, Lead } from "@/lib/mock-data"
import Link from "next/link"
import { toast } from "sonner"
import { CRMQuickActions } from "@/components/actions/crm-quick-actions"
import { createClient } from "@/lib/supabase/client"

// Helper to map DB row to Lead interface
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbLeadToLead(row: any): Lead {
  const codeNum = row.id ? row.id.replace(/-/g, "").substring(0, 4).toUpperCase() : (row.phone ? row.phone.slice(-4) : "1001");
  const nameParts = (row.full_name || "Prospective Student").trim().split(" ");
  const firstName = nameParts[0] || "Prospective";
  const lastName = nameParts.slice(1).join(" ") || "Student";

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
    lastContacted: row.last_contacted_at ? new Date(row.last_contacted_at).toISOString().split("T")[0] : "Pending first contact",
    nextFollowUp: row.next_followup_at ? new Date(row.next_followup_at).toISOString().split("T")[0] : "To be scheduled",
    notesCount: row.message ? 1 : 0,
    message: row.message || "",
    notes: row.message || "Submitted via website consultation form",
  };
}

export function LeadsClientView() {
  const [leads, setLeads] = React.useState<Lead[]>(INITIAL_LEADS)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("ALL")
  const [priorityFilter, setPriorityFilter] = React.useState("ALL")
  const [destFilter, setDestFilter] = React.useState("ALL")
  const [sourceFilter, setSourceFilter] = React.useState("ALL")
  const [selectedLeads, setSelectedLeads] = React.useState<string[]>([])
  const [sortField, setSortField] = React.useState<"name" | "createdDate" | "priority">("createdDate")
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc")

  // Live Supabase Leads Sync & Real-time Auto-Refresh
  React.useEffect(() => {
    const supabase = createClient();

    async function fetchLiveLeads() {
      try {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const live = data.map(mapDbLeadToLead);
          setLeads((prev) => {
            const liveIds = new Set(live.map((l) => l.id));
            const remainingMock = prev.filter((p) => !liveIds.has(p.id));
            return [...live, ...remainingMock];
          });
        }
      } catch (err) {
        console.debug("Error fetching live leads:", err);
      }
    }

    fetchLiveLeads();

    // Check localStorage fallback
    try {
      const local = JSON.parse(localStorage.getItem("pathway_local_leads") || "[]");
      if (local.length > 0) {
        const localMapped = local.map(mapDbLeadToLead);
        setLeads((prev) => [...localMapped, ...prev]);
      }
    } catch (e) {}

    // Listen to real-time custom event
    const handleNewLeadEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const newLeadItem = mapDbLeadToLead(customEvent.detail);
        setLeads((prev) => [newLeadItem, ...prev.filter((p) => p.id !== newLeadItem.id)]);
      }
    };

    window.addEventListener("pathway_new_lead", handleNewLeadEvent);
    return () => {
      window.removeEventListener("pathway_new_lead", handleNewLeadEvent);
    };
  }, []);

  // Filter & Search logic
  const filteredLeads = React.useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        search === "" ||
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.includes(search) ||
        lead.leadCode.toLowerCase().includes(search.toLowerCase()) ||
        lead.course.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter
      const matchesPriority = priorityFilter === "ALL" || lead.priority === priorityFilter
      const matchesDest = destFilter === "ALL" || lead.preferredDestination === destFilter
      const matchesSource = sourceFilter === "ALL" || lead.leadSource === sourceFilter

      return matchesSearch && matchesStatus && matchesPriority && matchesDest && matchesSource
    }).sort((a, b) => {
      if (sortField === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }
      if (sortField === "createdDate") {
        return sortOrder === "asc"
          ? new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
          : new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      }
      return 0
    })
  }, [leads, search, statusFilter, priorityFilter, destFilter, sourceFilter, sortField, sortOrder])

  // Bulk selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeads(filteredLeads.map((l) => l.id))
    } else {
      setSelectedLeads([])
    }
  }

  const handleSelectLead = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Quick inline status change
  const handleStatusChange = (id: string, newStatus: Lead["status"]) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus, lastContacted: "Just now" } : l))
    )
    toast.success(`Lead status updated to ${newStatus}`)
  }

  // Bulk status update
  const handleBulkStatus = (newStatus: Lead["status"]) => {
    setLeads((prev) =>
      prev.map((l) => (selectedLeads.includes(l.id) ? { ...l, status: newStatus } : l))
    )
    toast.success(`Updated ${selectedLeads.length} leads to ${newStatus}`)
    setSelectedLeads([])
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Lead Code", "Name", "Email", "Phone", "Destination", "Course", "Intake", "Source", "Status", "Priority", "Counsellor"]
    const rows = filteredLeads.map(l => [
      l.leadCode,
      `"${l.name}"`,
      l.email,
      l.phone,
      `"${l.preferredDestination}"`,
      `"${l.course}"`,
      l.intake,
      l.leadSource,
      l.status,
      l.priority,
      `"${l.assignedCounsellor}"`
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `pathway_crm_leads_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Exported ${filteredLeads.length} leads to CSV`)
  }

  // Metrics
  const totalCount = leads.length
  const newCount = leads.filter(l => l.status === "New").length
  const scheduledCount = leads.filter(l => l.status === "Counselling Scheduled").length
  const appStartedCount = leads.filter(l => l.status === "Application Started").length
  const convertedCount = leads.filter(l => l.status === "Converted to Student").length

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 min-w-0">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Lead & Inquiry Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">
              {leads.length} Active Leads
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Real-time pipeline of student inquiries from website, WhatsApp, phone, and walk-ins.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="rounded-xl border-border/70 hover:bg-muted/50 text-xs flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
          <CRMQuickActions />
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          onClick={() => setStatusFilter("ALL")}
          className={`cursor-pointer p-3.5 rounded-2xl border transition-all ${
            statusFilter === "ALL"
              ? "bg-primary/10 border-primary/40 shadow-sm"
              : "bg-card/60 border-border/40 hover:border-border"
          }`}
        >
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Leads</p>
          <p className="text-xl md:text-2xl font-bold text-foreground mt-0.5">{totalCount}</p>
        </div>
        <div
          onClick={() => setStatusFilter("New")}
          className={`cursor-pointer p-3.5 rounded-2xl border transition-all ${
            statusFilter === "New"
              ? "bg-amber-500/15 border-amber-500/40 shadow-sm"
              : "bg-card/60 border-border/40 hover:border-border"
          }`}
        >
          <p className="text-[11px] font-medium text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> New Inquiries
          </p>
          <p className="text-xl md:text-2xl font-bold text-amber-400 mt-0.5">{newCount}</p>
        </div>
        <div
          onClick={() => setStatusFilter("Counselling Scheduled")}
          className={`cursor-pointer p-3.5 rounded-2xl border transition-all ${
            statusFilter === "Counselling Scheduled"
              ? "bg-purple-500/15 border-purple-500/40 shadow-sm"
              : "bg-card/60 border-border/40 hover:border-border"
          }`}
        >
          <p className="text-[11px] font-medium text-purple-400 uppercase tracking-wider">Counselling</p>
          <p className="text-xl md:text-2xl font-bold text-purple-400 mt-0.5">{scheduledCount}</p>
        </div>
        <div
          onClick={() => setStatusFilter("Application Started")}
          className={`cursor-pointer p-3.5 rounded-2xl border transition-all ${
            statusFilter === "Application Started"
              ? "bg-blue-500/15 border-blue-500/40 shadow-sm"
              : "bg-card/60 border-border/40 hover:border-border"
          }`}
        >
          <p className="text-[11px] font-medium text-blue-400 uppercase tracking-wider">App In Progress</p>
          <p className="text-xl md:text-2xl font-bold text-blue-400 mt-0.5">{appStartedCount}</p>
        </div>
        <div
          onClick={() => setStatusFilter("Converted to Student")}
          className={`cursor-pointer p-3.5 rounded-2xl border transition-all ${
            statusFilter === "Converted to Student"
              ? "bg-emerald-500/15 border-emerald-500/40 shadow-sm"
              : "bg-card/60 border-border/40 hover:border-border"
          }`}
        >
          <p className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">Converted</p>
          <p className="text-xl md:text-2xl font-bold text-emerald-400 mt-0.5">{convertedCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-border/60 bg-card/75 backdrop-blur-xl shadow-sm">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, course, or ID (e.g. 'LD-1048')..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-muted/30 border-border/50 focus:bg-background text-sm"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground outline-none font-medium focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Statuses</option>
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

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground outline-none font-medium focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {/* Destination Filter */}
              <select
                value={destFilter}
                onChange={(e) => setDestFilter(e.target.value)}
                className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground outline-none font-medium focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Countries</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>

              {/* Source Filter */}
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground outline-none font-medium focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Sources</option>
                <option value="Website">Website</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Phone">Phone</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Referral">Referral</option>
                <option value="Instagram">Instagram</option>
              </select>

              {(search || statusFilter !== "ALL" || priorityFilter !== "ALL" || destFilter !== "ALL" || sourceFilter !== "ALL") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch("")
                    setStatusFilter("ALL")
                    setPriorityFilter("ALL")
                    setDestFilter("ALL")
                    setSourceFilter("ALL")
                  }}
                  className="h-9 text-xs text-muted-foreground hover:text-foreground"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Bulk Actions Bar (if any selected) */}
          {selectedLeads.length > 0 && (
            <div className="flex items-center justify-between p-2.5 px-4 rounded-xl bg-primary/10 border border-primary/30 animate-in fade-in-50">
              <span className="text-xs font-semibold text-primary">
                {selectedLeads.length} lead{selectedLeads.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatus("Contacted")}
                  className="h-7 text-xs rounded-lg border-border"
                >
                  Mark Contacted
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatus("Counselling Scheduled")}
                  className="h-7 text-xs rounded-lg border-border"
                >
                  Schedule Counselling
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleBulkStatus("Converted to Student")}
                  className="h-7 text-xs rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Convert to Student
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Leads Table */}
      <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30 text-muted-foreground uppercase text-[11px] tracking-wider font-semibold">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border bg-card cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">Lead / Student</th>
                <th className="py-3 px-3">Destination & Course</th>
                <th className="py-3 px-3">Source</th>
                <th className="py-3 px-3">Counsellor</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Next Follow-up</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground">
                    <p className="text-sm font-medium">No leads match your active filters.</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Try resetting the filter criteria or searching a different term.</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isSelected = selectedLeads.includes(lead.id)
                  const isNew = lead.status === "New"

                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-muted/30 transition-colors group ${
                        isSelected ? "bg-primary/5" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectLead(lead.id)}
                          className="rounded border-border bg-card cursor-pointer"
                        />
                      </td>

                      {/* Lead / Student Details */}
                      <td className="py-3.5 px-3 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                            {lead.avatar || lead.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <Link
                                href={`/leads/${lead.id}`}
                                className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1"
                              >
                                {lead.name}
                              </Link>
                              {isNew && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase">
                                  NEW
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-muted-foreground/80">{lead.leadCode}</span>
                              <span>•</span>
                              <span>{lead.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Destination & Course */}
                      <td className="py-3.5 px-3 min-w-[200px]">
                        <p className="font-medium text-foreground">{lead.course}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {lead.preferredDestination} • <span className="text-primary/90 font-medium">{lead.intake}</span>
                        </p>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/40 font-medium">
                          {lead.leadSource}
                        </span>
                      </td>

                      {/* Assigned Counsellor */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-foreground border border-border/50">
                            {lead.counsellorAvatar || lead.assignedCounsellor.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-xs font-medium text-foreground">{lead.assignedCounsellor}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <StatusBadge status={lead.status} />
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <PriorityBadge priority={lead.priority} />
                      </td>

                      {/* Next Follow-up */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                          <span className={lead.priority === "Urgent" ? "text-amber-400 font-medium" : "text-muted-foreground"}>
                            {lead.nextFollowUp}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick WhatsApp call button */}
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            title="Open WhatsApp Chat"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors"
                            title="Call Lead"
                          >
                            <Phone className="h-4 w-4" />
                          </a>

                          <Button variant="ghost" size="sm" asChild className="h-8 px-2.5 text-xs rounded-lg hover:text-primary">
                            <Link href={`/leads/${lead.id}`}>
                              View Profile
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
