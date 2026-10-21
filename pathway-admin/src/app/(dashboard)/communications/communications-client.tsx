"use client"

import * as React from "react"
import {
  MessageSquare,
  Phone,
  Mail,
  Copy,
  Send,
  Check,
  Search,
  User,
  Sparkles,
  ExternalLink,
  Clock,
  MessageCircle,
  Globe,
  FileText,
  AlertCircle,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { INITIAL_COMM_TEMPLATES, Lead } from "@/lib/mock-data"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

const DEFAULT_RECIPIENT: Lead = {
  id: "",
  name: "Prospective Student",
  firstName: "Prospective",
  lastName: "Student",
  avatar: "PS",
  leadCode: "LD-0000",
  course: "Higher Education",
  preferredDestination: "Target Country",
  intake: "Upcoming Intake",
  qualification: "Graduate",
  leadSource: "Website",
  assignedCounsellor: "Owner",
  status: "New",
  priority: "High",
  createdDate: new Date().toISOString().split("T")[0],
  lastContacted: "Not yet",
  nextFollowUp: "To be scheduled",
  notesCount: 0,
  phone: "+91",
  email: "student@example.com"
};

export function CommunicationsClientView() {
  const [leadsList, setLeadsList] = React.useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = React.useState<Lead>(DEFAULT_RECIPIENT)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [channelFilter, setChannelFilter] = React.useState<"all" | "phone" | "email">("all")
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [composedMessage, setComposedMessage] = React.useState("")
  const [selectedChannel, setSelectedChannel] = React.useState<"whatsapp" | "email">("whatsapp")
  const [activeTemplateId, setActiveTemplateId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const supabase = createClient()
    async function loadRealLeads() {
      try {
        const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false })
        if (data && data.length > 0) {
          const mapped: Lead[] = data.map((r) => {
            const codeNum = r.id ? r.id.replace(/-/g, "").substring(0, 4).toUpperCase() : "1001";
            const nameParts = (r.full_name || "Prospective Student").trim().split(" ");
            return {
              id: r.id,
              leadCode: `LD-${codeNum}`,
              firstName: nameParts[0] || "Prospective",
              lastName: nameParts.slice(1).join(" ") || "Student",
              name: r.full_name || "Prospective Student",
              email: r.email || "",
              phone: r.phone || "",
              preferredDestination: r.destination || "United Kingdom",
              course: r.course || r.qualification || "Higher Education",
              intake: r.intake || "Upcoming",
              qualification: r.qualification || "Graduate",
              status: "New",
              priority: "High",
              leadSource: "Website",
              assignedCounsellor: "Owner",
              createdDate: r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : "",
              lastContacted: "Pending",
              nextFollowUp: "Pending",
              notesCount: 0,
            }
          })
          setLeadsList(mapped)
          setSelectedLead(mapped[0])
        }
      } catch (err) {
        console.debug("Failed to load real leads for comms:", err)
      }
    }
    loadRealLeads()
  }, [])

  const handleApplyTemplate = (tpl: typeof INITIAL_COMM_TEMPLATES[0]) => {
    setActiveTemplateId(tpl.id)
    const replaced = tpl.body
      .replace(/{{name}}/g, selectedLead.name || "Student")
      .replace(/{{destination}}/g, selectedLead.preferredDestination || "Abroad")
      .replace(/{{course}}/g, selectedLead.course || "your target program")
      .replace(/{{intake}}/g, selectedLead.intake || "Upcoming intake")
      .replace(/{{counsellor}}/g, selectedLead.assignedCounsellor || "Admissions Team")
      .replace(/{{university}}/g, "Target University")

    setComposedMessage(replaced)
    if (tpl.channel.toLowerCase().includes("whatsapp") && !tpl.channel.toLowerCase().includes("email")) {
      setSelectedChannel("whatsapp")
    } else if (tpl.channel.toLowerCase().includes("email") && !tpl.channel.toLowerCase().includes("whatsapp")) {
      setSelectedChannel("email")
    }
    toast.success(`Loaded template: ${tpl.name}`)
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success("Copied to clipboard")
  }

  const handleInsertTag = (tag: string) => {
    let value = tag;
    if (tag === "{{name}}") value = selectedLead.name;
    if (tag === "{{course}}") value = selectedLead.course;
    if (tag === "{{destination}}") value = selectedLead.preferredDestination;
    if (tag === "{{intake}}") value = selectedLead.intake;
    if (tag === "{{counsellor}}") value = selectedLead.assignedCounsellor;
    setComposedMessage((prev) => prev + (prev.length && !prev.endsWith(" ") ? " " : "") + value);
  }

  const handleSend = () => {
    if (!composedMessage.trim()) {
      toast.error("Please enter or select a message before dispatching");
      return;
    }

    if (selectedChannel === "whatsapp") {
      const cleanPhone = (selectedLead.phone || "").replace(/[^0-9]/g, "")
      if (!cleanPhone) {
        toast.error("Selected student does not have a valid phone number for WhatsApp dispatch")
        return
      }
      const encodedMsg = encodeURIComponent(composedMessage)
      window.open(`https://wa.me/${cleanPhone}?text=${encodedMsg}`, "_blank")
      toast.success("Opened WhatsApp with prefilled message")
    } else {
      if (!selectedLead.email || !selectedLead.email.includes("@")) {
        toast.error("Selected student does not have a valid email address on file")
        return
      }
      const subject = encodeURIComponent(`Pathway Advisory: ${selectedLead.course || "Education Consultation"}`)
      const body = encodeURIComponent(composedMessage)
      window.open(`mailto:${selectedLead.email}?subject=${subject}&body=${body}`, "_blank")
      toast.success("Opened default mail client")
    }
  }

  // Filter recipients
  const filteredLeads = leadsList.filter((lead) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      lead.name.toLowerCase().includes(q) ||
      lead.phone.includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.course.toLowerCase().includes(q) ||
      lead.preferredDestination.toLowerCase().includes(q)

    const matchesChannel =
      channelFilter === "all" ||
      (channelFilter === "phone" && lead.phone && lead.phone !== "Not specified") ||
      (channelFilter === "email" && lead.email && lead.email.includes("@"))

    return matchesSearch && matchesChannel
  })

  const hasPhone = Boolean(selectedLead.phone && selectedLead.phone !== "Not specified" && selectedLead.phone !== "+91");
  const hasEmail = Boolean(selectedLead.email && selectedLead.email.includes("@"));

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#F8F5F1]">
              Communications Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/15 text-[#FF8A35] text-xs font-bold border border-orange-500/30 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Live Dispatch
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#BDB0A4] mt-1">
            WhatsApp click-to-chat, one-click email outreach, and pre-approved consultancy response templates.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 font-semibold">
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp API Ready
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1.5 font-semibold">
            <Mail className="h-3.5 w-3.5" /> Mailto Ready
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 of 12 cols): Recipient Selector */}
        <div className="lg:col-span-5 rounded-2xl bg-[#15100D]/85 border border-white/[0.08] backdrop-blur-md shadow-xl flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="p-4 border-b border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#F8F5F1]">Select Recipient Student</h3>
                <p className="text-[11px] text-[#897B70]">Pick a candidate to personalize messaging</p>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#271A12] border border-orange-500/20 font-bold text-[#FF8A35]">
                {filteredLeads.length} Available
              </span>
            </div>

            {/* Recipient Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#897B70]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, phone, or course..."
                className="w-full h-8 pl-8 pr-3 rounded-xl bg-[#1D1510] border border-white/[0.08] text-xs text-[#F8F5F1] placeholder:text-[#897B70] outline-none focus:border-orange-500/50"
              />
            </div>

            {/* Quick Channel Filters */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <button
                onClick={() => setChannelFilter("all")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  channelFilter === "all"
                    ? "bg-[#271A12] text-[#FF8A35] border border-orange-500/30"
                    : "text-[#897B70] hover:text-[#F8F5F1]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setChannelFilter("phone")}
                className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                  channelFilter === "phone"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "text-[#897B70] hover:text-[#F8F5F1]"
                }`}
              >
                <Phone className="h-3 w-3" /> Has Phone
              </button>
              <button
                onClick={() => setChannelFilter("email")}
                className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                  channelFilter === "email"
                    ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                    : "text-[#897B70] hover:text-[#F8F5F1]"
                }`}
              >
                <Mail className="h-3 w-3" /> Has Email
              </button>
            </div>
          </div>

          {/* Recipient List with Fixed Scroll Area */}
          <div className="p-3 space-y-2 max-h-[580px] overflow-y-auto custom-scrollbar flex-1">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-8 px-4 text-xs text-[#897B70]">
                No students match your filter.
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const isSelected = selectedLead.id === lead.id
                return (
                  <button
                    key={lead.id}
                    onClick={() => {
                      setSelectedLead(lead)
                      // If active template, refresh it with new lead
                      if (activeTemplateId) {
                        const tpl = INITIAL_COMM_TEMPLATES.find((t) => t.id === activeTemplateId)
                        if (tpl) handleApplyTemplate(tpl)
                      }
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-150 ${
                      isSelected
                        ? "bg-[#271A12] border-orange-500/50 shadow-md shadow-orange-950/20"
                        : "bg-[#1D1510]/60 border-white/[0.06] hover:bg-[#1D1510] hover:border-white/[0.12]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${
                            isSelected
                              ? "bg-orange-500/20 text-[#FF8A35] border border-orange-500/40"
                              : "bg-[#271A12] text-[#BDB0A4]"
                          }`}
                        >
                          {lead.avatar || lead.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-xs text-[#F8F5F1] truncate">{lead.name}</span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-black/40 text-orange-400 shrink-0">
                        {lead.leadCode}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#BDB0A4] mt-1.5 truncate flex items-center gap-1.5">
                      <span className="truncate">{lead.course}</span>
                      <span className="text-[#897B70]">•</span>
                      <span className="text-[#897B70] shrink-0">{lead.preferredDestination}</span>
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-[#897B70] mt-1">
                      <span className="font-mono">{lead.phone || "No phone"}</span>
                      <div className="flex items-center gap-1.5">
                        {lead.phone && lead.phone !== "Not specified" && (
                          <MessageCircle className="h-3 w-3 text-emerald-400" />
                        )}
                        {lead.email && lead.email.includes("@") && (
                          <Mail className="h-3 w-3 text-sky-400" />
                        )}
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column (7 of 12 cols): Active Communication Workspace */}
        <div className="lg:col-span-7 space-y-5">
          {/* Target Student Header Bar */}
          <div className="rounded-2xl bg-[#15100D]/85 border border-white/[0.08] p-5 backdrop-blur-md shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-[#271A12] border border-orange-500/30 flex items-center justify-center font-extrabold text-[#FF8A35] text-base shrink-0">
                  {selectedLead.avatar || selectedLead.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-[#F8F5F1]">{selectedLead.name}</h3>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#271A12] text-[#FF8A35] border border-orange-500/20">
                      {selectedLead.leadCode}
                    </span>
                  </div>
                  <p className="text-xs text-[#BDB0A4] mt-0.5 flex flex-wrap items-center gap-2">
                    <span>{selectedLead.course}</span>
                    <span className="text-[#897B70]">•</span>
                    <span className="text-orange-400 font-medium">{selectedLead.preferredDestination}</span>
                    <span className="text-[#897B70]">•</span>
                    <span className="font-mono">{selectedLead.phone}</span>
                  </p>
                </div>
              </div>

              {/* Channel Selector Pills */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedChannel("whatsapp")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    selectedChannel === "whatsapp"
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 border border-emerald-400/40"
                      : "bg-[#1D1510] text-[#BDB0A4] hover:text-[#F8F5F1] border border-white/[0.08]"
                  }`}
                >
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedChannel("email")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    selectedChannel === "email"
                      ? "bg-sky-500 text-white shadow-lg shadow-sky-950/40 border border-sky-400/40"
                      : "bg-[#1D1510] text-[#BDB0A4] hover:text-[#F8F5F1] border border-white/[0.08]"
                  }`}
                >
                  <Mail className="h-3.5 w-3.5" /> Email
                </button>
              </div>
            </div>

            {/* Validation warnings */}
            {selectedChannel === "whatsapp" && !hasPhone && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-2 text-xs text-amber-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>Notice: This lead does not have a confirmed phone number for direct WhatsApp dispatch.</span>
              </div>
            )}
            {selectedChannel === "email" && !hasEmail && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-2 text-xs text-amber-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>Notice: This lead does not have a verified email address for mailto dispatch.</span>
              </div>
            )}
          </div>

          {/* Templates Carousel / Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F8F5F1] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#FF8A35]" /> Pre-Approved Consultancy Templates
              </span>
              <span className="text-[11px] text-[#897B70]">Click any template to auto-fill</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {INITIAL_COMM_TEMPLATES.map((tpl) => {
                const isActive = activeTemplateId === tpl.id
                return (
                  <button
                    key={tpl.id}
                    onClick={() => handleApplyTemplate(tpl)}
                    className={`p-3.5 text-left rounded-xl border transition-all space-y-1.5 group ${
                      isActive
                        ? "bg-[#271A12] border-orange-500/50 shadow-md shadow-orange-950/20"
                        : "bg-[#15100D]/80 border-white/[0.08] hover:border-orange-500/30 hover:bg-[#1D1510]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F8F5F1] group-hover:text-[#FF8A35] transition-colors">
                        {tpl.name}
                      </span>
                      <span className="text-[10px] text-[#897B70] font-mono px-1.5 py-0.5 rounded bg-black/40">
                        {tpl.channel}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#BDB0A4] line-clamp-1">{tpl.subject}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Message Composer Area */}
          <div className="rounded-2xl bg-[#15100D]/85 border border-white/[0.08] p-5 space-y-4 backdrop-blur-md shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#F8F5F1]">Message Editor & Preview</span>
                <p className="text-[11px] text-[#897B70]">Customise greeting, documents list, or meeting notes</p>
              </div>

              {composedMessage && (
                <button
                  onClick={() => handleCopy(composedMessage, "preview")}
                  className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 font-medium"
                >
                  {copiedId === "preview" ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy Text
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Quick Tag Insert Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-[#897B70] text-[10px] uppercase font-semibold mr-1">Insert:</span>
              {["{{name}}", "{{course}}", "{{destination}}", "{{intake}}", "{{counsellor}}"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleInsertTag(tag)}
                  className="px-2 py-0.5 rounded-md bg-[#1D1510] hover:bg-[#271A12] text-[#BDB0A4] hover:text-[#FF8A35] border border-white/[0.06] font-mono transition-colors"
                >
                  +{tag.replace(/[{}]/g, "")}
                </button>
              ))}
            </div>

            <textarea
              value={composedMessage}
              onChange={(e) => setComposedMessage(e.target.value)}
              placeholder="Click any template above or type your personalized message here to dispatch to the student..."
              rows={8}
              className="w-full rounded-xl border border-white/[0.1] bg-[#1D1510] p-4 text-xs text-[#F8F5F1] placeholder:text-[#897B70] outline-none font-sans leading-relaxed focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 custom-scrollbar"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
              <div className="text-[11px] text-[#897B70]">
                {composedMessage.length} characters • {composedMessage.split(/\s+/).filter(Boolean).length} words
              </div>

              <Button
                onClick={handleSend}
                disabled={!composedMessage.trim()}
                className={`text-xs font-bold rounded-xl flex items-center gap-2 h-10 px-5 shadow-lg transition-all ${
                  selectedChannel === "whatsapp"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sky-950/40"
                }`}
              >
                {selectedChannel === "whatsapp" ? (
                  <>
                    <MessageCircle className="h-4 w-4" />
                    Dispatch via WhatsApp
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Dispatch via Email Client
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
