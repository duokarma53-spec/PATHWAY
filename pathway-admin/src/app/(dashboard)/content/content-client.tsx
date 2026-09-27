"use client"

import * as React from "react"
import {
  Layers,
  Star,
  HelpCircle,
  Briefcase,
  Megaphone,
  Globe,
  Plus,
  Check,
  X,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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

interface CMSItem {
  id: string
  title: string
  subtitle: string
  category: "Service" | "Testimonial" | "FAQ" | "Announcement"
  published: boolean
  updatedAt: string
}

const INITIAL_CMS_ITEMS: CMSItem[] = [
  { id: "cms-1", title: "University Admissions Advisory", subtitle: "End-to-end guidance from profile evaluation to course shortlisting.", category: "Service", published: true, updatedAt: "Yesterday" },
  { id: "cms-2", title: "Student Visa Assistance", subtitle: "Financial documentation check and mock consular interview prep.", category: "Service", published: true, updatedAt: "3 days ago" },
  { id: "cms-3", title: "“Pathway secured my Manchester admit in 3 weeks!”", subtitle: "Zainab Al-Mansoor • MSc Genomic Medicine", category: "Testimonial", published: true, updatedAt: "Sept 20" },
  { id: "cms-4", title: "“Smooth Australian visa lodgement without hassle.”", subtitle: "Arjun Nair • University of Melbourne", category: "Testimonial", published: true, updatedAt: "Sept 18" },
  { id: "cms-5", title: "What is the minimum IELTS score required for UK Universities?", subtitle: "Most top universities require 6.5 overall with no sub-score below 6.0.", category: "FAQ", published: true, updatedAt: "Sept 15" },
  { id: "cms-6", title: "How much funds do I need to show for Canada SDS visa?", subtitle: "CAD $20,635 in Guaranteed Investment Certificate (GIC).", category: "FAQ", published: true, updatedAt: "Sept 12" },
  { id: "cms-7", title: "🎓 Fall 2026 Admissions Open — Book Free Consultation Now!", subtitle: "Top banner active across homepage and course pages.", category: "Announcement", published: true, updatedAt: "Sept 25" },
]

export function ContentClientView({ defaultTab = "ALL" }: { defaultTab?: string }) {
  const [items, setItems] = React.useState<CMSItem[]>(INITIAL_CMS_ITEMS)
  const [activeTab, setActiveTab] = React.useState(defaultTab)
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [newItem, setNewItem] = React.useState<Partial<CMSItem>>({})

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => activeTab === "ALL" || item.category === activeTab)
  }, [items, activeTab])

  const handleTogglePublish = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const newState = !item.published
        toast.success(`Content "${item.title}" ${newState ? "published" : "unpublished"}`)
        return { ...item, published: newState }
      })
    )
  }

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    toast.success("Item removed from website content")
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.title) return
    const created: CMSItem = {
      id: "cms-" + Date.now(),
      title: newItem.title,
      subtitle: newItem.subtitle || "",
      category: (newItem.category as any) || "Service",
      published: true,
      updatedAt: "Just now"
    }
    setItems([created, ...items])
    setShowAddModal(false)
    setNewItem({})
    toast.success("Website content item published")
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Website Content Management (CMS)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">
              Live Safe Mode
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Publish testimonials, update FAQ answers, edit service descriptions, and change the top announcement banner without touching code.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-primary-foreground font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Add Website Content
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-border/50 pb-2 overflow-x-auto custom-scrollbar">
        {["ALL", "Service", "Testimonial", "FAQ", "Announcement"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === cat
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat === "ALL" ? "All Sections" : cat + "s"}
          </button>
        ))}
      </div>

      {/* Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className={`border transition-all ${
              item.published
                ? "border-border/60 bg-card/75 hover:border-primary/40 shadow-sm"
                : "border-border/30 bg-card/40 opacity-60"
            }`}
          >
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Updated {item.updatedAt}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-foreground leading-snug">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.subtitle}</p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-border/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePublish(item.id)}
                    className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                      item.published
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {item.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    <span>{item.published ? "Published" : "Draft (Hidden)"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Content Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-2xl border-border/70 rounded-2xl">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle className="text-primary flex items-center gap-2 text-base">
                <Layers className="h-5 w-5" /> Add Website Content
              </DialogTitle>
              <DialogDescription>
                Publish new text copy to the public website without touching source code.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="cmsCat" className="text-xs">Category</Label>
                <select
                  id="cmsCat"
                  className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs"
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                >
                  <option value="Service">Service</option>
                  <option value="Testimonial">Testimonial</option>
                  <option value="FAQ">FAQ</option>
                  <option value="Announcement">Announcement Banner</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cmsTitle" className="text-xs">Headline / Title *</Label>
                <Input
                  id="cmsTitle"
                  required
                  placeholder="e.g. Visa Interview Preparation"
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cmsSubtitle" className="text-xs">Body Copy / Details</Label>
                <textarea
                  id="cmsSubtitle"
                  rows={3}
                  placeholder="e.g. Comprehensive 1-on-1 mock interviews simulating UKVI and US consular questions."
                  className="w-full rounded-md border border-input bg-background/50 p-2 text-xs text-foreground outline-none"
                  onChange={(e) => setNewItem({ ...newItem, subtitle: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Publish Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
