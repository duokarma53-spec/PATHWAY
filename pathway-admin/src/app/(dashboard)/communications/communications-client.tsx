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
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { INITIAL_LEADS, INITIAL_COMM_TEMPLATES } from "@/lib/mock-data"
import { toast } from "sonner"

const DEFAULT_RECIPIENT = {
  id: "",
  name: "Prospective Student",
  avatar: "PS",
  leadCode: "LD-0000",
  course: "Higher Education",
  preferredDestination: "Target Country",
  intake: "Upcoming Intake",
  assignedCounsellor: "Owner",
  phone: "+91",
  email: "student@example.com"
};

export function CommunicationsClientView() {
  const [selectedLead, setSelectedLead] = React.useState(INITIAL_LEADS[0] || DEFAULT_RECIPIENT)
  const [activeTab, setActiveTab] = React.useState<"templates" | "history">("templates")
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [composedMessage, setComposedMessage] = React.useState("")
  const [selectedChannel, setSelectedChannel] = React.useState<"whatsapp" | "email">("whatsapp")

  const handleApplyTemplate = (tpl: typeof INITIAL_COMM_TEMPLATES[0]) => {
    let replaced = tpl.body
      .replace(/{{name}}/g, selectedLead.name)
      .replace(/{{destination}}/g, selectedLead.preferredDestination)
      .replace(/{{course}}/g, selectedLead.course)
      .replace(/{{intake}}/g, selectedLead.intake)
      .replace(/{{counsellor}}/g, selectedLead.assignedCounsellor)
      .replace(/{{university}}/g, "Target University")

    setComposedMessage(replaced)
    toast.success(`Loaded template: ${tpl.name}`)
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success("Copied to clipboard")
  }

  const handleSend = () => {
    if (!composedMessage.trim()) return
    if (selectedChannel === "whatsapp") {
      const cleanPhone = selectedLead.phone.replace(/[^0-9]/g, "")
      const encodedMsg = encodeURIComponent(composedMessage)
      window.open(`https://wa.me/${cleanPhone}?text=${encodedMsg}`, "_blank")
      toast.success("Opened WhatsApp with prefilled message")
    } else {
      const subject = encodeURIComponent(`Pathway Advisory: ${selectedLead.course}`)
      const body = encodeURIComponent(composedMessage)
      window.open(`mailto:${selectedLead.email}?subject=${subject}&body=${body}`, "_blank")
      toast.success("Opened default mail client")
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Communication Center & Message Hub
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          WhatsApp click-to-chat, one-click email outreach, and pre-approved consultancy response templates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Contact Selector */}
        <Card className="border-border/60 bg-card/75 backdrop-blur-md">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-sm font-bold text-foreground">Select Recipient Student</CardTitle>
            <CardDescription className="text-xs">Choose a lead or student to personalize outreach.</CardDescription>
          </CardHeader>
          <CardContent className="p-3 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
            {INITIAL_LEADS.length === 0 ? (
              <p className="text-xs text-muted-foreground p-4 text-center">
                No leads found. Incoming inquiries will appear here for one-click messaging.
              </p>
            ) : (
              INITIAL_LEADS.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedLead.id === lead.id
                      ? "bg-primary/10 border-primary/40 shadow-sm"
                      : "bg-card border-border/40 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">{lead.name}</span>
                    <span className="text-[10px] text-primary font-mono">{lead.leadCode}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{lead.course}</p>
                  <p className="text-[10px] text-muted-foreground/70">{lead.phone} • {lead.preferredDestination}</p>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Right: Message Composer & Template Library */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target Student Header Bar */}
          <Card className="border-border/60 bg-card/85 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary text-sm">
                {selectedLead.avatar || selectedLead.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{selectedLead.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedLead.phone} • {selectedLead.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedChannel("whatsapp")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  selectedChannel === "whatsapp"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Phone className="h-3.5 w-3.5" /> WhatsApp
              </button>
              <button
                onClick={() => setSelectedChannel("email")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  selectedChannel === "email"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Mail className="h-3.5 w-3.5" /> Email
              </button>
            </div>
          </Card>

          {/* Templates Carousel / Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Pre-Approved Consultancy Templates
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {INITIAL_COMM_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleApplyTemplate(tpl)}
                  className="p-3 text-left rounded-xl bg-card border border-border/60 hover:border-primary/40 hover:bg-muted/20 transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      {tpl.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">{tpl.channel}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{tpl.subject}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Message Composer Area */}
          <Card className="border-border/60 bg-card/85 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Message Preview & Edit</span>
              {composedMessage && (
                <button
                  onClick={() => handleCopy(composedMessage, "preview")}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  {copiedId === "preview" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy Text
                </button>
              )}
            </div>

            <textarea
              value={composedMessage}
              onChange={(e) => setComposedMessage(e.target.value)}
              placeholder="Click any template above or type your message here to send to the student..."
              rows={8}
              className="w-full rounded-xl border border-border/70 bg-background/60 p-3.5 text-xs text-foreground placeholder:text-muted-foreground outline-none font-sans leading-relaxed focus:border-primary/50"
            />

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-muted-foreground">
                Integration format: {selectedChannel === "whatsapp" ? "WhatsApp API link" : "mailto dispatch"}
              </span>

              <Button
                onClick={handleSend}
                disabled={!composedMessage.trim()}
                className={`text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md ${
                  selectedChannel === "whatsapp"
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <Send className="h-3.5 w-3.5" />
                Dispatch via {selectedChannel === "whatsapp" ? "WhatsApp" : "Email"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
