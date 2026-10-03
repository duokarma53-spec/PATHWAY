"use client"

import * as React from "react"
import { Search, Users, GraduationCap, FileText, Landmark, CheckSquare, Calendar, ArrowRight, X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import {
  INITIAL_LEADS,
  INITIAL_STUDENTS,
  INITIAL_APPLICATIONS,
  INITIAL_UNIVERSITIES,
  INITIAL_TASKS,
  INITIAL_APPOINTMENTS
} from "@/lib/mock-data"
import { createClient } from "@/lib/supabase/client"

interface GlobalSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GlobalSearchDialog({ open, onOpenChange }: GlobalSearchDialogProps) {
  const [query, setQuery] = React.useState("")
  const [liveLeads, setLiveLeads] = React.useState<{ id: string; name: string; email: string; course: string; leadCode: string }[]>([])
  const router = useRouter()

  React.useEffect(() => {
    if (!open) return
    const supabase = createClient()
    supabase.from("leads").select("id, full_name, email, course, destination").then(({ data }) => {
      if (data) {
        setLiveLeads(
          data.map((r) => ({
            id: r.id,
            name: r.full_name || "Prospective Student",
            email: r.email || "",
            course: r.course || r.destination || "Higher Education",
            leadCode: `LD-${r.id ? r.id.replace(/-/g, "").substring(0, 4).toUpperCase() : "0000"}`,
          }))
        )
      }
    })
  }, [open])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onOpenChange])

  const cleanQuery = query.toLowerCase().trim()

  const matchedLeads = cleanQuery
    ? liveLeads.filter(l =>
        l.name.toLowerCase().includes(cleanQuery) ||
        l.email.toLowerCase().includes(cleanQuery) ||
        l.course.toLowerCase().includes(cleanQuery) ||
        l.leadCode.toLowerCase().includes(cleanQuery)
      ).slice(0, 3)
    : []

  const matchedStudents = cleanQuery
    ? INITIAL_STUDENTS.filter(s =>
        s.name.toLowerCase().includes(cleanQuery) ||
        s.email.toLowerCase().includes(cleanQuery) ||
        s.studentCode.toLowerCase().includes(cleanQuery) ||
        s.destination.toLowerCase().includes(cleanQuery)
      ).slice(0, 3)
    : []

  const matchedApplications = cleanQuery
    ? INITIAL_APPLICATIONS.filter(a =>
        a.university.toLowerCase().includes(cleanQuery) ||
        a.studentName.toLowerCase().includes(cleanQuery) ||
        a.course.toLowerCase().includes(cleanQuery) ||
        a.applicationCode.toLowerCase().includes(cleanQuery)
      ).slice(0, 3)
    : []

  const matchedUniversities = cleanQuery
    ? INITIAL_UNIVERSITIES.filter(u =>
        u.name.toLowerCase().includes(cleanQuery) ||
        u.country.toLowerCase().includes(cleanQuery) ||
        u.city.toLowerCase().includes(cleanQuery)
      ).slice(0, 3)
    : []

  const matchedTasks = cleanQuery
    ? INITIAL_TASKS.filter(t =>
        t.title.toLowerCase().includes(cleanQuery) ||
        t.entityName.toLowerCase().includes(cleanQuery)
      ).slice(0, 3)
    : []

  const hasResults =
    matchedLeads.length > 0 ||
    matchedStudents.length > 0 ||
    matchedApplications.length > 0 ||
    matchedUniversities.length > 0 ||
    matchedTasks.length > 0

  const handleSelect = (href: string) => {
    onOpenChange(false)
    setQuery("")
    router.push(href)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card/95 backdrop-blur-2xl border-border/60 shadow-2xl rounded-2xl">
        <div className="flex items-center px-4 py-3.5 border-b border-border/50 gap-3">
          <Search className="h-5 w-5 text-primary shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads, students, applications, universities, tasks... (e.g. 'Aarav', 'Manchester')"
            className="flex-1 bg-transparent text-sm md:text-base text-foreground placeholder:text-muted-foreground outline-none font-medium"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="text-[11px] font-mono bg-muted/60 text-muted-foreground px-2 py-0.5 rounded border border-border/40">
            ESC
          </span>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3 custom-scrollbar divide-y divide-border/20">
          {!cleanQuery && (
            <div className="py-10 text-center text-muted-foreground space-y-2">
              <Search className="h-8 w-8 mx-auto opacity-30 text-primary" />
              <p className="text-sm font-medium">Quick search across the entire consultancy CRM</p>
              <p className="text-xs text-muted-foreground/70">
                Try searching for student names, email addresses, university codes, or tasks
              </p>
            </div>
          )}

          {cleanQuery && !hasResults && (
            <div className="py-10 text-center text-muted-foreground">
              <p className="text-sm font-medium">No results found for &quot;{query}&quot;</p>
              <p className="text-xs mt-1 text-muted-foreground/70">Check for spelling or try searching by country or university.</p>
            </div>
          )}

          {/* Matched Leads */}
          {matchedLeads.length > 0 && (
            <div className="py-2.5">
              <div className="px-2 pb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                <Users className="h-3.5 w-3.5 text-primary" /> Leads ({matchedLeads.length})
              </div>
              <div className="space-y-1">
                {matchedLeads.map(l => (
                  <button
                    key={l.id}
                    onClick={() => handleSelect(`/leads/${l.id}`)}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-primary/10 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                        {l.name}
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted/70 text-muted-foreground font-mono">
                          {l.leadCode}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                          {l.status}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {l.course} • {l.preferredDestination} • {l.email}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Students */}
          {matchedStudents.length > 0 && (
            <div className="py-2.5">
              <div className="px-2 pb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                <GraduationCap className="h-3.5 w-3.5 text-emerald-400" /> Students ({matchedStudents.length})
              </div>
              <div className="space-y-1">
                {matchedStudents.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(`/students/${s.id}`)}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-500/10 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-foreground group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                        {s.name}
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted/70 text-muted-foreground font-mono">
                          {s.studentCode}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
                          {s.status}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {s.course} • {s.destination} • {s.email}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-emerald-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Applications */}
          {matchedApplications.length > 0 && (
            <div className="py-2.5">
              <div className="px-2 pb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                <FileText className="h-3.5 w-3.5 text-blue-400" /> Applications ({matchedApplications.length})
              </div>
              <div className="space-y-1">
                {matchedApplications.map(a => (
                  <button
                    key={a.id}
                    onClick={() => handleSelect(`/applications`)}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-500/10 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-foreground group-hover:text-blue-400 transition-colors flex items-center gap-2">
                        {a.university}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-medium">
                          {a.status}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {a.studentName} • {a.course} ({a.intake})
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-blue-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Universities */}
          {matchedUniversities.length > 0 && (
            <div className="py-2.5">
              <div className="px-2 pb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                <Landmark className="h-3.5 w-3.5 text-amber-400" /> Universities ({matchedUniversities.length})
              </div>
              <div className="space-y-1">
                {matchedUniversities.map(u => (
                  <button
                    key={u.id}
                    onClick={() => handleSelect(`/universities`)}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-500/10 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-foreground group-hover:text-amber-400 transition-colors flex items-center gap-2">
                        {u.name}
                        <span className="text-[10px] text-muted-foreground">#{u.ranking} Global</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {u.city}, {u.country} • {u.tuitionRange}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-amber-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Tasks */}
          {matchedTasks.length > 0 && (
            <div className="py-2.5">
              <div className="px-2 pb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                <CheckSquare className="h-3.5 w-3.5 text-purple-400" /> Tasks ({matchedTasks.length})
              </div>
              <div className="space-y-1">
                {matchedTasks.map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleSelect(`/tasks`)}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-500/10 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-foreground group-hover:text-purple-400 transition-colors flex items-center gap-2">
                        {t.title}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 font-medium">
                          {t.priority}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Assigned to {t.assignedStaff} • {t.entityName}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-purple-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
