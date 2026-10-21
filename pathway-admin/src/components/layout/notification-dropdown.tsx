"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Bell, Check, Clock, FileText, UserPlus, Inbox, CheckCircle2, AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"

interface LiveNotification {
  id: string
  title: string
  message: string
  type: "inquiry" | "lead" | "followup" | "document" | "deadline" | "payment"
  createdAt: Date
  read: boolean
  link: string
}

function relativeTime(date: Date): string {
  try {
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return "just now"
  }
}

import {
  getPushPermissionState,
  requestPushPermission,
  sendTestPhoneNotification,
  PushPermissionState,
} from "@/lib/notifications/push-service"

// Only real live notifications from Supabase
export function NotificationDropdown() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const [liveNotifs, setLiveNotifs] = React.useState<LiveNotification[]>([])
  const [readIds, setReadIds] = React.useState<Set<string>>(new Set())
  const [pushStatus, setPushStatus] = React.useState<PushPermissionState>("default")
  // Tick every 60s to refresh relative times
  const [, setTick] = React.useState(0)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    setPushStatus(getPushPermissionState())
  }, [isOpen])

  const handleEnablePush = async () => {
    const granted = await requestPushPermission()
    setPushStatus(granted ? "granted" : "denied")
  }

  const handleTestPush = async () => {
    await sendTestPhoneNotification()
  }

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem("pathway_read_notifs") || "[]")
        if (Array.isArray(saved) && saved.length > 0) {
          setReadIds(new Set(saved))
        }
      } catch {}
    }
    const timer = setInterval(() => setTick(t => t + 1), 60000)
    return () => clearInterval(timer)
  }, [])

  React.useEffect(() => {
    const supabase = createClient()

    async function loadRecentLeads() {
      const { data, error } = await supabase
        .from("leads")
        .select("id, full_name, destination, course, created_at")
        .order("created_at", { ascending: false })
        .limit(10)

      if (!error && data) {
        const mapped: LiveNotification[] = data.map((row) => ({
          id: `lead-${row.id}`,
          title: "New Website Inquiry",
          message: `${row.full_name || "Prospective Student"} submitted an inquiry for ${row.course || "Higher Education"} (${row.destination || "Study Abroad"}).`,
          type: "inquiry" as const,
          createdAt: new Date(row.created_at),
          read: false,
          link: "/inquiries",
        }))
        setLiveNotifs(mapped)
      }
    }

    loadRecentLeads()

    const channel = supabase
      .channel("notif_leads_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leads" },
        (payload) => {
          const row = payload.new as { id: string; full_name: string; destination: string; course: string; created_at: string }
          const newNotif: LiveNotification = {
            id: `lead-${row.id}`,
            title: "New Website Inquiry",
            message: `${row.full_name || "Prospective Student"} submitted an inquiry for ${row.course || "Higher Education"} (${row.destination || "Study Abroad"}).`,
            type: "inquiry",
            createdAt: new Date(row.created_at || Date.now()),
            read: false,
            link: "/inquiries",
          }
          setLiveNotifs((prev) => [newNotif, ...prev.filter(n => n.id !== newNotif.id)])
        }
      )
      .subscribe()

    const handleWindowEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (!detail) return
      const newNotif: LiveNotification = {
        id: `lead-${detail.id || Date.now()}`,
        title: "New Website Inquiry",
        message: `${detail.full_name || "Prospective Student"} submitted an inquiry for ${detail.course || "Higher Education"} (${detail.destination || "Study Abroad"}).`,
        type: "inquiry",
        createdAt: new Date(detail.created_at || Date.now()),
        read: false,
        link: "/inquiries",
      }
      setLiveNotifs((prev) => [newNotif, ...prev.filter(n => n.id !== newNotif.id)])
    }
    window.addEventListener("pathway_new_lead", handleWindowEvent)

    return () => {
      supabase.removeChannel(channel)
      window.removeEventListener("pathway_new_lead", handleWindowEvent)
    }
  }, [])

  const allNotifications = React.useMemo(() => {
    return liveNotifs
      .map(n => ({ ...n, read: readIds.has(n.id) }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }, [liveNotifs, readIds])

  const unreadCount = allNotifications.filter(n => !n.read).length

  const markAllRead = () => {
    const allIds = liveNotifs.map(n => n.id)
    setReadIds(new Set(allIds))
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("pathway_read_notifs", JSON.stringify(allIds))
      } catch {}
    }
  }

  const markItemRead = (id: string) => {
    setReadIds(prev => {
      const next = new Set([...prev, id])
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("pathway_read_notifs", JSON.stringify(Array.from(next)))
        } catch {}
      }
      return next
    })
  }

  const getIcon = (type: LiveNotification["type"]) => {
    switch (type) {
      case "inquiry":  return <Inbox className="h-4 w-4 text-amber-400" />
      case "lead":     return <UserPlus className="h-4 w-4 text-primary" />
      case "followup": return <Clock className="h-4 w-4 text-destructive" />
      case "document": return <FileText className="h-4 w-4 text-blue-400" />
      case "deadline": return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      case "payment":  return <AlertTriangle className="h-4 w-4 text-purple-400" />
      default:         return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-9 w-9 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-[#BDB0A4] hover:text-[#F8F5F1] hover:border-primary/40 transition-all"
        aria-label="View notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow-sm shadow-primary/40 animate-pulse">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && mounted && typeof document !== "undefined" && createPortal(
        <>
          {/* Full-screen Backdrop Blur & Dim Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998] animate-in fade-in-0 duration-200"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Liquid Glass Notification Panel */}
          <div
            ref={dropdownRef}
            className="fixed top-16 right-2 sm:right-6 md:right-8 w-[calc(100vw-1rem)] sm:w-[420px] max-w-[420px] rounded-2xl border border-orange-500/35 bg-[#140F0C] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_35px_rgba(255,107,0,0.2)] z-[9999] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
            role="dialog"
            aria-label="Notifications panel"
          >
            {/* Top liquid reflective ambient highlight */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-orange-400/50 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.08] bg-gradient-to-r from-orange-500/15 via-[#1D1612] to-[#140F0C]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/25 text-orange-400 border border-orange-500/40 shadow-[0_0_8px_rgba(255,107,0,0.3)]">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Check className="h-3 w-3" /> Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-7 w-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-[#BDB0A4] hover:text-white flex items-center justify-center transition-colors ml-1"
                  aria-label="Close notifications"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mobile Phone Push Notification Action Bar */}
            <div className="px-3.5 py-2.5 bg-gradient-to-r from-orange-500/10 via-[#1A130F] to-[#140F0C] border-b border-white/[0.06] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className={cn(
                  "h-2 w-2 rounded-full shrink-0",
                  pushStatus === "granted" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" : "bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(255,107,0,0.6)]"
                )} />
                <span className="text-[11.5px] font-medium text-[#F8F5F1] truncate">
                  {pushStatus === "granted" ? "Phone Alerts Active" : "Get Phone Push Alerts"}
                </span>
              </div>

              {pushStatus === "granted" ? (
                <button
                  type="button"
                  onClick={handleTestPush}
                  className="shrink-0 text-[10.5px] font-semibold px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-colors border border-orange-500/30"
                  title="Send a sample notification to your phone"
                >
                  Send Test Alert
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEnablePush}
                  className="shrink-0 text-[10.5px] font-semibold px-3 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm shadow-orange-500/30 hover:opacity-90 transition-opacity"
                >
                  Turn On
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[380px] overflow-y-auto custom-scrollbar divide-y divide-white/[0.06] bg-[#140F0C]">
              {allNotifications.length === 0 ? (
                <div className="py-12 px-4 text-center flex flex-col items-center justify-center space-y-2">
                  <div className="h-10 w-10 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-muted-foreground/50">
                    <Inbox className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold text-[#F8F5F1]">No notifications right now</p>
                  <p className="text-[11px] text-[#897B70]">New website inquiries and lead updates will appear here live.</p>
                </div>
              ) : (
                allNotifications.map((notif) => (
                  <Link
                    key={notif.id}
                    href={notif.link}
                    onClick={() => {
                      markItemRead(notif.id)
                      setIsOpen(false)
                    }}
                    className={cn(
                      "flex items-start gap-3 p-3.5 transition-all text-left block relative group",
                      !notif.read
                        ? "bg-gradient-to-r from-orange-500/[0.09] via-white/[0.02] to-transparent hover:from-orange-500/[0.14]"
                        : "hover:bg-white/[0.04]"
                    )}
                  >
                    {!notif.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-orange-500 shadow-[0_0_8px_rgba(255,107,0,0.8)]" />
                    )}
                    <div className="p-2 rounded-xl bg-black/60 border border-white/[0.08] shrink-0 mt-0.5 group-hover:border-orange-500/40 transition-colors">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={cn("text-xs font-semibold truncate", !notif.read ? "text-white" : "text-[#BDB0A4]")}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-[#897B70] shrink-0 whitespace-nowrap">
                          {relativeTime(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-[#D8CDC3] mt-0.5 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="h-2 w-2 rounded-full bg-orange-500 shrink-0 self-center shadow-[0_0_8px_rgba(255,107,0,0.9)]" />
                    )}
                  </Link>
                ))
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  )
}
