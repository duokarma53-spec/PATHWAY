"use client"

import * as React from "react"
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Phone,
  Building2,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { INITIAL_APPOINTMENTS, Appointment } from "@/lib/mock-data"
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

export function AppointmentsClientView() {
  const [appointments, setAppointments] = React.useState<Appointment[]>(INITIAL_APPOINTMENTS)
  const [viewMode, setViewMode] = React.useState<"month" | "week" | "day" | "list">("list")
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [typeFilter, setTypeFilter] = React.useState("ALL")
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [newApt, setNewApt] = React.useState<Partial<Appointment>>({})

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

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newApt.studentName) return
    const apt: Appointment = {
      id: "apt-" + Date.now(),
      studentName: newApt.studentName,
      counsellor: newApt.counsellor || "Rohan Varma",
      date: newApt.date || new Date().toISOString().slice(0, 10),
      time: newApt.time || "11:00",
      type: (newApt.type as any) || "Initial counselling",
      status: "Scheduled",
      mode: (newApt.mode as any) || "Office In-Person",
      notes: newApt.notes || "Booked by counsellor."
    }
    setAppointments([apt, ...appointments])
    setShowAddModal(false)
    setNewApt({})
    toast.success("Appointment scheduled on calendar")
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Appointments & Counselling Schedule
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

      {/* Filter and stats row */}
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

      {/* Appointments List / Calendar Grid */}
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

            <div className="grid gap-3 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="aStudent" className="text-xs">Student / Lead Name *</Label>
                <Input
                  id="aStudent"
                  required
                  placeholder="e.g. Aarav Mehta"
                  onChange={(e) => setNewApt({ ...newApt, studentName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="aDate" className="text-xs">Date *</Label>
                  <Input
                    id="aDate"
                    type="date"
                    required
                    onChange={(e) => setNewApt({ ...newApt, date: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="aTime" className="text-xs">Time *</Label>
                  <Input
                    id="aTime"
                    type="time"
                    required
                    onChange={(e) => setNewApt({ ...newApt, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="aType" className="text-xs">Meeting Type</Label>
                  <select
                    id="aType"
                    className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs"
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
                  <Label htmlFor="aMode" className="text-xs">Format / Mode</Label>
                  <select
                    id="aMode"
                    className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs"
                    onChange={(e) => setNewApt({ ...newApt, mode: e.target.value as any })}
                  >
                    <option value="Office In-Person">Office In-Person</option>
                    <option value="Zoom Video">Zoom Video</option>
                    <option value="Phone Call">Phone Call</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="aNotes" className="text-xs">Agenda / Discussion Notes</Label>
                <Input
                  id="aNotes"
                  placeholder="e.g. Review UK scholarship eligibility"
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
