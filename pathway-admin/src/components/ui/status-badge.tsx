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
  let styleClasses = "bg-white/[0.04] text-[#BDB0A4] border-white/10"
  let dotColor = "bg-[#897B70]"

  switch (status) {
    /* ── New / Incoming ─────────────────────── */
    case "New":
      styleClasses =
        "bg-amber-500/10 text-amber-300 border-amber-500/25 font-semibold shadow-[0_0_8px_rgba(245,158,11,0.08)]"
      dotColor = "bg-amber-400 shadow-[0_0_4px_rgba(245,158,11,0.6)]"
      break

    /* ── In Progress ─────────────────────────── */
    case "Contacted":
      styleClasses = "bg-sky-500/10 text-sky-300 border-sky-500/25"
      dotColor = "bg-sky-400"
      break
    case "Counselling Scheduled":
    case "Counselling":
      styleClasses = "bg-violet-500/10 text-violet-300 border-violet-500/25"
      dotColor = "bg-violet-400"
      break
    case "Counselling Completed":
    case "Interested":
    case "Ready to Apply":
    case "Shortlisted":
      styleClasses = "bg-indigo-500/10 text-indigo-300 border-indigo-500/25"
      dotColor = "bg-indigo-400"
      break
    case "Application Started":
    case "Application":
    case "Application Submitted":
    case "Under Review":
    case "Uploaded":
      styleClasses = "bg-blue-500/10 text-blue-300 border-blue-500/25"
      dotColor = "bg-blue-400"
      break

    /* ── Offers / Progress ───────────────────── */
    case "Conditional Offer":
      styleClasses = "bg-teal-500/10 text-teal-300 border-teal-500/25"
      dotColor = "bg-teal-400"
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
        "bg-emerald-500/10 text-emerald-300 border-emerald-500/25 font-medium shadow-[0_0_8px_rgba(16,185,129,0.08)]"
      dotColor = "bg-emerald-400 shadow-[0_0_4px_rgba(16,185,129,0.6)]"
      break

    /* ── Amber / Payment ─────────────────────── */
    case "Deposit Paid":
    case "Deposit Pending":
      styleClasses =
        "bg-amber-500/12 text-amber-200 border-amber-500/30 font-medium"
      dotColor = "bg-amber-400"
      break

    /* ── Visa ────────────────────────────────── */
    case "Visa Processing":
      styleClasses = "bg-purple-500/10 text-purple-300 border-purple-500/25"
      dotColor = "bg-purple-400"
      break

    /* ── Action Needed ───────────────────────── */
    case "Documents Pending":
    case "Requested":
      styleClasses =
        "bg-orange-500/12 text-orange-300 border-orange-500/30 font-medium shadow-[0_0_8px_rgba(255,107,0,0.1)]"
      dotColor = "bg-orange-400 shadow-[0_0_4px_rgba(255,107,0,0.6)]"
      break

    /* ── Negative ────────────────────────────── */
    case "Not Interested":
    case "Lost":
    case "Rejected":
    case "Overdue":
      styleClasses = "bg-rose-500/10 text-rose-300 border-rose-500/25"
      dotColor = "bg-rose-400"
      break

    /* ── Partial / Pending ───────────────────── */
    case "Partial":
      styleClasses = "bg-yellow-500/10 text-yellow-300 border-yellow-500/25"
      dotColor = "bg-yellow-400"
      break
    case "Pending":
    case "Not Submitted":
      styleClasses = "bg-white/[0.04] text-[#BDB0A4] border-white/10"
      dotColor = "bg-[#897B70]"
      break
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border tracking-wide whitespace-nowrap transition-colors",
        styleClasses,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColor)} />
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
  let styleClasses = "bg-white/[0.04] text-[#897B70] border-white/10"

  switch (priority) {
    case "Urgent":
      styleClasses =
        "bg-rose-500/15 text-rose-300 border-rose-500/35 font-bold shadow-[0_0_8px_rgba(244,63,94,0.15)]"
      break
    case "High":
      styleClasses =
        "bg-orange-500/15 text-orange-300 border-orange-500/35 font-semibold shadow-[0_0_8px_rgba(255,107,0,0.15)]"
      break
    case "Medium":
      styleClasses =
        "bg-sky-500/10 text-sky-300 border-sky-500/25 font-medium"
      break
    case "Low":
      styleClasses =
        "bg-white/[0.04] text-[#897B70] border-white/10 font-normal"
      break
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border uppercase tracking-wider",
        styleClasses,
        className
      )}
    >
      {priority}
    </span>
  )
}
