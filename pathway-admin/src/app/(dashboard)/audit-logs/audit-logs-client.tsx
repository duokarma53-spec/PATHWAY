"use client"

import * as React from "react"
import { Activity, Clock, Search, Filter, ShieldCheck, Download } from "lucide-react"
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
    actor: "Hatim Patel",
    actorRole: "Super Admin",
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

export function AuditLogsClientView() {
  const [logs, setLogs] = React.useState<ActivityLog[]>(EXTENDED_LOGS)
  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState("ALL")

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
              Immutable Trail
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Tamper-evident record of all counselor actions, status transitions, fee records, and document verifications.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="rounded-xl border-border/70 text-xs flex items-center gap-1.5"
        >
          <Download className="h-3.5 w-3.5" /> Export Audit Trail
        </Button>
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
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30 text-muted-foreground uppercase text-[11px] tracking-wider font-semibold">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-3">Actor & Role</th>
                <th className="py-3 px-3">Action Narrative</th>
                <th className="py-3 px-3">Target Entity</th>
                <th className="py-3 px-4 text-right">Event Category</th>
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
                    <span className="text-[10px] text-primary">{log.actorRole}</span>
                  </td>

                  <td className="py-3.5 px-3 min-w-[240px] text-foreground">
                    {log.action}
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="font-semibold text-foreground">{log.entity}</span>
                    <span className="text-[10px] text-muted-foreground font-mono ml-1.5">({log.entityCode})</span>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted/70 text-foreground border border-border/40 capitalize">
                      {log.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
