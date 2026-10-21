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
  Trash2,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  const pendingCount = tasks.filter((t) => t.status === "Pending" || t.status === "In Progress").length
  const completedCount = tasks.filter((t) => t.status === "Completed").length

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
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#F8F5F1]">
              {defaultCategory ? "Client Follow-ups & Reminders" : "CRM Tasks & Action Items"}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/15 text-[#FF8A35] text-xs font-bold border border-orange-500/30">
              {tasks.length} Active Tasks
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#BDB0A4] mt-1">
            Follow-up reminders, document requests, application deadlines, and counsellor to-dos.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-[#FF6B00] to-[#FF8A35] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-orange-950/40 h-9 px-4"
        >
          <Plus className="h-4 w-4" /> Create Task
        </Button>
      </div>

      {/* Metric Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/80 p-4 backdrop-blur-md">
          <p className="text-[11px] text-[#897B70] uppercase font-semibold">Total Assigned</p>
          <p className="text-2xl font-bold text-[#F8F5F1] mt-1">{tasks.length}</p>
          <p className="text-[11px] text-[#897B70] mt-1">Across team</p>
        </div>

        <div className={`rounded-2xl border p-4 backdrop-blur-md ${
          overdueCount > 0
            ? "border-rose-500/30 bg-rose-500/[0.08]"
            : "border-white/[0.08] bg-[#15100D]/80"
        }`}>
          <p className="text-[11px] text-rose-400 uppercase font-semibold">Overdue</p>
          <p className="text-2xl font-bold text-rose-400 mt-1">{overdueCount}</p>
          <p className="text-[11px] text-rose-400/80 mt-1">Requires urgent action</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/80 p-4 backdrop-blur-md">
          <p className="text-[11px] text-[#897B70] uppercase font-semibold">Pending &amp; In-Flight</p>
          <p className="text-2xl font-bold text-sky-400 mt-1">{pendingCount}</p>
          <p className="text-[11px] text-[#897B70] mt-1">In progress</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/80 p-4 backdrop-blur-md">
          <p className="text-[11px] text-[#897B70] uppercase font-semibold">Resolved / Done</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{completedCount}</p>
          <p className="text-[11px] text-[#897B70] mt-1">Completed tasks</p>
        </div>
      </div>

      {/* Overdue Alert Banner (if any) */}
      {overdueCount > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-4 animate-in fade-in-50">
          <div className="flex items-center gap-3 text-rose-400">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <div>
              <p className="text-xs md:text-sm font-bold text-rose-300">
                {overdueCount} Overdue Follow-up Task{overdueCount > 1 ? "s" : ""} Require Immediate Attention
              </p>
              <p className="text-[11px] text-rose-400/80 mt-0.5">
                Delaying follow-ups reduces student conversion probability. Prioritize overdue outreach first.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setStatusFilter("Overdue")}
            className="text-xs border-rose-500/40 text-rose-300 hover:bg-rose-500/20 rounded-xl shrink-0 h-8"
          >
            Show Overdue Only
          </Button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-4 backdrop-blur-md shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 w-full sm:min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#897B70]" />
            <input
              placeholder="Search tasks by title, lead name or student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 h-9 rounded-xl bg-[#1D1510] border border-white/[0.08] text-xs text-[#F8F5F1] placeholder:text-[#897B70] outline-none focus:border-orange-500/50"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 w-full sm:w-auto truncate rounded-xl border border-white/[0.08] bg-[#1D1510] px-3 text-xs text-[#F8F5F1] font-medium outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#1D1510]">All Statuses</option>
              <option value="Pending" className="bg-[#1D1510]">Pending</option>
              <option value="In Progress" className="bg-[#1D1510]">In Progress</option>
              <option value="Completed" className="bg-[#1D1510]">Completed</option>
              <option value="Overdue" className="bg-[#1D1510]">Overdue</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-9 w-full sm:w-auto truncate rounded-xl border border-white/[0.08] bg-[#1D1510] px-3 text-xs text-[#F8F5F1] font-medium outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#1D1510]">All Priorities</option>
              <option value="Urgent" className="bg-[#1D1510]">Urgent</option>
              <option value="High" className="bg-[#1D1510]">High</option>
              <option value="Medium" className="bg-[#1D1510]">Medium</option>
              <option value="Low" className="bg-[#1D1510]">Low</option>
            </select>

            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="h-9 w-full sm:w-auto truncate rounded-xl border border-white/[0.08] bg-[#1D1510] px-3 text-xs text-[#F8F5F1] font-medium outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#1D1510]">All Staff</option>
              <option value="Rohan Varma" className="bg-[#1D1510]">Rohan Varma</option>
              <option value="Neha Sharma" className="bg-[#1D1510]">Neha Sharma</option>
              <option value="Dev Patel" className="bg-[#1D1510]">Dev Patel</option>
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
                className="col-span-2 sm:col-span-1 h-9 text-xs text-[#897B70] hover:text-[#F8F5F1] rounded-xl hover:bg-white/[0.06]"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.1] bg-[#15100D]/50 p-12 text-center text-[#897B70]">
            <CheckCircle2 className="h-10 w-10 mx-auto opacity-30 text-emerald-400 mb-2" />
            <p className="text-sm font-bold text-[#F8F5F1]">No tasks found matching your filter criteria.</p>
            <p className="text-xs text-[#897B70] mt-1">Try clearing filters or search terms.</p>
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isCompleted = t.status === "Completed"
            const isOverdue = t.status === "Overdue"

            return (
              <div
                key={t.id}
                className={`rounded-2xl border transition-all duration-200 p-4.5 backdrop-blur-md shadow-lg ${
                  isOverdue
                    ? "border-rose-500/35 bg-rose-500/[0.05] hover:border-rose-500/50"
                    : isCompleted
                    ? "border-white/[0.04] bg-[#15100D]/50 opacity-70"
                    : "border-white/[0.08] bg-[#15100D]/85 hover:border-orange-500/30 hover:bg-[#1D1510]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Checkbox & Task details */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleTask(t.id)}
                      className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isCompleted
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-white/[0.2] hover:border-orange-400 bg-[#1D1510]"
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                    </button>

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm font-bold truncate ${
                            isCompleted ? "line-through text-[#897B70]" : "text-[#F8F5F1]"
                          }`}
                        >
                          {t.title}
                        </span>
                        <PriorityBadge priority={t.priority} />
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1D1510] text-[#BDB0A4] border border-white/[0.08] font-medium">
                          {t.category}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#897B70]">
                        <span>
                          Target: <strong className="text-[#F8F5F1]">{t.entityName}</strong> ({t.entityType})
                        </span>
                        <span>•</span>
                        <span>Assigned to: <strong className="text-[#F8F5F1]">{t.assignedStaff}</strong></span>
                        {t.notes && (
                          <>
                            <span>•</span>
                            <span className="italic text-orange-400/90 truncate max-w-xs">&ldquo;{t.notes}&rdquo;</span>
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
                          isOverdue ? "text-rose-400 font-bold" : "text-[#897B70]"
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(t.dueDate).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                      {isOverdue && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
                          OVERDUE
                        </span>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleTask(t.id)}
                      className="h-8 text-xs rounded-xl border-white/[0.08] bg-[#1D1510] hover:bg-[#271A12] text-[#F8F5F1]"
                    >
                      {isCompleted ? "Reopen" : "Done"}
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTask(t.id, t.title)}
                      className="h-8 w-8 p-0 text-[#897B70] hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add Task Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md bg-[#15100D] border border-white/[0.12] text-[#F8F5F1] rounded-2xl shadow-2xl">
          <form onSubmit={handleAddTaskSubmit}>
            <DialogHeader>
              <DialogTitle className="text-[#F8F5F1] flex items-center gap-2 text-base font-bold">
                <CheckSquare className="h-5 w-5 text-[#FF6B00]" /> Schedule Follow-up / Task
              </DialogTitle>
              <DialogDescription className="text-xs text-[#897B70]">
                Assign actionable task to counsellor with reminder deadline.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3.5 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="tTitle" className="text-xs font-semibold text-[#BDB0A4]">Task Title *</Label>
                <Input
                  id="tTitle"
                  required
                  placeholder="e.g. Call student to discuss unconditional offer"
                  value={newTask.title || ""}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="bg-[#1D1510] border-white/[0.1] text-xs text-[#F8F5F1] rounded-xl h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="tCat" className="text-xs font-semibold text-[#BDB0A4]">Category</Label>
                  <select
                    id="tCat"
                    className="w-full h-9 rounded-xl border border-white/[0.1] bg-[#1D1510] px-3 text-xs text-[#F8F5F1] outline-none cursor-pointer"
                    value={newTask.category || "Call follow-up"}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value as any })}
                  >
                    <option value="Call follow-up" className="bg-[#1D1510]">Call follow-up</option>
                    <option value="WhatsApp follow-up" className="bg-[#1D1510]">WhatsApp follow-up</option>
                    <option value="Email follow-up" className="bg-[#1D1510]">Email follow-up</option>
                    <option value="Document reminder" className="bg-[#1D1510]">Document reminder</option>
                    <option value="Application reminder" className="bg-[#1D1510]">Application reminder</option>
                    <option value="Visa reminder" className="bg-[#1D1510]">Visa reminder</option>
                    <option value="Custom task" className="bg-[#1D1510]">Custom task</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tStaff" className="text-xs font-semibold text-[#BDB0A4]">Assigned Staff</Label>
                  <select
                    id="tStaff"
                    className="w-full h-9 rounded-xl border border-white/[0.1] bg-[#1D1510] px-3 text-xs text-[#F8F5F1] outline-none cursor-pointer"
                    value={newTask.assignedStaff || "Rohan Varma"}
                    onChange={(e) => setNewTask({ ...newTask, assignedStaff: e.target.value })}
                  >
                    <option value="Rohan Varma" className="bg-[#1D1510]">Rohan Varma</option>
                    <option value="Neha Sharma" className="bg-[#1D1510]">Neha Sharma</option>
                    <option value="Dev Patel" className="bg-[#1D1510]">Dev Patel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="tEntity" className="text-xs font-semibold text-[#BDB0A4]">Student / Lead Name</Label>
                  <Input
                    id="tEntity"
                    placeholder="Aarav Mehta"
                    value={newTask.entityName || ""}
                    onChange={(e) => setNewTask({ ...newTask, entityName: e.target.value })}
                    className="bg-[#1D1510] border-white/[0.1] text-xs text-[#F8F5F1] rounded-xl h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tPriority" className="text-xs font-semibold text-[#BDB0A4]">Priority</Label>
                  <select
                    id="tPriority"
                    className="w-full h-9 rounded-xl border border-white/[0.1] bg-[#1D1510] px-3 text-xs text-[#F8F5F1] outline-none cursor-pointer"
                    value={newTask.priority || "Medium"}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                  >
                    <option value="High" className="bg-[#1D1510]">High</option>
                    <option value="Urgent" className="bg-[#1D1510]">Urgent</option>
                    <option value="Medium" className="bg-[#1D1510]">Medium</option>
                    <option value="Low" className="bg-[#1D1510]">Low</option>
                  </select>
                </div>
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
                Save Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
