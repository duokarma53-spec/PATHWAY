"use client"

import * as React from "react"
import {
  Users,
  Shield,
  Plus,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Briefcase,
  GraduationCap,
  FileText,
  Search,
  Filter,
  UserCheck,
  Building2,
  Sparkles,
  ChevronRight,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { INITIAL_STAFF, StaffMember } from "@/lib/mock-data"
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

const ROLE_COLORS: Record<string, { badge: string; text: string; bg: string }> = {
  "Super Admin": { badge: "border-primary/40 bg-primary/10 text-primary", text: "text-primary", bg: "bg-primary/15" },
  "Admin": { badge: "border-amber-500/40 bg-amber-500/10 text-amber-400", text: "text-amber-400", bg: "bg-amber-500/15" },
  "Counsellor": { badge: "border-sky-500/40 bg-sky-500/10 text-sky-400", text: "text-sky-400", bg: "bg-sky-500/15" },
  "Staff": { badge: "border-purple-500/40 bg-purple-500/10 text-purple-400", text: "text-purple-400", bg: "bg-purple-500/15" },
}

export function StaffClientView() {
  const [staff, setStaff] = React.useState<StaffMember[]>(INITIAL_STAFF)
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [newStaff, setNewStaff] = React.useState<Partial<StaffMember>>({})
  const [search, setSearch] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState("ALL")
  const [deptFilter, setDeptFilter] = React.useState("ALL")

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStaff.name || !newStaff.email) return
    const member: StaffMember = {
      id: "staff-" + Date.now(),
      name: newStaff.name,
      avatar: newStaff.name.slice(0, 2).toUpperCase(),
      email: newStaff.email,
      phone: newStaff.phone || "+91 98000 00000",
      role: (newStaff.role as any) || "Counsellor",
      department: (newStaff.department as any) || "Admissions",
      status: "Active",
      assignedLeads: 0,
      assignedStudents: 0,
      pendingFollowups: 0,
      applications: 0,
      completedTasks: 0
    }
    setStaff([...staff, member])
    setShowAddModal(false)
    setNewStaff({})
    toast.success(`Staff account for ${member.name} registered`)
  }

  // Filter staff based on search, role, and department
  const filteredStaff = React.useMemo(() => {
    return staff.filter((s) => {
      const matchSearch =
        search === "" ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.department.toLowerCase().includes(search.toLowerCase()) ||
        s.role.toLowerCase().includes(search.toLowerCase())

      const matchRole = roleFilter === "ALL" || s.role === roleFilter
      const matchDept = deptFilter === "ALL" || s.department === deptFilter

      return matchSearch && matchRole && matchDept
    })
  }, [staff, search, roleFilter, deptFilter])

  // Summary Metrics
  const totalLeads = staff.reduce((acc, s) => acc + (s.assignedLeads || 0), 0)
  const totalStudents = staff.reduce((acc, s) => acc + (s.assignedStudents || 0), 0)
  const totalApps = staff.reduce((acc, s) => acc + (s.applications || 0), 0)
  const totalTasks = staff.reduce((acc, s) => acc + (s.completedTasks || 0), 0)

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Staff & Team Management
            </h1>
            <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold border border-primary/25 inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {staff.length} Active Personnel
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Super Admin console to manage counselors, workload distribution, active students, and role governance.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-primary/20 px-4 h-10 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> Add Team Member
        </Button>
      </div>

      {/* Team Aggregates Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#14100D]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Total Workload Leads</span>
            <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2 font-mono">{totalLeads}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Distributed across {staff.length} advisors</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#14100D]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Active Students</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2 font-mono">{totalStudents}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Enrolled with assigned counselors</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#14100D]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Managed Applications</span>
            <div className="h-8 w-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-sky-400 mt-2 font-mono">{totalApps}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Live submissions & visa files</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#14100D]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Tasks Completed</span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2 font-mono">{totalTasks}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Resolved counselor action items</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#14100D]/75 border border-white/[0.08] backdrop-blur-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
        <div className="relative flex-1 w-full sm:min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search team member by name, corporate email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-black/40 border-white/[0.08] text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 w-full"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 w-full sm:w-auto truncate rounded-xl border border-white/[0.08] bg-black/40 px-3 text-xs text-foreground font-medium outline-none hover:border-white/20 transition-colors"
          >
            <option value="ALL">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Counsellor">Counsellor</option>
            <option value="Staff">Staff</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="h-10 w-full sm:w-auto truncate rounded-xl border border-white/[0.08] bg-black/40 px-3 text-xs text-foreground font-medium outline-none hover:border-white/20 transition-colors"
          >
            <option value="ALL">All Departments</option>
            <option value="Admissions">Admissions</option>
            <option value="Visa Processing">Visa Processing</option>
            <option value="Student Support">Student Support</option>
            <option value="Management">Management</option>
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      {filteredStaff.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-white/[0.08] bg-[#14100D]/75 backdrop-blur-xl flex flex-col items-center justify-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-muted-foreground">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">No personnel match your filters</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Try adjusting your search query, role selection, or department filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setSearch(""); setRoleFilter("ALL"); setDeptFilter("ALL"); }}
            className="border-white/10 text-xs"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredStaff.map((s) => {
            const roleStyle = ROLE_COLORS[s.role] || {
              badge: "border-white/10 bg-white/5 text-muted-foreground",
              text: "text-muted-foreground",
              bg: "bg-white/5"
            }

            return (
              <Card
                key={s.id}
                className="border-white/[0.08] bg-[#15100D]/90 backdrop-blur-xl shadow-lg hover:border-primary/40 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Subtle top edge gradient on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <CardContent className="p-6 space-y-5">
                  {/* Profile Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="h-13 w-13 rounded-2xl bg-gradient-to-br from-[#271A12] to-[#17100A] border border-primary/30 flex items-center justify-center font-bold text-base text-primary shrink-0 shadow-inner group-hover:border-primary/60 transition-colors">
                        {s.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                            {s.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${roleStyle.badge}`}>
                            {s.role}
                          </span>
                          <span className="text-white/20 text-xs">•</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-muted-foreground/70" />
                            {s.department}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 inline-flex items-center gap-1.5 shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {s.status}
                    </span>
                  </div>

                  {/* Contact Information */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.05] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <a
                      href={`mailto:${s.email}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors truncate"
                      title={s.email}
                    >
                      <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{s.email}</span>
                    </a>
                    <a
                      href={`tel:${s.phone}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-sky-400 transition-colors truncate"
                      title={s.phone}
                    >
                      <Phone className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">{s.phone}</span>
                    </a>
                  </div>

                  {/* Workload Stats Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium mb-2">
                      <span className="uppercase tracking-wider text-[10px]">Workload Distribution</span>
                      <span className="text-primary font-mono">{s.assignedLeads + s.assignedStudents} Active Cases</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-black/50 border border-white/[0.06] hover:border-white/10 transition-colors">
                        <p className="text-[10px] text-muted-foreground uppercase font-medium">Leads</p>
                        <p className="text-base font-bold text-foreground mt-0.5 font-mono">{s.assignedLeads}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/50 border border-white/[0.06] hover:border-emerald-500/30 transition-colors">
                        <p className="text-[10px] text-muted-foreground uppercase font-medium">Students</p>
                        <p className="text-base font-bold text-emerald-400 mt-0.5 font-mono">{s.assignedStudents}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/50 border border-white/[0.06] hover:border-sky-500/30 transition-colors">
                        <p className="text-[10px] text-muted-foreground uppercase font-medium">Apps</p>
                        <p className="text-base font-bold text-sky-400 mt-0.5 font-mono">{s.applications}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/50 border border-white/[0.06] hover:border-amber-500/30 transition-colors">
                        <p className="text-[10px] text-muted-foreground uppercase font-medium">Tasks Done</p>
                        <p className="text-base font-bold text-amber-400 mt-0.5 font-mono">{s.completedTasks}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add Staff Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md bg-[#15100D] border-white/10 text-white rounded-2xl shadow-2xl p-6">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary mb-2">
                <Users className="h-5 w-5" />
              </div>
              <DialogTitle className="text-white text-lg font-bold">
                Register Staff / Counsellor Account
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Grant administrative or counselling access to consultancy personnel.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3.5 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="sName" className="text-xs font-semibold text-foreground">
                  Full Name *
                </Label>
                <Input
                  id="sName"
                  required
                  placeholder="e.g. Anjali Nair"
                  value={newStaff.name || ""}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="bg-black/40 border-white/[0.08] text-xs h-10 rounded-xl text-foreground focus:border-primary/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="sEmail" className="text-xs font-semibold text-foreground">
                    Corporate Email *
                  </Label>
                  <Input
                    id="sEmail"
                    type="email"
                    required
                    placeholder="anjali@pathway.com"
                    value={newStaff.email || ""}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="bg-black/40 border-white/[0.08] text-xs h-10 rounded-xl text-foreground focus:border-primary/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sPhone" className="text-xs font-semibold text-foreground">
                    Phone Number
                  </Label>
                  <Input
                    id="sPhone"
                    placeholder="+91 98200..."
                    value={newStaff.phone || ""}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="bg-black/40 border-white/[0.08] text-xs h-10 rounded-xl text-foreground focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="sRole" className="text-xs font-semibold text-foreground">
                    System Role
                  </Label>
                  <select
                    id="sRole"
                    className="w-full h-10 rounded-xl border border-white/[0.08] bg-black/40 px-3 text-xs text-foreground outline-none focus:border-primary/50"
                    value={newStaff.role || "Counsellor"}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}
                  >
                    <option value="Counsellor">Counsellor</option>
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sDept" className="text-xs font-semibold text-foreground">
                    Department
                  </Label>
                  <select
                    id="sDept"
                    className="w-full h-10 rounded-xl border border-white/[0.08] bg-black/40 px-3 text-xs text-foreground outline-none focus:border-primary/50"
                    value={newStaff.department || "Admissions"}
                    onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value as any })}
                  >
                    <option value="Admissions">Admissions</option>
                    <option value="Visa Processing">Visa Processing</option>
                    <option value="Student Support">Student Support</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-white/[0.08]">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs rounded-xl shadow-md shadow-primary/20"
              >
                Create Account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
