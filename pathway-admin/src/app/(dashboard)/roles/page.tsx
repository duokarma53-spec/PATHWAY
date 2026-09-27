"use client"

import * as React from "react"
import { ShieldCheck, Check, X, Lock, Users, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface PermissionRow {
  module: string
  superAdmin: boolean
  admin: boolean
  counsellor: boolean
  staff: boolean
}

const PERMISSION_MATRIX: PermissionRow[] = [
  { module: "Dashboard KPI & Financials", superAdmin: true, admin: true, counsellor: false, staff: false },
  { module: "View All Leads & Inquiries", superAdmin: true, admin: true, counsellor: true, staff: true },
  { module: "Reassign Leads & Students", superAdmin: true, admin: true, counsellor: false, staff: false },
  { module: "Convert Lead to Student", superAdmin: true, admin: true, counsellor: true, staff: false },
  { module: "Create & Edit Applications", superAdmin: true, admin: true, counsellor: true, staff: false },
  { module: "Verify & Approve Documents", superAdmin: true, admin: true, counsellor: true, staff: false },
  { module: "Record & Modify Payments", superAdmin: true, admin: true, counsellor: false, staff: false },
  { module: "Staff Management & Audits", superAdmin: true, admin: false, counsellor: false, staff: false },
  { module: "Export CSV / Data Exports", superAdmin: true, admin: true, counsellor: false, staff: false },
  { module: "Website CMS Publishing", superAdmin: true, admin: true, counsellor: false, staff: false },
]

export default function RolesPermissionsPage() {
  const [matrix, setMatrix] = React.useState(PERMISSION_MATRIX)

  const handleToggle = (rowIndex: number, roleKey: "admin" | "counsellor" | "staff") => {
    setMatrix(prev =>
      prev.map((row, i) =>
        i === rowIndex ? { ...row, [roleKey]: !row[roleKey] } : row
      )
    )
    toast.success("Permission policy updated")
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Roles & Permissions Governance
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">
            RBAC Enabled
          </span>
        </div>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          Role-based access control protecting sensitive student data, fee ledgers, and staff reassignment authority.
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/40 bg-primary/5 p-4 space-y-1.5">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Role 1</span>
          <h3 className="text-base font-bold text-foreground">Super Admin</h3>
          <p className="text-xs text-muted-foreground">
            Complete system access, fee ledgers, staff account generation, and audit compliance.
          </p>
        </Card>

        <Card className="border-border/60 bg-card/75 p-4 space-y-1.5">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Role 2</span>
          <h3 className="text-base font-bold text-foreground">Admin</h3>
          <p className="text-xs text-muted-foreground">
            Operations director. Manages applications, assigns counselors, verifies offers.
          </p>
        </Card>

        <Card className="border-border/60 bg-card/75 p-4 space-y-1.5">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Role 3</span>
          <h3 className="text-base font-bold text-foreground">Counsellor</h3>
          <p className="text-xs text-muted-foreground">
            Front-line student advisor. Manages assigned leads, applications, calls, and documents.
          </p>
        </Card>

        <Card className="border-border/60 bg-card/75 p-4 space-y-1.5">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Role 4</span>
          <h3 className="text-base font-bold text-foreground">Staff / Reception</h3>
          <p className="text-xs text-muted-foreground">
            Front-desk intake. Records walk-ins, phone inquiries, and schedules discovery meetings.
          </p>
        </Card>
      </div>

      {/* Permission Matrix Table */}
      <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-lg overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-base font-bold text-foreground">Granular Module Authorization Matrix</CardTitle>
          <CardDescription className="text-xs">
            Toggle permissions to grant or revoke specific operational capabilities.
          </CardDescription>
        </CardHeader>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30 text-muted-foreground uppercase text-[11px] tracking-wider font-semibold">
                <th className="py-3 px-4">Feature / Module Capability</th>
                <th className="py-3 px-3 text-center">Super Admin</th>
                <th className="py-3 px-3 text-center">Admin</th>
                <th className="py-3 px-3 text-center">Counsellor</th>
                <th className="py-3 px-4 text-center">Staff / Intake</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {matrix.map((row, i) => (
                <tr key={row.module} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-foreground">
                    {row.module}
                  </td>

                  {/* Super Admin */}
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  </td>

                  {/* Admin */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => handleToggle(i, "admin")}
                      className={`inline-flex items-center justify-center h-6 w-6 rounded-full transition-colors ${
                        row.admin ? "bg-emerald-500/20 text-emerald-400" : "bg-muted/60 text-muted-foreground"
                      }`}
                    >
                      {row.admin ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    </button>
                  </td>

                  {/* Counsellor */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => handleToggle(i, "counsellor")}
                      className={`inline-flex items-center justify-center h-6 w-6 rounded-full transition-colors ${
                        row.counsellor ? "bg-emerald-500/20 text-emerald-400" : "bg-muted/60 text-muted-foreground"
                      }`}
                    >
                      {row.counsellor ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    </button>
                  </td>

                  {/* Staff */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggle(i, "staff")}
                      className={`inline-flex items-center justify-center h-6 w-6 rounded-full transition-colors ${
                        row.staff ? "bg-emerald-500/20 text-emerald-400" : "bg-muted/60 text-muted-foreground"
                      }`}
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
