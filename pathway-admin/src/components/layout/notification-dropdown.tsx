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

// Static non-inquiry notifications (offers, follow-ups etc.)
const STATIC_NOTIFICATIONS: LiveNotification[] = [
  {
    id: "static-offer-1",
    title: "Offer Received!",
    message: "University of Manchester released a conditional offer for Zainab Al-Mansoor.",
    type: "deadline",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    link: "/applications",
  },
  {
    id: "static-followup-1",
    title: "Follow-up Overdue",
    message: "Australian high commission follow-up for Arjun Nair is overdue by 1 day.",
    type: "followup",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: false,
    link: "/tasks",
  },
]

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const [liveNotifs, setLiveNotifs] = React.useState<LiveNotification[]>([])
  const [staticRead, setStaticRead] = React.useState<Set<string>>(new Set())
  const [readIds, setReadIds] = React.useState<Set<string>>(new Set())
  // Tick every 60s to refresh relative times
  const [, setTick] = React.useState(0)

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
    const statics = STATIC_NOTIFICATIONS.map(n => ({ ...n, read: staticRead.has(n.id) }))
    const live = liveNotifs.map(n => ({ ...n, read: readIds.has(n.id) }))
    return [...live, ...statics].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }, [liveNotifs, readIds, staticRead])

  const unreadCount = allNotifications.filter(n => !n.read).length

  const markAllRead = () => {
    setReadIds(new Set(liveNotifs.map(n => n.id)))
    setStaticRead(new Set(STATIC_NOTIFICATIONS.map(n => n.id)))
  }

  const markItemRead = (id: string) => {
    if (STATIC_NOTIFICATIONS.some(n => n.id === id)) {
      setStaticRead(prev => new Set([...prev, id]))
    } else {
      setReadIds(prev => new Set([...prev, id]))
    }
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
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
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

          <div className="p-2 border-t border-border/50 text-center bg-muted/10">
            <Link
              href="/audit-logs"
              onClick={() => setIsOpen(false)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              View System Activity Logs &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
