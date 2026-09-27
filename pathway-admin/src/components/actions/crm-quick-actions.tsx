"use client"

import * as React from "react"
import { Plus, UserPlus, GraduationCap, FileText, CheckSquare, Calendar, Upload, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { toast } from "sonner"

type ActionType = "lead" | "student" | "application" | "task" | "appointment" | "document" | null

export function CRMQuickActions({ variant = "default", className }: { variant?: any; className?: string }) {
  const [activeModal, setActiveModal] = React.useState<ActionType>(null)
  const [dropdownOpen, setDropdownOpen] = React.useState(false)

  // Form states
  const [formData, setFormData] = React.useState<Record<string, string>>({})
  const [loading, setLoading] = React.useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const actionLabels: Record<string, string> = {
        lead: "Lead created and assigned to counsellor",
        student: "Student profile registered successfully",
        application: "University application created in pipeline",
        task: "CRM follow-up task added to calendar",
        appointment: "Consultation appointment booked",
        document: "Document uploaded and marked for verification"
      }
      toast.success(actionLabels[activeModal || ""] || "Action completed successfully!")
      setActiveModal(null)
      setFormData({})
    }, 600)
  }

  return (
    <>
      <div className="relative inline-block text-left">
        <Button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-medium shadow-md shadow-primary/20 flex items-center gap-1.5 transition-all ${className}`}
        >
          <Plus className="h-4 w-4" />
          <span>Quick Create</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70 ml-0.5" />
        </Button>

        {dropdownOpen && (
          <div
            className="origin-top-right absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl bg-card/95 backdrop-blur-2xl border border-border/70 divide-y divide-border/30 z-50 animate-in fade-in-0 zoom-in-95 duration-100"
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <div className="p-1.5 space-y-0.5">
              <button
                onClick={() => { setActiveModal("lead"); setDropdownOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary rounded-xl transition-colors text-left"
              >
                <UserPlus className="h-4 w-4 text-primary" />
                Add Lead
              </button>
              <button
                onClick={() => { setActiveModal("student"); setDropdownOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-emerald-500/10 hover:text-emerald-400 rounded-xl transition-colors text-left"
              >
                <GraduationCap className="h-4 w-4 text-emerald-400" />
                Add Student
              </button>
              <button
                onClick={() => { setActiveModal("application"); setDropdownOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-blue-500/10 hover:text-blue-400 rounded-xl transition-colors text-left"
              >
                <FileText className="h-4 w-4 text-blue-400" />
                Add Application
              </button>
            </div>
            <div className="p-1.5 space-y-0.5">
              <button
                onClick={() => { setActiveModal("task"); setDropdownOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-purple-500/10 hover:text-purple-400 rounded-xl transition-colors text-left"
              >
                <CheckSquare className="h-4 w-4 text-purple-400" />
                Add Task / Follow-up
              </button>
              <button
                onClick={() => { setActiveModal("appointment"); setDropdownOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-amber-500/10 hover:text-amber-400 rounded-xl transition-colors text-left"
              >
                <Calendar className="h-4 w-4 text-amber-400" />
                Schedule Appointment
              </button>
              <button
                onClick={() => { setActiveModal("document"); setDropdownOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-cyan-500/10 hover:text-cyan-400 rounded-xl transition-colors text-left"
              >
                <Upload className="h-4 w-4 text-cyan-400" />
                Upload Document
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Dialogs */}
      <Dialog open={activeModal !== null} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-md sm:max-w-lg bg-card/95 backdrop-blur-2xl border-border/70 rounded-2xl shadow-2xl">
          {activeModal === "lead" && (
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg text-primary">
                  <UserPlus className="h-5 w-5" /> Add New Prospective Lead
                </DialogTitle>
                <DialogDescription>
                  Record an incoming inquiry manually or from walk-in / phone.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3.5 py-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-xs">First Name *</Label>
                    <Input id="firstName" name="firstName" required placeholder="Aarav" onChange={handleInputChange} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-xs">Last Name *</Label>
                    <Input id="lastName" name="lastName" required placeholder="Mehta" onChange={handleInputChange} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs">Email Address *</Label>
                    <Input id="email" name="email" type="email" required placeholder="aarav@example.com" onChange={handleInputChange} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs">Phone / WhatsApp *</Label>
                    <Input id="phone" name="phone" required placeholder="+91 98200..." onChange={handleInputChange} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="destination" className="text-xs">Target Destination</Label>
                    <select
                      id="destination"
                      name="destination"
                      className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                      onChange={handleInputChange}
                    >
                      <option value="UK">United Kingdom</option>
                      <option value="USA">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="course" className="text-xs">Intended Course / Major</Label>
                    <Input id="course" name="course" placeholder="MSc Data Science" onChange={handleInputChange} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="source" className="text-xs">Lead Source</Label>
                    <select
                      id="source"
                      name="source"
                      className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                      onChange={handleInputChange}
                    >
                      <option value="Website">Website Form</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Phone">Phone Call</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Referral">Referral</option>
                      <option value="Instagram">Instagram</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="priority" className="text-xs">Priority</Label>
                    <select
                      id="priority"
                      name="priority"
                      className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                      onChange={handleInputChange}
                    >
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
                  {loading ? "Creating..." : "Save Lead"}
                </Button>
              </DialogFooter>
            </form>
          )}

          {activeModal === "student" && (
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg text-emerald-400">
                  <GraduationCap className="h-5 w-5" /> Register Student Profile
                </DialogTitle>
                <DialogDescription>
                  Create an official student record for consultation, document tracking and applications.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3.5 py-4">
                <div className="space-y-1.5">
                  <Label htmlFor="stuName" className="text-xs">Student Full Name *</Label>
                  <Input id="stuName" name="stuName" required placeholder="Full legal name as per passport" onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="stuEmail" className="text-xs">Email Address *</Label>
                    <Input id="stuEmail" name="stuEmail" type="email" required placeholder="student@example.com" onChange={handleInputChange} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="stuPhone" className="text-xs">Phone Number *</Label>
                    <Input id="stuPhone" name="stuPhone" required placeholder="+91 ..." onChange={handleInputChange} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="stuPassport" className="text-xs">Passport Number</Label>
                    <Input id="stuPassport" name="stuPassport" placeholder="P1234567" onChange={handleInputChange} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="stuCounsellor" className="text-xs">Assigned Counsellor</Label>
                    <select
                      id="stuCounsellor"
                      name="stuCounsellor"
                      className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                      onChange={handleInputChange}
                    >
                      <option value="Rohan Varma">Rohan Varma (UK Lead)</option>
                      <option value="Neha Sharma">Neha Sharma (Canada/Aus)</option>
                      <option value="Dev Patel">Dev Patel (US/Visa)</option>
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  {loading ? "Registering..." : "Create Student Profile"}
                </Button>
              </DialogFooter>
            </form>
          )}

          {activeModal === "application" && (
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg text-blue-400">
                  <FileText className="h-5 w-5" /> Start University Application
                </DialogTitle>
                <DialogDescription>
                  Link a student to a university and course in the admission pipeline.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3.5 py-4">
                <div className="space-y-1.5">
                  <Label htmlFor="appStudent" className="text-xs">Select Student *</Label>
                  <select
                    id="appStudent"
                    name="appStudent"
                    required
                    className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                    onChange={handleInputChange}
                  >
                    <option value="Zainab Al-Mansoor">Zainab Al-Mansoor (STU-2041)</option>
                    <option value="Arjun Nair">Arjun Nair (STU-2040)</option>
                    <option value="Sneha Mukherjee">Sneha Mukherjee (STU-2039)</option>
                    <option value="Karan Johal">Karan Johal (STU-2038)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="appUni" className="text-xs">University *</Label>
                    <Input id="appUni" name="appUni" required placeholder="University of Manchester" onChange={handleInputChange} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="appCountry" className="text-xs">Country</Label>
                    <select
                      id="appCountry"
                      name="appCountry"
                      className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                      onChange={handleInputChange}
                    >
                      <option value="UK">United Kingdom</option>
                      <option value="USA">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="appCourse" className="text-xs">Program / Course *</Label>
                    <Input id="appCourse" name="appCourse" required placeholder="MSc Data Science" onChange={handleInputChange} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="appIntake" className="text-xs">Intake</Label>
                    <Input id="appIntake" name="appIntake" placeholder="Sept 2026" onChange={handleInputChange} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {loading ? "Adding..." : "Add to Pipeline"}
                </Button>
              </DialogFooter>
            </form>
          )}

          {activeModal === "task" && (
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg text-purple-400">
                  <CheckSquare className="h-5 w-5" /> Create CRM Task or Follow-up
                </DialogTitle>
                <DialogDescription>
                  Assign a reminder, call follow-up, or deadline to staff.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3.5 py-4">
                <div className="space-y-1.5">
                  <Label htmlFor="taskTitle" className="text-xs">Task Title *</Label>
                  <Input id="taskTitle" name="taskTitle" required placeholder="Follow up with student regarding CAS letter" onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="taskCategory" className="text-xs">Task Type</Label>
                    <select
                      id="taskCategory"
                      name="taskCategory"
                      className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                      onChange={handleInputChange}
                    >
                      <option value="Call follow-up">Call follow-up</option>
                      <option value="WhatsApp follow-up">WhatsApp follow-up</option>
                      <option value="Email follow-up">Email follow-up</option>
                      <option value="Document reminder">Document reminder</option>
                      <option value="Application reminder">Application reminder</option>
                      <option value="Visa reminder">Visa reminder</option>
                      <option value="Appointment">Appointment</option>
                      <option value="Custom task">Custom task</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="taskDue" className="text-xs">Due Date & Time *</Label>
                    <Input id="taskDue" name="taskDue" type="datetime-local" required onChange={handleInputChange} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="taskStaff" className="text-xs">Assigned Staff</Label>
                    <select
                      id="taskStaff"
                      name="taskStaff"
                      className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                      onChange={handleInputChange}
                    >
                      <option value="Rohan Varma">Rohan Varma</option>
                      <option value="Neha Sharma">Neha Sharma</option>
                      <option value="Dev Patel">Dev Patel</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="taskPriority" className="text-xs">Priority</Label>
                    <select
                      id="taskPriority"
                      name="taskPriority"
                      className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                      onChange={handleInputChange}
                    >
                      <option value="Urgent">Urgent</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white">
                  {loading ? "Scheduling..." : "Create Task"}
                </Button>
              </DialogFooter>
            </form>
          )}

          {activeModal === "appointment" && (
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg text-amber-400">
                  <Calendar className="h-5 w-5" /> Schedule Counselling Appointment
                </DialogTitle>
                <DialogDescription>
                  Book an in-person, Zoom, or phone counseling session.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3.5 py-4">
                <div className="space-y-1.5">
                  <Label htmlFor="aptStudent" className="text-xs">Student / Lead Name *</Label>
                  <Input id="aptStudent" name="aptStudent" required placeholder="Aarav Mehta" onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="aptDate" className="text-xs">Date *</Label>
                    <Input id="aptDate" name="aptDate" type="date" required onChange={handleInputChange} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="aptTime" className="text-xs">Time *</Label>
                    <Input id="aptTime" name="aptTime" type="time" required onChange={handleInputChange} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="aptType" className="text-xs">Session Type</Label>
                    <select
                      id="aptType"
                      name="aptType"
                      className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                      onChange={handleInputChange}
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
                    <Label htmlFor="aptMode" className="text-xs">Mode</Label>
                    <select
                      id="aptMode"
                      name="aptMode"
                      className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                      onChange={handleInputChange}
                    >
                      <option value="Office In-Person">Office In-Person</option>
                      <option value="Zoom Video">Zoom Video</option>
                      <option value="Phone Call">Phone Call</option>
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-white">
                  {loading ? "Booking..." : "Schedule Appointment"}
                </Button>
              </DialogFooter>
            </form>
          )}

          {activeModal === "document" && (
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg text-cyan-400">
                  <Upload className="h-5 w-5" /> Upload Student Document
                </DialogTitle>
                <DialogDescription>
                  Upload and tag an academic, passport, or visa record.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3.5 py-4">
                <div className="space-y-1.5">
                  <Label htmlFor="docStudent" className="text-xs">Student *</Label>
                  <select
                    id="docStudent"
                    name="docStudent"
                    required
                    className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                    onChange={handleInputChange}
                  >
                    <option value="Zainab Al-Mansoor">Zainab Al-Mansoor (STU-2041)</option>
                    <option value="Arjun Nair">Arjun Nair (STU-2040)</option>
                    <option value="Sneha Mukherjee">Sneha Mukherjee (STU-2039)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="docCategory" className="text-xs">Document Category *</Label>
                  <select
                    id="docCategory"
                    name="docCategory"
                    required
                    className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                    onChange={handleInputChange}
                  >
                    <option value="Passport">Passport</option>
                    <option value="Academic transcripts">Academic transcripts</option>
                    <option value="Degree certificate">Degree certificate</option>
                    <option value="Resume/CV">Resume/CV</option>
                    <option value="SOP">SOP</option>
                    <option value="LOR">LOR</option>
                    <option value="English test">English test (IELTS/TOEFL/PTE)</option>
                    <option value="Financial documents">Financial documents</option>
                    <option value="Offer letter">Offer letter</option>
                    <option value="Visa documents">Visa documents</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="docFile" className="text-xs">Choose File *</Label>
                  <Input id="docFile" name="docFile" type="file" required className="cursor-pointer file:text-primary file:font-medium" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  {loading ? "Uploading..." : "Upload File"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
