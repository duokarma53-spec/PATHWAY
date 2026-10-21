"use client"

import * as React from "react"
import {
  ShieldCheck,
  Check,
  X,
  Lock,
  Users,
  ShieldAlert,
  Shield,
  KeyRound,
  FileCheck2,
  DollarSign,
  UserCog,
  Download,
  Globe,
  BarChart3,
  Sparkles,
  Info
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface PermissionRow {
  module: string
  category: "Analytics" | "Core CRM" | "Applications" | "Finance" | "Administration"
  description: string
  superAdmin: boolean
  admin: boolean
  counsellor: boolean
  staff: boolean
}

const PERMISSION_MATRIX: PermissionRow[] = [
  {
    module: "Dashboard KPI & Financials",
    category: "Analytics",
    description: "Revenue charts, counsellor pipeline health, and top-level conversion rates.",
    superAdmin: true,
    admin: true,
    counsellor: false,
    staff: false
  },
  {
    module: "View All Leads & Inquiries",
    category: "Core CRM",
    description: "Central inquiries intake, lead status pipelines, and contact archives.",
    superAdmin: true,
    admin: true,
    counsellor: true,
    staff: true
  },
  {
    module: "Reassign Leads & Students",
    category: "Core CRM",
    description: "Reallocate caseloads and student files between counsellors.",
    superAdmin: true,
    admin: true,
    counsellor: false,
    staff: false
  },
  {
    module: "Convert Lead to Student",
    category: "Core CRM",
    description: "Promote qualified prospects into active enrolled student profiles.",
    superAdmin: true,
    admin: true,
    counsellor: true,
    staff: false
  },
  {
    module: "Create & Edit Applications",
    category: "Applications",
    description: "Manage 11-stage university application files and intake requirements.",
    superAdmin: true,
    admin: true,
    counsellor: true,
    staff: false
  },
  {
    module: "Verify & Approve Documents",
    category: "Applications",
    description: "Audit academic transcripts, passports, SOPs, and financial affidavits.",
    superAdmin: true,
    admin: true,
    counsellor: true,
    staff: false
  },
  {
    module: "Record & Modify Payments",
    category: "Finance",
    description: "Create fee invoices, process consultancy receipts, and mark overdue bills.",
    superAdmin: true,
    admin: true,
    counsellor: false,
    staff: false
  },
  {
    module: "Staff Management & Audits",
    category: "Administration",
    description: "Create staff credentials, inspect tamper-evident audit logs, and clear logs.",
    superAdmin: true,
    admin: false,
    counsellor: false,
    staff: false
  },
  {
    module: "Export CSV / Data Exports",
    category: "Administration",
    description: "Download client directories, lead reports, and financial ledgers.",
    superAdmin: true,
    admin: true,
    counsellor: false,
    staff: false
  },
  {
    module: "Website CMS Publishing",
    category: "Administration",
    description: "Publish course updates, university affiliations, and news to public site.",
    superAdmin: true,
    admin: true,
    counsellor: false,
    staff: false
  },
]

const ROLE_INFO = [
  {
    role: "Super Admin",
    badge: "Full Access",
    color: "primary",
    badgeClass: "bg-primary/15 text-primary border-primary/30",
    borderClass: "border-primary/40",
    icon: ShieldCheck,
    description: "Complete system governance, fee ledgers, staff account generation, and audit compliance.",
    canEdit: false,
  },
  {
    role: "Admin",
    badge: "Operational",
    color: "amber",
    badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    borderClass: "border-amber-500/30",
    icon: Shield,
    description: "Operations director. Oversees applications, assigns counsellors, and verifies offer letters.",
    canEdit: true,
  },
  {
    role: "Counsellor",
    badge: "Student Facing",
    color: "sky",
    badgeClass: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    borderClass: "border-sky-500/30",
    icon: Users,
    description: "Front-line advisor. Manages assigned leads, applications, communications, and document checklists.",
    canEdit: true,
  },
  {
    role: "Staff / Intake",
    badge: "Restricted",
    color: "purple",
    badgeClass: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    borderClass: "border-purple-500/30",
    icon: KeyRound,
    description: "Front-desk intake. Records walk-ins, captures website phone inquiries, and schedules discovery meetings.",
    canEdit: true,
  },
]

export default function RolesPermissionsPage() {
  const [matrix, setMatrix] = React.useState<PermissionRow[]>(PERMISSION_MATRIX)

  const handleToggle = (rowIndex: number, roleKey: "admin" | "counsellor" | "staff") => {
    setMatrix((prev) =>
      prev.map((row, i) =>
        i === rowIndex ? { ...row, [roleKey]: !row[roleKey] } : row
      )
    )
    toast.success(`Permission policy updated for ${matrix[rowIndex].module}`)
  }

  const handleResetDefaults = () => {
    setMatrix(PERMISSION_MATRIX)
    toast.success("Permissions restored to standard security policies")
  }

  // Count active permissions per role
  const superAdminCount = matrix.filter((r) => r.superAdmin).length
  const adminCount = matrix.filter((r) => r.admin).length
  const counsellorCount = matrix.filter((r) => r.counsellor).length
  const staffCount = matrix.filter((r) => r.staff).length

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Roles & Permissions Governance
            </h1>
            <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold border border-primary/25 inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              RBAC v2.4 Enabled
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Role-based access control protecting sensitive student records, fee ledgers, and staff authorization boundaries.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetDefaults}
          className="border-white/10 hover:border-white/20 text-xs text-muted-foreground hover:text-foreground rounded-xl self-start md:self-auto"
        >
          Reset to Factory Security Defaults
        </Button>
      </div>

      {/* Role Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ROLE_INFO.map((info) => {
          const Icon = info.icon
          const count =
            info.role === "Super Admin"
              ? superAdminCount
              : info.role === "Admin"
              ? adminCount
              : info.role === "Counsellor"
              ? counsellorCount
              : staffCount

          return (
            <Card
              key={info.role}
              className={`border bg-[#14100D]/85 backdrop-blur-xl p-5 space-y-3 relative overflow-hidden transition-all hover:border-primary/40 ${info.borderClass}`}
            >
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-black/40 border border-white/[0.08] flex items-center justify-center text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${info.badgeClass}`}>
                  {info.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground leading-snug">{info.role}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                  {info.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted-foreground">Capabilities</span>
                <span className="font-mono font-bold text-foreground">
                  {count} / {matrix.length}
                </span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Granular Module Authorization Matrix */}
      <Card className="border-white/[0.08] bg-[#14100D]/85 backdrop-blur-xl shadow-xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-white/[0.08] bg-black/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Granular Module Authorization Matrix
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Toggle switches dynamically grant or revoke system authority across roles. Super Admin rights are permanently locked.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/[0.06]">
              <Info className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>Click any circle to toggle privilege</span>
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-black/50 text-muted-foreground uppercase text-[11px] tracking-wider font-semibold">
                <th className="py-3.5 px-5">System Capability & Scope</th>
                <th className="py-3.5 px-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-primary font-bold">Super Admin</span>
                    <span className="text-[10px] text-muted-foreground lowercase font-normal font-mono">
                      {superAdminCount} granted
                    </span>
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-amber-400 font-bold">Admin</span>
                    <span className="text-[10px] text-muted-foreground lowercase font-normal font-mono">
                      {adminCount} granted
                    </span>
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-sky-400 font-bold">Counsellor</span>
                    <span className="text-[10px] text-muted-foreground lowercase font-normal font-mono">
                      {counsellorCount} granted
                    </span>
                  </div>
                </th>
                <th className="py-3.5 px-5 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-purple-400 font-bold">Staff / Intake</span>
                    <span className="text-[10px] text-muted-foreground lowercase font-normal font-mono">
                      {staffCount} granted
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {matrix.map((row, i) => (
                <tr key={row.module} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-3.5 px-5">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/[0.05] border border-white/[0.08] text-muted-foreground">
                          {row.category}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-foreground block group-hover:text-primary transition-colors">
                          {row.module}
                        </span>
                        <span className="text-[11px] text-muted-foreground mt-0.5 block leading-tight">
                          {row.description}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Super Admin - Locked */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      title="Super Admin access is system-enforced and cannot be revoked"
                      className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-not-allowed shadow-sm"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  </td>

                  {/* Admin - Toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggle(i, "admin")}
                      className={`inline-flex items-center justify-center h-7 w-7 rounded-full transition-all duration-200 ${
                        row.admin
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10 hover:bg-emerald-500/25 hover:scale-105"
                          : "bg-white/[0.03] text-zinc-600 border border-white/[0.06] hover:border-white/20 hover:text-zinc-400 hover:scale-105"
                      }`}
                      title={row.admin ? "Revoke Admin permission" : "Grant Admin permission"}
                    >
                      {row.admin ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    </button>
                  </td>

                  {/* Counsellor - Toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggle(i, "counsellor")}
                      className={`inline-flex items-center justify-center h-7 w-7 rounded-full transition-all duration-200 ${
                        row.counsellor
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10 hover:bg-emerald-500/25 hover:scale-105"
                          : "bg-white/[0.03] text-zinc-600 border border-white/[0.06] hover:border-white/20 hover:text-zinc-400 hover:scale-105"
                      }`}
                      title={row.counsellor ? "Revoke Counsellor permission" : "Grant Counsellor permission"}
                    >
                      {row.counsellor ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    </button>
                  </td>

                  {/* Staff - Toggle */}
                  <td className="py-3.5 px-5 text-center">
                    <button
                      onClick={() => handleToggle(i, "staff")}
                      className={`inline-flex items-center justify-center h-7 w-7 rounded-full transition-all duration-200 ${
                        row.staff
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10 hover:bg-emerald-500/25 hover:scale-105"
                          : "bg-white/[0.03] text-zinc-600 border border-white/[0.06] hover:border-white/20 hover:text-zinc-400 hover:scale-105"
                      }`}
                      title={row.staff ? "Grant Staff permission" : "Revoke Staff permission"}
                    >
                      {row.staff ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
