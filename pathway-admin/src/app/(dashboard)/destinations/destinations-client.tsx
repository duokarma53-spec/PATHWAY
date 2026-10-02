"use client"

import * as React from "react"
import {
  Compass,
  Plus,
  Landmark,
  ShieldCheck,
  Calendar,
  DollarSign,
  GraduationCap,
  Sparkles,
  BookOpen,
  MapPin,
  Clock,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { INITIAL_DESTINATIONS, Destination } from "@/lib/mock-data"
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

export function DestinationsClientView() {
  const [destinations, setDestinations] = React.useState<Destination[]>(INITIAL_DESTINATIONS)
  const [selectedDest, setSelectedDest] = React.useState<Destination>(INITIAL_DESTINATIONS[0])
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [newDest, setNewDest] = React.useState<Partial<Destination>>({})

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDest.name) return
    const dest: Destination = {
      id: "dest-" + Date.now(),
      name: newDest.name,
      code: newDest.code || newDest.name.slice(0, 2).toUpperCase(),
      flag: newDest.flag || "🌍",
      universitiesCount: 25,
      popularCourses: ["Computer Science", "Management", "Engineering"],
      visaInfo: newDest.visaInfo || "Standard Student Visa",
      intakeDates: "September / February",
      requirements: "60%+ in Bachelor's",
      estimatedTuition: "$18,000 - $30,000 / year",
      livingCosts: "$12,000 / year",
      scholarships: "Government & University merit scholarships",
      importantDeadlines: "Rolling"
    }
    setDestinations([...destinations, dest])
    setSelectedDest(dest)
    setShowAddModal(false)
    setNewDest({})
    toast.success(`Destination ${dest.name} added successfully`)
  }

  const handleDeleteDestination = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm(`Are you sure you want to delete destination "${name}"?`)) {
      return
    }
    const filtered = destinations.filter((d) => d.id !== id)
    setDestinations(filtered)
    if (selectedDest.id === id && filtered.length > 0) {
      setSelectedDest(filtered[0])
    }
    toast.success(`Destination "${name}" deleted`)
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Study Abroad Destinations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">
              {destinations.length} Key Regions
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Country knowledgebase: visa processes, admission timelines, cost of living, and university directories.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-primary-foreground font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Add Destination
        </Button>
      </div>

      {/* Country Selection Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            onClick={() => setSelectedDest(dest)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative group ${
              selectedDest.id === dest.id
                ? "bg-primary/10 border-primary/50 shadow-md ring-1 ring-primary/40"
                : "bg-card/75 border-border/60 hover:border-border hover:bg-card"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{dest.flag}</span>
              <button
                onClick={(e) => handleDeleteDestination(dest.id, dest.name, e)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                title="Delete Destination"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <h3 className="font-bold text-foreground text-sm truncate">{dest.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {dest.universitiesCount}+ Universities
            </p>
          </div>
        ))}
      </div>

      {/* Selected Country Deep-Dive Profile */}
      <Card className="border-border/60 bg-card/85 backdrop-blur-xl shadow-lg">
        <CardHeader className="border-b border-border/40 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{selectedDest.flag}</span>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                {selectedDest.name} Country Guide & Regulatory Info
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Primary admission intake: {selectedDest.intakeDates}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Top 3 Metric Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
              <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-primary" /> Estimated Tuition
              </span>
              <p className="text-base font-bold text-foreground mt-1">{selectedDest.estimatedTuition}</p>
            </div>
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
              <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-emerald-400" /> Living Costs
              </span>
              <p className="text-base font-bold text-foreground mt-1">{selectedDest.livingCosts}</p>
            </div>
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
              <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-400" /> Deadlines
              </span>
              <p className="text-base font-bold text-foreground mt-1">{selectedDest.importantDeadlines}</p>
            </div>
          </div>

          {/* Visa Guidelines */}
          <div className="p-5 rounded-2xl bg-violet-500/10 border border-violet-500/25 space-y-2">
            <h4 className="text-sm font-bold text-violet-400 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Student Visa & Immigration Framework
            </h4>
            <p className="text-xs md:text-sm text-foreground/90 leading-relaxed">
              {selectedDest.visaInfo}
            </p>
          </div>

          {/* Academic Entry Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" /> Admission Requirements
              </h4>
              <p className="text-xs text-foreground/90 leading-relaxed p-4 rounded-xl bg-muted/20 border border-border/40">
                {selectedDest.requirements}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" /> Scholarships & Bursaries
              </h4>
              <p className="text-xs text-foreground/90 leading-relaxed p-4 rounded-xl bg-muted/20 border border-border/40">
                {selectedDest.scholarships}
              </p>
            </div>
          </div>

          {/* Popular Courses */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-400" /> In-Demand Courses for International Students
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedDest.popularCourses.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1.5 rounded-xl bg-card border border-border/60 text-xs font-medium text-foreground shadow-sm"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Destination Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-2xl border-border/70 rounded-2xl">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle className="text-primary flex items-center gap-2 text-base">
                <Compass className="h-5 w-5" /> Add Country Destination
              </DialogTitle>
              <DialogDescription>
                Expand Pathway consultancy to a new country market.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="cName" className="text-xs">Country Name *</Label>
                <Input
                  id="cName"
                  required
                  placeholder="e.g. Germany"
                  onChange={(e) => setNewDest({ ...newDest, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cFlag" className="text-xs">Country Flag Emoji</Label>
                  <Input
                    id="cFlag"
                    placeholder="🇩🇪"
                    onChange={(e) => setNewDest({ ...newDest, flag: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cCode" className="text-xs">ISO Code</Label>
                  <Input
                    id="cCode"
                    placeholder="DE"
                    onChange={(e) => setNewDest({ ...newDest, code: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cVisa" className="text-xs">Visa Overview</Label>
                <Input
                  id="cVisa"
                  placeholder="e.g. National Student Visa with blocked account (€11,208)"
                  onChange={(e) => setNewDest({ ...newDest, visaInfo: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Save Destination
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
