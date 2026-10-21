"use client"

import * as React from "react"
import {
  Activity,
  Clock,
  Search,
  Filter,
  ShieldCheck,
  Download,
  Trash2,
  RefreshCw,
  FileText,
  User,
  GraduationCap,
  CreditCard,
  FileCheck2,
  Calendar,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { INITIAL_ACTIVITY_LOGS, ActivityLog } from "@/lib/mock-data"
import { toast } from "sonner"

const EXTENDED_LOGS: ActivityLog[] = [
  ...INITIAL_ACTIVITY_LOGS,
  {
    id: "act-7",
    actor: "Rohan Varma",
    actorRole: "Counsellor",
    action: "changed Lead #1024 status from New → Contacted",
    entity: "Simran Kaur",
    entityCode: "LD-1024",
    timestamp: "Yesterday, 5:40 PM",
    type: "lead"
  },
  {
    id: "act-8",
    actor: "Administrator",
    actorRole: "Admin",
    action: "uploaded and approved Passport document",
    entity: "Karan Johal",
    entityCode: "STU-2038",
    timestamp: "2 days ago",
    type: "document"
  },
  {
    id: "act-9",
    actor: "Dev Patel",
    actorRole: "Visa Specialist",
    action: "marked CAS issuance complete for Manchester application",
    entity: "Zainab Al-Mansoor",
    entityCode: "APP-8012",
    timestamp: "2 days ago",
    type: "application"
  },
  {
    id: "act-10",
    actor: "Neha Sharma",
    actorRole: "Counsellor",
    action: "scheduled Parent Consultation for Australia study permit",
    entity: "Aditya Rao",
    entityCode: "LD-1046",
    timestamp: "3 days ago",
    type: "lead"
  }
]

const STORAGE_KEY = "pathway_audit_logs"
const CLEARED_KEY = "pathway_audit_logs_cleared"

const TYPE_CONFIG: Record<string, { label: string; badge: string; text: string; icon: any }> = {
  lead: { label: "Lead Intake", badge: "border-primary/40 bg-primary/10 text-primary", text: "text-primary", icon: User },
  student: { label: "Student", badge: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400", text: "text-emerald-400", icon: GraduationCap },
  application: { label: "Application", badge: "border-sky-500/40 bg-sky-500/10 text-sky-400", text: "text-sky-400", icon: FileText },
  document: { label: "Document", badge: "border-purple-500/40 bg-purple-500/10 text-purple-400", text: "text-purple-400", icon: FileCheck2 },
  payment: { label: "Payment", badge: "border-amber-500/40 bg-amber-500/10 text-amber-400", text: "text-amber-400", icon: CreditCard },
}

export function AuditLogsClientView() {
  const [logs, setLogs] = React.useState<ActivityLog[]>([])
  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState("ALL")
  const [loaded, setLoaded] = React.useState(false)

  // Initialize logs from localStorage or default
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const isCleared = localStorage.getItem(CLEARED_KEY) === "true"
    if (isCleared) {
      setLogs([])
    } else {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          setLogs(JSON.parse(saved))
        } catch {
          setLogs(EXTENDED_LOGS)
        }
      } else {
        setLogs(EXTENDED_LOGS)
      }
    }
    setLoaded(true)
  }, [])

  const saveLogs = (updated: ActivityLog[]) => {
    setLogs(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      if (updated.length === 0) {
        localStorage.setItem(CLEARED_KEY, "true")
      } else {
        localStorage.removeItem(CLEARED_KEY)
      }
    }
  }

  const handleClearAll = () => {
    if (logs.length === 0) return
    const confirmed = window.confirm(
      "Are you sure you want to clear all activity and audit logs? This will reset the trail for clean testing."
    )
    if (!confirmed) return

    saveLogs([])
    toast.success("Activity logs have been completely cleared")
  }

  const handleDeleteItem = (id: string) => {
    const updated = logs.filter((l) => l.id !== id)
    saveLogs(updated)
    toast.success("Activity log entry removed")
  }

  const handleRestoreSampleLogs = () => {
    saveLogs(EXTENDED_LOGS)
    toast.success("Sample activity logs restored")
  }

  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        search === "" ||
        log.actor.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.entity.toLowerCase().includes(search.toLowerCase()) ||
        log.entityCode.toLowerCase().includes(search.toLowerCase())

      const matchType = typeFilter === "ALL" || log.type === typeFilter

      return matchSearch && matchType
    })
  }, [logs, search, typeFilter])

  const handleExport = () => {
    if (logs.length === 0) {
      toast.error("No logs to export")
      return
    }
    const headers = "Time,Actor,Role,Action,Entity,EntityCode,Type\n"
    const rows = logs
      .map((l) => `"${l.timestamp}","${l.actor}","${l.actorRole}","${l.action.replace(/"/g, '""')}","${l.entity}","${l.entityCode}","${l.type}"`)
      .join("\n")
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `pathway_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Audit trail log downloaded as CSV")
  }

  // Count distinct actors
  const distinctActors = Array.from(new Set(logs.map((l) => l.actor))).length

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              System Audit &amp; Activity Logs
            </h1>
            <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold border border-primary/25 inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              {logs.length} Recorded Events
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Tamper-evident log of counselor actions, status transitions, fee records, and document verifications.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {logs.length > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10 text-xs flex items-center gap-1.5 transition-colors h-9"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear All Logs
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRestoreSampleLogs}
              className="rounded-xl border-white/10 hover:border-white/20 text-xs flex items-center gap-1.5 h-9"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Load Sample Logs
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="rounded-xl border-white/10 hover:border-white/20 bg-white/[0.03] text-foreground text-xs flex items-center gap-1.5 h-9 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-primary" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Audit Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#14100D]/80 border border-white/[0.08] backdrop-blur-xl">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Total Trail Entries</span>
          <p className="text-2xl font-bold text-foreground mt-1.5 font-mono">{logs.length}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Historical event logs</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#14100D]/80 border border-white/[0.08] backdrop-blur-xl">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Active Actors</span>
          <p className="text-2xl font-bold text-primary mt-1.5 font-mono">{distinctActors}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Counsellors & directors</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#14100D]/80 border border-white/[0.08] backdrop-blur-xl">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Log Status</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1.5 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-lg">Immutable</span>
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Encrypted activity ledger</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#14100D]/80 border border-white/[0.08] backdrop-blur-xl">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Filtered View</span>
          <p className="text-2xl font-bold text-sky-400 mt-1.5 font-mono">{filteredLogs.length}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Matches query</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#14100D]/75 border border-white/[0.08] backdrop-blur-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audit trail by actor, action description, student ID, or entity code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-black/40 border-white/[0.08] text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 rounded-xl border border-white/[0.08] bg-black/40 px-3 text-xs text-foreground font-medium outline-none hover:border-white/20 transition-colors"
          >
            <option value="ALL">All Event Types</option>
            <option value="lead">Leads &amp; Inquiries</option>
            <option value="student">Student Profiles</option>
            <option value="application">University Applications</option>
            <option value="document">Document Verifications</option>
            <option value="payment">Fee &amp; Payment Records</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <Card className="border-white/[0.08] bg-[#14100D]/85 backdrop-blur-xl shadow-xl overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="py-20 px-4 text-center flex flex-col items-center justify-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-muted-foreground">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {logs.length === 0 ? "Activity Log is Clean" : "No Matching Logs Found"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
              {logs.length === 0
                ? "The system audit trail has been cleared. New counselor actions, inquiries, document checks, and status changes will record here automatically."
                : "No log records match your current search and type filters. Try adjusting your query."}
            </p>
            {logs.length === 0 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRestoreSampleLogs}
                className="text-xs text-primary hover:text-primary/80 hover:bg-primary/10 rounded-xl mt-2"
              >
                Restore sample logs for demo
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSearch(""); setTypeFilter("ALL"); }}
                className="text-xs border-white/10 rounded-xl mt-2"
              >
                Reset Search
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-black/50 text-muted-foreground uppercase text-[11px] tracking-wider font-semibold">
                  <th className="py-3.5 px-5">Timestamp</th>
                  <th className="py-3.5 px-4">Actor & Role</th>
                  <th className="py-3.5 px-4">Action Narrative</th>
                  <th className="py-3.5 px-4">Target Entity</th>
                  <th className="py-3.5 px-4">Event Category</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredLogs.map((log) => {
                  const typeMeta = TYPE_CONFIG[log.type] || {
                    label: log.type,
                    badge: "border-white/10 bg-white/5 text-muted-foreground",
                    text: "text-muted-foreground",
                    icon: Activity
                  }
                  const TypeIcon = typeMeta.icon

                  return (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                          <span className="font-mono text-xs text-muted-foreground font-medium">
                            {log.timestamp}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-lg bg-[#271A12] border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                            {log.actor.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-foreground block group-hover:text-primary transition-colors text-xs">
                              {log.actor}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium">
                              {log.actorRole}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 min-w-[280px]">
                        <p className="text-xs text-foreground/90 leading-relaxed font-normal">
                          {log.action}
                        </p>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground text-xs">{log.entity}</span>
                          <span className="text-[10px] text-muted-foreground font-mono bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
                            {log.entityCode}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border inline-flex items-center gap-1.5 ${typeMeta.badge}`}>
                          <TypeIcon className="h-3 w-3" />
                          {typeMeta.label}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteItem(log.id)}
                          className="h-7 w-7 p-0 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete log entry"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
