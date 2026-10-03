"use client"

import * as React from "react"
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Phone,
  Building2,
  Plus,
  User,
  Trash2,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Appointment } from "@/lib/mock-data"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const STORAGE_KEY = "pathway_appointments"

function loadAppointments(): Appointment[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Appointment[]
  } catch {}
  return []
}

function saveAppointments(apts: Appointment[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apts))
  } catch {}
}

export function AppointmentsClientView() {
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [hydrated, setHydrated] = React.useState(false)
  const [viewMode, setViewMode] = React.useState<"month" | "week" | "day" | "list">("list")
  const [typeFilter, setTypeFilter] = React.useState("ALL")
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [newApt, setNewApt] = React.useState<Partial<Appointment>>({})

  // Load from localStorage on mount
  React.useEffect(() => {
    const stored = loadAppointments()
    setAppointments(stored)
    setHydrated(true)
  }, [])

  // Save to localStorage whenever appointments change (after hydration)
  React.useEffect(() => {
    if (!hydrated) return
    saveAppointments(appointments)
  }, [appointments, hydrated])

  const filteredAppts = React.useMemo(() => {
    return appointments.filter((apt) => {
      return typeFilter === "ALL" || apt.type === typeFilter
    })
  }, [appointments, typeFilter])

  const handleStatusChange = (id: string, newStatus: Appointment["status"]) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    )
    toast.success(`Appointment status updated to ${newStatus}`)
  }

  const handleDeleteAppointment = (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete this appointment for "${name}"?`)) return
    setAppointments((prev) => prev.filter((a) => a.id !== id))
    toast.success(`Appointment deleted`)
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newApt.studentName) return

    // Validate date format dd/mm/yyyy or yyyy-mm-dd
    const dateRaw = newApt.date || ""
    const timeRaw = newApt.time || ""

    if (!dateRaw || !timeRaw) {
      toast.error("Please enter both date and time")
      return
    }

    const apt: Appointment = {
      id: "apt-" + Date.now(),
      studentName: newApt.studentName,
      counsellor: newApt.counsellor || "Owner",
      date: dateRaw,
      time: timeRaw,
      type: (newApt.type as any) || "Initial counselling",
      status: "Scheduled",
      mode: (newApt.mode as any) || "Office In-Person",
      notes: newApt.notes || "",
    }
    setAppointments((prev) => [apt, ...prev])
    setShowAddModal(false)
    setNewApt({})
    toast.success(`Appointment booked for ${apt.studentName} on ${apt.date} at ${apt.time}`)
  }

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Appointments &amp; Counselling Schedule
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
              {appointments.length} Sessions
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Manage discovery consultations, university choice reviews, visa briefings, and parent meetings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Calendar view selector */}
          <div className="flex items-center rounded-xl bg-card border border-border/60 p-1">
            {(["list", "month", "week", "day"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  viewMode === mode
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-primary-foreground font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-primary/20"
          >
            <Plus className="h-4 w-4" /> Book Session
          </Button>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground font-medium outline-none"
          >
            <option value="ALL">All Session Types</option>
            <option value="Initial counselling">Initial counselling</option>
            <option value="Follow-up">Follow-up</option>
            <option value="University counselling">University counselling</option>
            <option value="Visa counselling">Visa counselling</option>
            <option value="Document review">Document review</option>
            <option value="Parent meeting">Parent meeting</option>
          </select>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Office In-Person
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-400" /> Zoom Video
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Phone Call
          </span>
        </div>
      </div>

      {/* Empty state */}
      {filteredAppts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted/40 flex items-center justify-center">
            <CalendarIcon className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">No appointments yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Click &ldquo;Book Session&rdquo; to schedule your first counselling appointment.
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            size="sm"
            className="bg-primary text-primary-foreground rounded-xl text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Book Session
          </Button>
        </div>
      )}

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppts.map((apt) => {
          const isDone = apt.status === "Completed"
          const isCancelled = apt.status === "Cancelled"

          return (
            <Card
              key={apt.id}
              className={`border transition-all duration-200 ${
                isDone
                  ? "border-border/40 bg-card/40 opacity-70"
                  : isCancelled
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-border/60 bg-card/75 hover:border-primary/40 shadow-sm"
              }`}
            >
              <CardContent className="p-5 space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-foreground leading-snug">{apt.studentName}</h3>
                    <p className="text-xs text-primary font-medium mt-0.5">{apt.type}</p>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground pt-1 border-t border-border/30">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                    <span className="font-semibold text-foreground">{apt.date} at {apt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {apt.mode === "Zoom Video" ? (
                      <Video className="h-3.5 w-3.5 text-blue-400" />
                    ) : apt.mode === "Phone Call" ? (
                      <Phone className="h-3.5 w-3.5 text-amber-400" />
                    ) : (
                      <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                    )}
                    <span>{apt.mode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Counsellor: <strong className="text-foreground">{apt.counsellor}</strong></span>
                  </div>
                </div>

                {apt.notes && (
                  <p className="text-[11px] text-muted-foreground/90 italic bg-muted/30 p-2.5 rounded-xl border border-border/40">
                    &ldquo;{apt.notes}&rdquo;
                  </p>
                )}

                {/* Actions */}
                <div className="pt-2 border-t border-border/30 flex items-center justify-between gap-2">
                  <select
                    value={apt.status}
                    onChange={(e) => handleStatusChange(apt.id, e.target.value as any)}
                    className="h-7 rounded-lg border border-border/50 bg-muted/40 px-2 text-[11px] text-foreground font-medium outline-none"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="No Show">No Show</option>
                  </select>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleStatusChange(apt.id, "Completed")}
                    className="h-7 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded-lg px-2"
                  >
                    Mark Done
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteAppointment(apt.id, apt.studentName)}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Appointment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Booking Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-2xl border-border/70 rounded-2xl">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle className="text-primary flex items-center gap-2 text-base">
                <CalendarIcon className="h-5 w-5" /> Book Counselling Appointment
              </DialogTitle>
              <DialogDescription>
                Schedule a consultation session in the office or on Zoom.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="aStudent" className="text-xs font-semibold">Student / Lead Name *</Label>
                <Input
                  id="aStudent"
                  required
                  placeholder="e.g. Aarav Mehta"
                  value={newApt.studentName || ""}
                  onChange={(e) => setNewApt({ ...newApt, studentName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="aDate" className="text-xs font-semibold">Date *</Label>
                  <Input
                    id="aDate"
                    type="text"
                    required
                    placeholder="e.g. 05 Oct 2026"
                    value={newApt.date || ""}
                    onChange={(e) => setNewApt({ ...newApt, date: e.target.value })}
                    className="font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">e.g. 05 Oct 2026 or 2026-10-05</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="aTime" className="text-xs font-semibold">Time *</Label>
                  <Input
                    id="aTime"
                    type="text"
                    required
                    placeholder="e.g. 11:30 AM"
                    value={newApt.time || ""}
                    onChange={(e) => setNewApt({ ...newApt, time: e.target.value })}
                    className="font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">e.g. 11:30 AM or 14:00</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="aType" className="text-xs font-semibold">Meeting Type</Label>
                  <select
                    id="aType"
                    className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs"
                    value={newApt.type || "Initial counselling"}
                    onChange={(e) => setNewApt({ ...newApt, type: e.target.value as any })}
                  >
                    <option value="Initial counselling">Initial counselling</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="University counselling">University counselling</option>
                    <option value="Visa counselling">Visa counselling</option>
                    <option value="Document review">Document review</option>
                    <option value="Parent meeting">Parent meeting</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="aMode" className="text-xs font-semibold">Format / Mode</Label>
                  <select
                    id="aMode"
                    className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs"
                    value={newApt.mode || "Office In-Person"}
                    onChange={(e) => setNewApt({ ...newApt, mode: e.target.value as any })}
                  >
                    <option value="Office In-Person">Office In-Person</option>
                    <option value="Zoom Video">Zoom Video</option>
                    <option value="Phone Call">Phone Call</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="aCounsellor" className="text-xs font-semibold">Assigned Counsellor</Label>
                <Input
                  id="aCounsellor"
                  placeholder="e.g. Owner"
                  value={newApt.counsellor || ""}
                  onChange={(e) => setNewApt({ ...newApt, counsellor: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="aNotes" className="text-xs font-semibold">Agenda / Discussion Notes</Label>
                <Input
                  id="aNotes"
                  placeholder="e.g. Review UK scholarship eligibility"
                  value={newApt.notes || ""}
                  onChange={(e) => setNewApt({ ...newApt, notes: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Confirm Booking
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
