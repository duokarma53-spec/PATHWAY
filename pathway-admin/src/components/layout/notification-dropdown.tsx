"use client"

import * as React from "react"
import { Bell, Check, Clock, AlertTriangle, FileText, UserPlus, Inbox, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { INITIAL_NOTIFICATIONS, NotificationItem } from "@/lib/mock-data"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markItemRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "inquiry":
        return <Inbox className="h-4 w-4 text-amber-400" />
      case "lead":
        return <UserPlus className="h-4 w-4 text-primary" />
      case "followup":
        return <Clock className="h-4 w-4 text-destructive" />
      case "document":
        return <FileText className="h-4 w-4 text-blue-400" />
      case "deadline":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      case "payment":
        return <AlertTriangle className="h-4 w-4 text-purple-400" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
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
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No notifications right now
              </div>
            ) : (
              notifications.map((notif) => (
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
                      <span className="text-[10px] text-muted-foreground/70 shrink-0">
                        {notif.time}
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
