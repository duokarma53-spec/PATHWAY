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
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

export function StaffClientView() {
  const [staff, setStaff] = React.useState<StaffMember[]>(INITIAL_STAFF)
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [newStaff, setNewStaff] = React.useState<Partial<StaffMember>>({})

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

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Staff & Team Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">
              {staff.length} Active Personnel
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Super Admin console to manage counselors, workload distribution, active students, and role assignments.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-primary-foreground font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Add Team Member
        </Button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staff.map((s) => (
          <Card key={s.id} className="border-border/60 bg-card/75 backdrop-blur-md shadow-md hover:border-primary/40 transition-all">
            <CardContent className="p-6 space-y-5">
              {/* Profile Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/40 flex items-center justify-center font-bold text-base text-primary shrink-0 shadow-sm">
                    {s.avatar}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground leading-snug">{s.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-semibold text-primary">{s.role}</span>
                      <span className="text-muted-foreground/40">•</span>
                      <span className="text-xs text-muted-foreground">{s.department}</span>
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {s.status}
                </span>
              </div>

              {/* Contact Information */}
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-primary" /> {s.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-blue-400" /> {s.phone}
                </div>
              </div>

              {/* Workload Stats Bar */}
              <div className="pt-3 border-t border-border/40 grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-muted/30">
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Leads</p>
                  <p className="text-base font-bold text-foreground mt-0.5">{s.assignedLeads}</p>
                </div>
                <div className="p-2 rounded-xl bg-muted/30">
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Students</p>
                  <p className="text-base font-bold text-emerald-400 mt-0.5">{s.assignedStudents}</p>
                </div>
                <div className="p-2 rounded-xl bg-muted/30">
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Apps</p>
                  <p className="text-base font-bold text-blue-400 mt-0.5">{s.applications}</p>
                </div>
                <div className="p-2 rounded-xl bg-muted/30">
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Tasks Done</p>
                  <p className="text-base font-bold text-primary mt-0.5">{s.completedTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Staff Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-2xl border-border/70 rounded-2xl">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle className="text-primary flex items-center gap-2 text-base">
                <Users className="h-5 w-5" /> Register Staff / Counsellor Account
              </DialogTitle>
              <DialogDescription>
                Grant administrative or counselling access to consultancy personnel.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="sName" className="text-xs">Full Name *</Label>
                <Input
                  id="sName"
                  required
                  placeholder="e.g. Anjali Nair"
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="sEmail" className="text-xs">Corporate Email *</Label>
                  <Input
                    id="sEmail"
                    type="email"
                    required
                    placeholder="anjali@pathway.com"
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sPhone" className="text-xs">Phone Number</Label>
                  <Input
                    id="sPhone"
                    placeholder="+91 98200..."
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="sRole" className="text-xs">System Role</Label>
                  <select
                    id="sRole"
                    className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs"
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}
                  >
                    <option value="Counsellor">Counsellor</option>
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sDept" className="text-xs">Department</Label>
                  <select
                    id="sDept"
                    className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs"
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

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Create Account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
