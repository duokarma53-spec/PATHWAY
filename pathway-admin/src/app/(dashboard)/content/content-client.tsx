"use client"

import * as React from "react"
import {
  Layers,
  HelpCircle,
  Briefcase,
  Megaphone,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Star,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { createClient } from "@/lib/supabase/client"

type ContentCategory = "Service" | "Testimonial" | "FAQ" | "Announcement"

interface CMSItem {
  id: string
  title: string
  subtitle: string
  category: ContentCategory
  is_published: boolean
  updated_at: string
  created_at: string
}

const CATEGORY_ICONS: Record<ContentCategory, React.ReactNode> = {
  Service: <Briefcase className="h-3 w-3" />,
  Testimonial: <Star className="h-3 w-3" />,
  FAQ: <HelpCircle className="h-3 w-3" />,
  Announcement: <Megaphone className="h-3 w-3" />,
}

function formatUpdatedAt(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
  } catch {
    return ""
  }
}

export function ContentClientView({ defaultTab = "ALL" }: { defaultTab?: string }) {
  const supabase = createClient()
  const [items, setItems] = React.useState<CMSItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState(defaultTab)
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [newItem, setNewItem] = React.useState<{ title: string; subtitle: string; category: ContentCategory }>({
    title: "",
    subtitle: "",
    category: "Testimonial",
  })
  const [submitting, setSubmitting] = React.useState(false)

  const fetchItems = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("website_content")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching website content:", error)
        toast.error("Failed to load website content")
      } else {
        setItems(data || [])
      }
    } finally {
      setLoading(false)
    }
  }, [supabase])

  React.useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => activeTab === "ALL" || item.category === activeTab)
  }, [items, activeTab])

  const handleTogglePublish = async (id: string, current: boolean) => {
    const item = items.find(i => i.id === id)
    if (!item) return
    // Optimistic update
    setItems(prev => prev.map(i => i.id === id ? { ...i, is_published: !current } : i))

    const { error } = await supabase
      .from("website_content")
      .update({ is_published: !current })
      .eq("id", id)

    if (error) {
      // Revert
      setItems(prev => prev.map(i => i.id === id ? { ...i, is_published: current } : i))
      toast.error("Failed to update content status")
    } else {
      toast.success(`"${item.title}" ${!current ? "published to website" : "hidden from website"}`)
    }
  }

  const handleDelete = async (id: string) => {
    const item = items.find(i => i.id === id)
    setItems(prev => prev.filter(i => i.id !== id))

    const { error } = await supabase
      .from("website_content")
      .delete()
      .eq("id", id)

    if (error) {
      fetchItems() // Reload on failure
      toast.error("Failed to delete content item")
    } else {
      toast.success(`"${item?.title}" removed from website`)
    }
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.title.trim()) return
    setSubmitting(true)

    const { data, error } = await supabase
      .from("website_content")
      .insert({
        title: newItem.title.trim(),
        subtitle: newItem.subtitle.trim(),
        category: newItem.category,
        is_published: true,
      })
      .select()
      .single()

    setSubmitting(false)

    if (error) {
      toast.error("Failed to publish content: " + error.message)
    } else {
      setItems(prev => [data, ...prev])
      setShowAddModal(false)
      setNewItem({ title: "", subtitle: "", category: "Testimonial" })
      toast.success(`"${data.title}" published to website ✓`)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Website Content Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 text-xs font-bold border border-emerald-500/30">
              Live
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Publish testimonials, update FAQ answers, edit service descriptions, and change the announcement banner — all saved to the database and shown live on your website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchItems}
            className="h-9 w-9 rounded-xl"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-primary-foreground font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-primary/20"
          >
            <Plus className="h-4 w-4" /> Add Website Content
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-border/50 pb-2 overflow-x-auto custom-scrollbar">
        {(["ALL", "Service", "Testimonial", "FAQ", "Announcement"] as const).map((cat) => (
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

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-primary/40" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-muted/40 flex items-center justify-center">
            <Layers className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">No content yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Click &quot;Add Website Content&quot; to publish your first {activeTab === "ALL" ? "item" : activeTab.toLowerCase()}.
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            size="sm"
            className="bg-primary text-primary-foreground rounded-xl text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Content
          </Button>
        </div>
      )}

      {/* Content Cards */}
      {!loading && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className={`border transition-all ${
                item.is_published
                  ? "border-border/60 bg-card/75 hover:border-primary/40 shadow-sm"
                  : "border-border/30 bg-card/40 opacity-60"
              }`}
            >
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-bold uppercase tracking-wider">
                      {CATEGORY_ICONS[item.category]}
                      {item.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Updated {formatUpdatedAt(item.updated_at)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-foreground leading-snug">{item.title}</h3>
                  {item.subtitle && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.subtitle}</p>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-border/30 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleTogglePublish(item.id, item.is_published)}
                    className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                      item.is_published
                        ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {item.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    <span>{item.is_published ? "Published" : "Draft (Hidden)"}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Content Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-2xl border-border/70 rounded-2xl">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle className="text-primary flex items-center gap-2 text-base">
                <Layers className="h-5 w-5" /> Add Website Content
              </DialogTitle>
              <DialogDescription>
                This will be saved to the database and shown live on the public website.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="cmsCat" className="text-xs font-semibold">Content Type</Label>
                <select
                  id="cmsCat"
                  className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value as ContentCategory })}
                >
                  <option value="Testimonial">Testimonial — Student success story (shows on website)</option>
                  <option value="FAQ">FAQ — Frequently asked question + answer</option>
                  <option value="Service">Service — Service description card</option>
                  <option value="Announcement">Announcement — Top banner message</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cmsTitle" className="text-xs font-semibold">
                  {newItem.category === "Testimonial" ? "Student Quote *" :
                   newItem.category === "FAQ" ? "Question *" :
                   newItem.category === "Announcement" ? "Banner Text *" :
                   "Service Name *"}
                </Label>
                <Input
                  id="cmsTitle"
                  required
                  placeholder={
                    newItem.category === "Testimonial" ? "e.g. Pathway helped me secure my UK admit in just 3 weeks!" :
                    newItem.category === "FAQ" ? "e.g. What IELTS score do I need for UK universities?" :
                    newItem.category === "Announcement" ? "e.g. 🎓 Fall 2026 intakes open — Book free consultation!" :
                    "e.g. Visa Interview Preparation"
                  }
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cmsSubtitle" className="text-xs font-semibold">
                  {newItem.category === "Testimonial" ? "Student Name & Course" :
                   newItem.category === "FAQ" ? "Answer" :
                   newItem.category === "Announcement" ? "Sub-text (optional)" :
                   "Short Description"}
                </Label>
                <textarea
                  id="cmsSubtitle"
                  rows={3}
                  placeholder={
                    newItem.category === "Testimonial" ? "e.g. Ayesha Khan • MSc Data Science, University of Manchester" :
                    newItem.category === "FAQ" ? "e.g. Most UK universities require a minimum of 6.0–6.5 overall..." :
                    newItem.category === "Announcement" ? "e.g. Limited slots available. Contact us on WhatsApp." :
                    "e.g. Comprehensive 1-on-1 mock interviews simulating UKVI consular questions."
                  }
                  className="w-full rounded-md border border-input bg-background/50 p-2 text-xs text-foreground outline-none resize-none"
                  value={newItem.subtitle}
                  onChange={(e) => setNewItem({ ...newItem, subtitle: e.target.value })}
                />
              </div>

              <div className="rounded-xl bg-primary/8 border border-primary/20 p-3 flex items-start gap-2">
                <Eye className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-[11px] text-primary/80 leading-relaxed">
                  This will be saved to the database and <strong>published to your website immediately</strong>. You can toggle visibility anytime.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-primary text-primary-foreground"
              >
                {submitting ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Publishing...</>
                ) : (
                  "Publish to Website"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
