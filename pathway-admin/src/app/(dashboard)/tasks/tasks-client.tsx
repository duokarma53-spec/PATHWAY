"use client"

import * as React from "react"
import {
  CheckSquare,
  Search,
  Filter,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Phone,
  MessageCircle,
  Mail,
  User,
  AlertTriangle,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { PriorityBadge } from "@/components/ui/status-badge"
import { INITIAL_TASKS, CRMTask } from "@/lib/mock-data"
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

export function TasksClientView({ defaultCategory }: { defaultCategory?: string }) {
  const [tasks, setTasks] = React.useState<CRMTask[]>(INITIAL_TASKS)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("ALL")
  const [priorityFilter, setPriorityFilter] = React.useState("ALL")
  const [staffFilter, setStaffFilter] = React.useState("ALL")
  const [categoryFilter, setCategoryFilter] = React.useState(defaultCategory || "ALL")
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [newTask, setNewTask] = React.useState<Partial<CRMTask>>({})

  const filteredTasks = React.useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch =
        search === "" ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.entityName.toLowerCase().includes(search.toLowerCase())

      const matchStatus = statusFilter === "ALL" || t.status === statusFilter
      const matchPriority = priorityFilter === "ALL" || t.priority === priorityFilter
      const matchStaff = staffFilter === "ALL" || t.assignedStaff === staffFilter
      const matchCategory = categoryFilter === "ALL" || t.category === categoryFilter

      return matchSearch && matchStatus && matchPriority && matchStaff && matchCategory
    })
  }, [tasks, search, statusFilter, priorityFilter, staffFilter, categoryFilter])

  const overdueCount = tasks.filter((t) => t.status === "Overdue").length

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t
        const newStatus = t.status === "Completed" ? "Pending" : "Completed"
        toast.success(`Task marked as ${newStatus}`)
        return { ...t, status: newStatus }
      })
    )
  }

  const handleDeleteTask = (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete task "${title}"?`)) {
      return
    }
    setTasks((prev) => prev.filter((t) => t.id !== id))
    toast.success(`Task "${title}" deleted`)
  }

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title) return
    const task: CRMTask = {
      id: "task-" + Date.now(),
      title: newTask.title,
      category: (newTask.category as any) || "Call follow-up",
      entityName: newTask.entityName || "Prospective Student",
      entityType: "Lead",
      assignedStaff: newTask.assignedStaff || "Rohan Varma",
      dueDate: newTask.dueDate || new Date(Date.now() + 86400000).toISOString(),
      priority: (newTask.priority as any) || "Medium",
      status: "Pending",
      notes: newTask.notes || ""
    }
    setTasks([task, ...tasks])
    setShowAddModal(false)
    setNewTask({})
    toast.success("Task scheduled successfully")
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {defaultCategory ? "Client Follow-ups & Reminders" : "CRM Tasks & Staff Workflows"}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30">
              {tasks.length} Action Items
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Follow-up reminders, document requests, application deadlines, and counsellor to-dos.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-primary-foreground font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Create Task
        </Button>
      </div>

      {/* Overdue Alert Banner (if any) */}
      {overdueCount > 0 && (
        <div className="p-4 rounded-2xl bg-destructive/15 border border-destructive/40 flex items-center justify-between gap-4 animate-in fade-in-50">
          <div className="flex items-center gap-3 text-destructive">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <div>
              <p className="text-xs md:text-sm font-bold">
                {overdueCount} Overdue Follow-up Task{overdueCount > 1 ? "s" : ""} Require Immediate Attention
              </p>
              <p className="text-[11px] text-destructive/80 mt-0.5">
                Delaying follow-ups reduces student conversion probability. Reach out to the assigned counsellor.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setStatusFilter("Overdue")}
            className="text-xs border-destructive/40 text-destructive hover:bg-destructive/20 rounded-xl shrink-0"
          >
            Show Overdue Only
          </Button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card className="border-border/60 bg-card/75 backdrop-blur-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks by title, lead name or student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-muted/30 border-border/50 text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground font-medium outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground font-medium outline-none"
              >
                <option value="ALL">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={staffFilter}
                onChange={(e) => setStaffFilter(e.target.value)}
                className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground font-medium outline-none"
              >
                <option value="ALL">All Staff</option>
                <option value="Rohan Varma">Rohan Varma</option>
                <option value="Neha Sharma">Neha Sharma</option>
                <option value="Dev Patel">Dev Patel</option>
              </select>

              {(search || statusFilter !== "ALL" || priorityFilter !== "ALL" || staffFilter !== "ALL") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch("")
                    setStatusFilter("ALL")
                    setPriorityFilter("ALL")
                    setStaffFilter("ALL")
                  }}
                  className="h-9 text-xs text-muted-foreground"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card className="border-border/60 bg-card/60 p-12 text-center text-muted-foreground">
            <CheckCircle2 className="h-10 w-10 mx-auto opacity-30 text-emerald-400 mb-2" />
            <p className="text-sm font-semibold">No tasks found matching your filter criteria.</p>
          </Card>
        ) : (
          filteredTasks.map((t) => {
            const isCompleted = t.status === "Completed"
            const isOverdue = t.status === "Overdue"

            return (
              <Card
                key={t.id}
                className={`border transition-all duration-200 ${
                  isOverdue
                    ? "border-destructive/40 bg-destructive/5 hover:border-destructive"
                    : isCompleted
                    ? "border-border/40 bg-card/40 opacity-75"
                    : "border-border/60 bg-card/75 hover:border-border hover:shadow-sm"
                }`}
              >
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Checkbox & Task details */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleTask(t.id)}
                      className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isCompleted
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-border/70 hover:border-primary bg-muted/40"
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm font-semibold truncate ${
                            isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {t.title}
                        </span>
                        <PriorityBadge priority={t.priority} />
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/40 font-medium">
                          {t.category}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>
                          Target: <strong className="text-foreground">{t.entityName}</strong> ({t.entityType})
                        </span>
                        <span>•</span>
                        <span>Assigned to: <strong className="text-foreground">{t.assignedStaff}</strong></span>
                        {t.notes && (
                          <>
                            <span>•</span>
                            <span className="italic text-primary/80 truncate max-w-xs">&ldquo;{t.notes}&rdquo;</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Due Date & Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      <div
                        className={`text-xs font-semibold flex items-center gap-1 ${
                          isOverdue ? "text-destructive font-bold" : "text-muted-foreground"
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(t.dueDate).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                      {isOverdue && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-destructive">
                          OVERDUE
                        </span>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleTask(t.id)}
                      className="h-8 text-xs rounded-xl border-border/60 hover:bg-muted/60"
                    >
                      {isCompleted ? "Reopen" : "Done"}
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTask(t.id, t.title)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Add Task Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-2xl border-border/70 rounded-2xl">
          <form onSubmit={handleAddTaskSubmit}>
            <DialogHeader>
              <DialogTitle className="text-primary flex items-center gap-2 text-base">
                <CheckSquare className="h-5 w-5" /> Schedule Follow-up / Task
              </DialogTitle>
              <DialogDescription>
                Assign actionable task to counsellor with reminder deadline.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="tTitle" className="text-xs">Task Title *</Label>
                <Input
                  id="tTitle"
                  required
                  placeholder="e.g. Call student to discuss unconditional offer"
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="tCat" className="text-xs">Category</Label>
                  <select
                    id="tCat"
                    className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs"
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value as any })}
                  >
                    <option value="Call follow-up">Call follow-up</option>
                    <option value="WhatsApp follow-up">WhatsApp follow-up</option>
                    <option value="Email follow-up">Email follow-up</option>
                    <option value="Document reminder">Document reminder</option>
                    <option value="Application reminder">Application reminder</option>
                    <option value="Visa reminder">Visa reminder</option>
                    <option value="Custom task">Custom task</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tStaff" className="text-xs">Assigned Staff</Label>
                  <select
                    id="tStaff"
                    className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs"
                    onChange={(e) => setNewTask({ ...newTask, assignedStaff: e.target.value })}
                  >
                    <option value="Rohan Varma">Rohan Varma</option>
                    <option value="Neha Sharma">Neha Sharma</option>
                    <option value="Dev Patel">Dev Patel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="tEntity" className="text-xs">Student / Lead Name</Label>
                  <Input
                    id="tEntity"
                    placeholder="Aarav Mehta"
                    onChange={(e) => setNewTask({ ...newTask, entityName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tPriority" className="text-xs">Priority</Label>
                  <select
                    id="tPriority"
                    className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs"
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                  >
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Save Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
