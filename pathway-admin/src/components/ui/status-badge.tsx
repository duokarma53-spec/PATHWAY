import * as React from "react"
import { cn } from "@/lib/utils"

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Counselling Scheduled"
  | "Counselling Completed"
  | "Interested"
  | "Application Started"
  | "Converted to Student"
  | "Not Interested"
  | "Lost"

export type StudentStatus =
  | "Prospect"
  | "Counselling"
  | "Application"
  | "Offer Received"
  | "Deposit Paid"
  | "Visa Processing"
  | "Visa Approved"
  | "Enrolled"
  | "Completed"
  | "Lost"

export type ApplicationStatus =
  | "Shortlisted"
  | "Documents Pending"
  | "Ready to Apply"
  | "Application Submitted"
  | "Under Review"
  | "Conditional Offer"
  | "Unconditional Offer"
  | "Rejected"
  | "Deposit Pending"
  | "Deposit Paid"
  | "Visa Processing"
  | "Completed"

export type DocumentStatus =
  | "Not Submitted"
  | "Requested"
  | "Uploaded"
  | "Under Review"
  | "Approved"
  | "Rejected"

export type PriorityLevel = "Low" | "Medium" | "High" | "Urgent"

interface StatusBadgeProps {
  status: string
  className?: string
}

/*
  Light-mode status badges:
  • All colours use warm, desaturated tones that read on cream/beige backgrounds
  • Text is always darker shade of the badge hue — never pure-colour saturated
*/
export function StatusBadge({ status, className }: StatusBadgeProps) {
  let styleClasses =
    "bg-[hsl(36_20%_91%)] text-[hsl(24_10%_44%)] border-[hsl(35_20%_82%)]"   // neutral warm

  switch (status) {
    /* ── New / Incoming ─────────────────────── */
    case "New":
      styleClasses =
        "bg-amber-500/10 text-[hsl(27_55%_36%)] border-amber-400/30 font-semibold"
      break

    /* ── In Progress ─────────────────────────── */
    case "Contacted":
      styleClasses =
        "bg-sky-500/10 text-[hsl(200_50%_32%)] border-sky-400/30"
      break
    case "Counselling Scheduled":
    case "Counselling":
      styleClasses =
        "bg-violet-500/10 text-[hsl(270_45%_36%)] border-violet-400/30"
      break
    case "Counselling Completed":
    case "Interested":
    case "Ready to Apply":
    case "Shortlisted":
      styleClasses =
        "bg-indigo-500/10 text-[hsl(234_48%_36%)] border-indigo-400/30"
      break
    case "Application Started":
    case "Application":
    case "Application Submitted":
    case "Under Review":
    case "Uploaded":
      styleClasses =
        "bg-blue-500/10 text-[hsl(214_55%_34%)] border-blue-400/30"
      break

    /* ── Offers / Progress ───────────────────── */
    case "Conditional Offer":
      styleClasses =
        "bg-teal-500/10 text-[hsl(173_42%_30%)] border-teal-400/30"
      break

    /* ── Positive / Completed ────────────────── */
    case "Offer Received":
    case "Unconditional Offer":
    case "Visa Approved":
    case "Enrolled":
    case "Completed":
    case "Approved":
    case "Paid":
    case "Converted to Student":
      styleClasses =
        "bg-emerald-500/10 text-[hsl(152_48%_28%)] border-emerald-400/30 font-medium"
      break

    /* ── Amber / Payment ─────────────────────── */
    case "Deposit Paid":
    case "Deposit Pending":
      styleClasses =
        "bg-amber-500/12 text-[hsl(27_55%_36%)] border-amber-400/35 font-medium"
      break

    /* ── Visa ────────────────────────────────── */
    case "Visa Processing":
      styleClasses =
        "bg-purple-500/10 text-[hsl(280_38%_34%)] border-purple-400/30"
      break

    /* ── Action Needed ───────────────────────── */
    case "Documents Pending":
    case "Requested":
      styleClasses =
        "bg-orange-500/10 text-[hsl(22 60% 32%)] border-orange-400/30"
      break

    /* ── Negative ────────────────────────────── */
    case "Not Interested":
    case "Lost":
    case "Rejected":
    case "Overdue":
      styleClasses =
        "bg-rose-500/10 text-[hsl(0_52%_36%)] border-rose-400/30"
      break

    /* ── Partial / Pending ───────────────────── */
    case "Partial":
      styleClasses =
        "bg-yellow-400/10 text-[hsl(42_60%_30%)] border-yellow-400/30"
      break
    case "Pending":
    case "Not Submitted":
      styleClasses =
        "bg-[hsl(36_20%_91%)] text-[hsl(24_10%_44%)] border-[hsl(35_20%_82%)]"
      break
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] border tracking-wide whitespace-nowrap transition-colors",
        styleClasses,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70 shrink-0" />
      {status}
    </span>
  )
}

export function PriorityBadge({
  priority,
  className,
}: {
  priority: PriorityLevel | string
  className?: string
}) {
  let styleClasses =
    "bg-[hsl(36_20%_91%)] text-[hsl(24_10%_44%)] border-[hsl(35_20%_82%)]"

  switch (priority) {
    case "Urgent":
      styleClasses =
        "bg-rose-500/12 text-[hsl(0_52%_34%)] border-rose-400/35 font-bold"
      break
    case "High":
      styleClasses =
        "bg-orange-500/10 text-[hsl(22_60%_32%)] border-orange-400/30 font-semibold"
      break
    case "Medium":
      styleClasses =
        "bg-blue-500/10 text-[hsl(214_55%_34%)] border-blue-400/30"
      break
    case "Low":
      styleClasses =
        "bg-[hsl(36_20%_91%)] text-[hsl(24_10%_48%)] border-[hsl(35_20%_82%)]"
      break
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-medium border uppercase tracking-wider",
        styleClasses,
        className
      )}
    >
      {priority}
    </span>
  )
}
