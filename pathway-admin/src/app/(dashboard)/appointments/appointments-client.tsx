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
  Loader2,
  CheckCircle2,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
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
  const [viewMode, setViewMode] = React.useState<"list" | "month" | "week" | "day">("list")
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
        <Loader2 className="h-6 w-6 animate-spin text-orange-400" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#F8F5F1]">
              Appointments &amp; Schedule
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/15 text-[#FF8A35] text-xs font-bold border border-orange-500/30">
              {appointments.length} Consultations Booked
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#BDB0A4] mt-1">
            Manage discovery consultations, university choice reviews, visa briefings, and parent meetings.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Calendar view selector */}
          <div className="flex items-center rounded-xl bg-[#15100D] border border-white/[0.08] p-1">
            {(["list", "month", "week", "day"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  viewMode === mode
                    ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8A35] text-white shadow-md shadow-orange-950/40"
                    : "text-[#897B70] hover:text-[#F8F5F1]"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-[#FF6B00] to-[#FF8A35] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-orange-950/40 h-9 px-4"
          >
            <Plus className="h-4 w-4" /> Book Session
          </Button>
        </div>
      </div>

      {/* Filter and Mode Bar */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-4 backdrop-blur-md shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-xl border border-white/[0.08] bg-[#1D1510] px-3 text-xs text-[#F8F5F1] font-medium outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-[#1D1510]">All Session Types</option>
            <option value="Initial counselling" className="bg-[#1D1510]">Initial counselling</option>
            <option value="Follow-up" className="bg-[#1D1510]">Follow-up</option>
            <option value="University counselling" className="bg-[#1D1510]">University counselling</option>
            <option value="Visa counselling" className="bg-[#1D1510]">Visa counselling</option>
            <option value="Document review" className="bg-[#1D1510]">Document review</option>
            <option value="Parent meeting" className="bg-[#1D1510]">Parent meeting</option>
          </select>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#897B70]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Office In-Person
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sky-400" /> Zoom Video
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Phone Call
          </span>
        </div>
      </div>

      {/* Empty state */}
      {filteredAppts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center rounded-2xl border border-dashed border-white/[0.1] bg-[#15100D]/50">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-[#F8F5F1] text-sm">No appointments scheduled</p>
            <p className="text-xs text-[#897B70] mt-1 max-w-sm">
              Click &ldquo;Book Session&rdquo; to schedule a student discovery or visa counselling appointment.
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            size="sm"
            className="bg-gradient-to-r from-[#FF6B00] to-[#FF8A35] text-white rounded-xl text-xs font-semibold shadow-md"
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
            <div
              key={apt.id}
              className={`rounded-2xl border transition-all duration-200 p-5 space-y-3.5 backdrop-blur-md shadow-lg ${
                isDone
                  ? "border-white/[0.04] bg-[#15100D]/50 opacity-60"
                  : isCancelled
                  ? "border-rose-500/20 bg-rose-500/5 opacity-80"
                  : "border-white/[0.08] bg-[#15100D]/85 hover:border-orange-500/40 hover:bg-[#1D1510]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#F8F5F1] leading-snug">{apt.studentName}</h3>
                  <p className="text-xs text-orange-400 font-medium mt-0.5">{apt.type}</p>
                </div>
                <StatusBadge status={apt.status} />
              </div>

              <div className="space-y-1.5 text-xs text-[#BDB0A4] pt-2 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-3.5 w-3.5 text-orange-400" />
                  <span className="font-semibold text-[#F8F5F1]">{apt.date} at {apt.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  {apt.mode === "Zoom Video" ? (
                    <Video className="h-3.5 w-3.5 text-sky-400" />
                  ) : apt.mode === "Phone Call" ? (
                    <Phone className="h-3.5 w-3.5 text-amber-400" />
                  ) : (
                    <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                  <span>{apt.mode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-[#897B70]" />
                  <span>Counsellor: <strong className="text-[#F8F5F1]">{apt.counsellor}</strong></span>
                </div>
              </div>

              {apt.notes && (
                <p className="text-[11px] text-[#BDB0A4] italic bg-[#1D1510] p-2.5 rounded-xl border border-white/[0.06] leading-relaxed">
                  &ldquo;{apt.notes}&rdquo;
                </p>
              )}

              {/* Actions */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <select
                  value={apt.status}
                  onChange={(e) => handleStatusChange(apt.id, e.target.value as any)}
                  className="h-7 rounded-lg border border-white/[0.1] bg-[#1D1510] px-2 text-[11px] text-[#F8F5F1] font-medium outline-none cursor-pointer"
                >
                  <option value="Scheduled" className="bg-[#1D1510]">Scheduled</option>
                  <option value="Completed" className="bg-[#1D1510]">Completed</option>
                  <option value="Cancelled" className="bg-[#1D1510]">Cancelled</option>
                  <option value="No Show" className="bg-[#1D1510]">No Show</option>
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
                  className="h-7 w-7 p-0 text-[#897B70] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete Appointment"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Booking Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md bg-[#15100D] border border-white/[0.12] text-[#F8F5F1] rounded-2xl shadow-2xl">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle className="text-[#F8F5F1] flex items-center gap-2 text-base font-bold">
                <CalendarIcon className="h-5 w-5 text-[#FF6B00]" /> Book Counselling Appointment
              </DialogTitle>
              <DialogDescription className="text-xs text-[#897B70]">
                Schedule a consultation session in the office or on Zoom.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="aStudent" className="text-xs font-semibold text-[#BDB0A4]">Student / Lead Name *</Label>
                <Input
                  id="aStudent"
                  required
                  placeholder="e.g. Aarav Mehta"
                  value={newApt.studentName || ""}
                  onChange={(e) => setNewApt({ ...newApt, studentName: e.target.value })}
                  className="bg-[#1D1510] border-white/[0.1] text-xs text-[#F8F5F1] rounded-xl h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="aDate" className="text-xs font-semibold text-[#BDB0A4]">Date *</Label>
                  <Input
                    id="aDate"
                    type="text"
                    required
                    placeholder="e.g. 05 Oct 2026"
                    value={newApt.date || ""}
                    onChange={(e) => setNewApt({ ...newApt, date: e.target.value })}
                    className="font-mono bg-[#1D1510] border-white/[0.1] text-xs text-[#F8F5F1] rounded-xl h-9"
                  />
                  <p className="text-[10px] text-[#897B70]">e.g. 05 Oct 2026 or 2026-10-05</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="aTime" className="text-xs font-semibold text-[#BDB0A4]">Time *</Label>
                  <Input
                    id="aTime"
                    type="text"
                    required
                    placeholder="e.g. 11:30 AM"
                    value={newApt.time || ""}
                    onChange={(e) => setNewApt({ ...newApt, time: e.target.value })}
                    className="font-mono bg-[#1D1510] border-white/[0.1] text-xs text-[#F8F5F1] rounded-xl h-9"
                  />
                  <p className="text-[10px] text-[#897B70]">e.g. 11:30 AM or 14:00</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="aType" className="text-xs font-semibold text-[#BDB0A4]">Meeting Type</Label>
                  <select
                    id="aType"
                    className="w-full rounded-xl border border-white/[0.1] bg-[#1D1510] px-3 py-2 text-xs text-[#F8F5F1] outline-none cursor-pointer"
                    value={newApt.type || "Initial counselling"}
                    onChange={(e) => setNewApt({ ...newApt, type: e.target.value as any })}
                  >
                    <option value="Initial counselling" className="bg-[#1D1510]">Initial counselling</option>
                    <option value="Follow-up" className="bg-[#1D1510]">Follow-up</option>
                    <option value="University counselling" className="bg-[#1D1510]">University counselling</option>
                    <option value="Visa counselling" className="bg-[#1D1510]">Visa counselling</option>
                    <option value="Document review" className="bg-[#1D1510]">Document review</option>
                    <option value="Parent meeting" className="bg-[#1D1510]">Parent meeting</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="aMode" className="text-xs font-semibold text-[#BDB0A4]">Format / Mode</Label>
                  <select
                    id="aMode"
                    className="w-full rounded-xl border border-white/[0.1] bg-[#1D1510] px-3 py-2 text-xs text-[#F8F5F1] outline-none cursor-pointer"
                    value={newApt.mode || "Office In-Person"}
                    onChange={(e) => setNewApt({ ...newApt, mode: e.target.value as any })}
                  >
                    <option value="Office In-Person" className="bg-[#1D1510]">Office In-Person</option>
                    <option value="Zoom Video" className="bg-[#1D1510]">Zoom Video</option>
                    <option value="Phone Call" className="bg-[#1D1510]">Phone Call</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="aCounsellor" className="text-xs font-semibold text-[#BDB0A4]">Assigned Counsellor</Label>
                <Input
                  id="aCounsellor"
                  placeholder="e.g. Owner"
                  value={newApt.counsellor || ""}
                  onChange={(e) => setNewApt({ ...newApt, counsellor: e.target.value })}
                  className="bg-[#1D1510] border-white/[0.1] text-xs text-[#F8F5F1] rounded-xl h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="aNotes" className="text-xs font-semibold text-[#BDB0A4]">Agenda / Discussion Notes</Label>
                <Input
                  id="aNotes"
                  placeholder="e.g. Review UK scholarship eligibility"
                  value={newApt.notes || ""}
                  onChange={(e) => setNewApt({ ...newApt, notes: e.target.value })}
                  className="bg-[#1D1510] border-white/[0.1] text-xs text-[#F8F5F1] rounded-xl h-9"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAddModal(false)}
                className="text-xs text-[#897B70] hover:text-[#F8F5F1] rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#FF6B00] to-[#FF8A35] text-white text-xs font-semibold rounded-xl shadow-md"
              >
                Confirm Booking
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
