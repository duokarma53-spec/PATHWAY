"use client"

import * as React from "react"
import { Activity, Clock, Search, Filter, ShieldCheck, Download, Trash2, RefreshCw } from "lucide-react"
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

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              System Audit & Activity Logs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">
              {logs.length} Entries
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Tamper-evident record of all counselor actions, status transitions, fee records, and document verifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {logs.length > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10 text-xs flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear All Logs
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRestoreSampleLogs}
              className="rounded-xl border-border/70 text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Load Sample Logs
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="rounded-xl border-border/70 text-xs flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="border-border/60 bg-card/75 backdrop-blur-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audit trail by actor, action, or student ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-muted/30 border-border/50 text-sm"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground font-medium outline-none"
            >
              <option value="ALL">All Event Types</option>
              <option value="lead">Leads & Inquiries</option>
              <option value="student">Student Profiles</option>
              <option value="application">University Applications</option>
              <option value="document">Document Verifications</option>
              <option value="payment">Fee & Payment Records</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Log Feed Table */}
      <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-lg overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="py-16 px-4 text-center flex flex-col items-center justify-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-muted/50 border border-border/70 flex items-center justify-center text-muted-foreground">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {logs.length === 0 ? "Activity Log is Clean" : "No Matching Logs Found"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
              {logs.length === 0
                ? "The system audit trail has been cleared. New counselor actions, inquiries, document checks, and status changes will record here automatically."
                : "No log records match your current search and type filters. Try adjusting the query."}
            </p>
            {logs.length === 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRestoreSampleLogs}
                className="text-xs text-primary hover:underline"
              >
                Restore sample logs for demo
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30 text-muted-foreground uppercase text-[11px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-3">Actor & Role</th>
                  <th className="py-3 px-3">Action Narrative</th>
                  <th className="py-3 px-3">Target Entity</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap text-muted-foreground font-mono">
                      {log.timestamp}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="font-bold text-foreground block">{log.actor}</span>
                      <span className="text-[10px] text-primary font-medium">{log.actorRole}</span>
                    </td>

                    <td className="py-3.5 px-3 min-w-[240px] text-foreground">
                      {log.action}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="font-semibold text-foreground">{log.entity}</span>
                      <span className="text-[10px] text-muted-foreground font-mono ml-1.5">({log.entityCode})</span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted/70 text-foreground border border-border/40 capitalize">
                        {log.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteItem(log.id)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Delete log entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
