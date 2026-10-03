"use client"

import * as React from "react"
import { Bell, Check, Clock, FileText, UserPlus, Inbox, CheckCircle2, AlertTriangle } from "lucide-react"
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
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const [liveNotifs, setLiveNotifs] = React.useState<LiveNotification[]>([])
  const [readIds, setReadIds] = React.useState<Set<string>>(new Set())
  const [pushStatus, setPushStatus] = React.useState<PushPermissionState>("default")
  // Tick every 60s to refresh relative times
  const [, setTick] = React.useState(0)

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
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
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
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-9 w-9 rounded-full hover:bg-muted/50 transition-colors"
        aria-label="View notifications"
      >
        <Bell className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground shadow-sm animate-pulse">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="fixed top-16 right-2 sm:absolute sm:top-full sm:right-0 sm:mt-2 w-[calc(100vw-1rem)] sm:w-96 max-w-[380px] rounded-2xl border border-border/70 bg-card/95 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
              >
                <Check className="h-3 w-3" /> Mark all read
              </button>
            )}
          </div>

          {/* Mobile Phone Push Notification Action Bar */}
          <div className="px-3.5 py-2.5 bg-primary/10 border-b border-border/40 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className={cn(
                "h-2 w-2 rounded-full shrink-0",
                pushStatus === "granted" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" : "bg-amber-500 animate-pulse"
              )} />
              <span className="text-[11.5px] font-medium text-foreground truncate">
                {pushStatus === "granted" ? "Phone Alerts Active" : "Get Phone Push Alerts"}
              </span>
            </div>

            {pushStatus === "granted" ? (
              <button
                type="button"
                onClick={handleTestPush}
                className="shrink-0 text-[10.5px] font-semibold px-2.5 py-1 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                title="Send a sample notification to your phone"
              >
                Send Test Alert
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEnablePush}
                className="shrink-0 text-[10.5px] font-semibold px-3 py-1 rounded-lg bg-primary text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
              >
                Turn On
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto custom-scrollbar divide-y divide-border/30">
            {allNotifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No notifications right now
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
                    "flex items-start gap-3 p-3.5 transition-colors hover:bg-muted/30 text-left block",
                    !notif.read && "bg-primary/5"
                  )}
                >
                  <div className="p-2 rounded-xl bg-muted/60 shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={cn("text-xs font-semibold truncate", !notif.read ? "text-foreground" : "text-muted-foreground")}>
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground/70 shrink-0 whitespace-nowrap">
                        {relativeTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 self-center" />
                  )}
                </Link>
              ))
            )}
          </div>

        
        </div>
      )}
    </div>
  )
}
