"use client"

import * as React from "react"
import {
  Landmark,
  Search,
  Filter,
  Plus,
  ExternalLink,
  Award,
  Globe,
  Clock,
  BookOpen,
  DollarSign,
  GraduationCap,
  Sparkles,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { INITIAL_UNIVERSITIES, University } from "@/lib/mock-data"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export function UniversitiesClientView() {
  const [universities, setUniversities] = React.useState<University[]>(INITIAL_UNIVERSITIES)
  const [search, setSearch] = React.useState("")
  const [countryFilter, setCountryFilter] = React.useState("ALL")
  const [typeFilter, setTypeFilter] = React.useState("ALL")
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [newUni, setNewUni] = React.useState<Partial<University>>({})

  const filteredUnis = React.useMemo(() => {
    return universities.filter((u) => {
      const matchSearch =
        search === "" ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.city.toLowerCase().includes(search.toLowerCase()) ||
        u.popularCourses.some(c => c.toLowerCase().includes(search.toLowerCase()))

      const matchCountry = countryFilter === "ALL" || u.country === countryFilter
      const matchType = typeFilter === "ALL" || u.type === typeFilter

      return matchSearch && matchCountry && matchType
    })
  }, [universities, search, countryFilter, typeFilter])

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUni.name) return
    const uni: University = {
      id: "uni-" + Date.now(),
      name: newUni.name || "",
      country: newUni.country || "United Kingdom",
      city: newUni.city || "",
      logo: (newUni.name || "").slice(0, 3).toUpperCase(),
      ranking: Number(newUni.ranking) || 50,
      popularCourses: newUni.popularCourses || ["Business", "Computer Science"],
      tuitionRange: newUni.tuitionRange || "£20,000 - £30,000",
      intakes: ["September", "January"],
      deadline: newUni.deadline || "Rolling",
      entryRequirements: newUni.entryRequirements || "60%+ in Bachelor's",
      englishRequirements: newUni.englishRequirements || "IELTS 6.5+",
      scholarships: newUni.scholarships || "Merit awards available",
      website: newUni.website || "https://example.edu",
      type: (newUni.type as any) || "Public Research"
    }
    setUniversities([uni, ...universities])
    setShowAddModal(false)
    setNewUni({})
    toast.success(`Added ${uni.name} to University Database`)
  }

  const handleDeleteUniversity = (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }
    setUniversities((prev) => prev.filter((u) => u.id !== id));
    toast.success(`University "${name}" deleted`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              University Database
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
              {universities.length} Institutions
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Browse partner and global universities, admission requirements, tuition fee ranges, and scholarship policies.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-primary-foreground font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Add University Profile
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="border-border/60 bg-card/75 backdrop-blur-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search universities by name, course, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-muted/30 border-border/50 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground font-medium outline-none"
              >
                <option value="ALL">All Countries</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground font-medium outline-none"
              >
                <option value="ALL">All Types</option>
                <option value="Russell Group">Russell Group</option>
                <option value="Ivy League / Tier 1">Ivy League / Tier 1</option>
                <option value="Go8 Australia">Go8 Australia</option>
                <option value="Public Research">Public Research</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* University Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUnis.map((uni) => (
          <Card
            key={uni.id}
            className="border-border/60 bg-card/75 backdrop-blur-md shadow-md hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
          >
            <CardContent className="p-6 space-y-4">
              {/* Header: Logo, Name, Ranking */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/40 flex items-center justify-center font-bold text-sm text-primary shrink-0 shadow-sm">
                    {uni.logo}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground leading-snug">{uni.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {uni.city}, {uni.country}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                    <Award className="h-3 w-3" /> #{uni.ranking} Global
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-1">{uni.type}</p>
                </div>
              </div>

              {/* Popular courses */}
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Popular Courses
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {uni.popularCourses.map((c) => (
                    <span key={c} className="text-xs px-2 py-0.5 rounded-md bg-muted/60 text-foreground border border-border/40">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Requirements & Info */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Tuition Range:</span>
                  <strong className="text-foreground">{uni.tuitionRange}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">English Requirement:</span>
                  <strong className="text-primary">{uni.englishRequirements}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Next Intake:</span>
                  <span className="text-foreground font-medium">{uni.intakes.join(", ")}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Application Deadline:</span>
                  <span className="text-amber-400 font-medium">{uni.deadline}</span>
                </div>
              </div>

              {/* Scholarships note */}
              {uni.scholarships && (
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs flex items-start gap-2 text-primary">
                  <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Scholarship Highlight: </span>
                    <span>{uni.scholarships}</span>
                  </div>
                </div>
              )}
            </CardContent>

            <div className="px-6 py-3.5 border-t border-border/40 bg-muted/20 flex items-center justify-between text-xs">
              <span className="text-muted-foreground text-[11px]">Entry: {uni.entryRequirements}</span>
              <div className="flex items-center gap-3">
                <a
                  href={uni.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold flex items-center gap-1 shrink-0"
                >
                  Official Site <ExternalLink className="h-3 w-3" />
                </a>
                <button
                  onClick={() => handleDeleteUniversity(uni.id, uni.name)}
                  className="p-1 rounded text-muted-foreground/60 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Delete University"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add University Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg bg-card/95 backdrop-blur-2xl border-border/70 rounded-2xl">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg text-primary flex items-center gap-2">
                <Landmark className="h-5 w-5" /> Add New University Profile
              </DialogTitle>
              <DialogDescription>
                Provide university admission requirements, tuition guidelines, and intake deadlines.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="uniName" className="text-xs">University Name *</Label>
                <Input
                  id="uniName"
                  required
                  placeholder="e.g. University of Edinburgh"
                  onChange={(e) => setNewUni({ ...newUni, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="uniCountry" className="text-xs">Country *</Label>
                  <select
                    id="uniCountry"
                    className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs"
                    onChange={(e) => setNewUni({ ...newUni, country: e.target.value })}
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="uniCity" className="text-xs">City *</Label>
                  <Input
                    id="uniCity"
                    required
                    placeholder="Edinburgh"
                    onChange={(e) => setNewUni({ ...newUni, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="uniRank" className="text-xs">Global Ranking</Label>
                  <Input
                    id="uniRank"
                    type="number"
                    placeholder="27"
                    onChange={(e) => setNewUni({ ...newUni, ranking: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="uniFees" className="text-xs">Tuition Range</Label>
                  <Input
                    id="uniFees"
                    placeholder="£24,000 - £32,000"
                    onChange={(e) => setNewUni({ ...newUni, tuitionRange: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="uniEnglish" className="text-xs">English Requirement</Label>
                <Input
                  id="uniEnglish"
                  placeholder="IELTS 6.5 - 7.0 overall"
                  onChange={(e) => setNewUni({ ...newUni, englishRequirements: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Save University
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
