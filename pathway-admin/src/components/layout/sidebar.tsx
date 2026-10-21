"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Users, GraduationCap, FileText, Settings,
  MessageSquare, Compass, CheckSquare, FolderOpen, Calendar,
  CreditCard, BarChart3, TrendingUp, Inbox,
  Landmark, UserCheck, X, ChevronLeft, ChevronRight, LogOut,
  ExternalLink, ShieldAlert,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useSidebar } from "@/contexts/sidebar-context"
import { DownloadAppButton } from "../pwa/install-prompt"
import { BrandLogo } from "../ui/brand-logo"
import { InstagramIcon } from "../ui/instagram-icon"

// ─────────────────────────────────────────────────────────────────────────────
// 5-Hour Security Session Reminder (Dark Theme)
// ─────────────────────────────────────────────────────────────────────────────
const SESSION_DURATION_MS = 5 * 60 * 60 * 1000 // 5 hours
export const SESSION_START_KEY = "pathway_session_start"

function SecurityReminderBanner({ onLogout }: { onLogout: () => void }) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (typeof window === "undefined") return

    let start = parseInt(localStorage.getItem(SESSION_START_KEY) || "0", 10)
    if (!start || isNaN(start)) {
      start = Date.now()
      localStorage.setItem(SESSION_START_KEY, String(start))
    }

    const elapsed = Date.now() - start
    const remaining = SESSION_DURATION_MS - elapsed

    if (remaining <= 0) {
      setVisible(true)
      return
    }

    timerRef.current = setTimeout(() => {
      setVisible(true)
    }, remaining)

    return () => clearTimeout(timerRef.current)
  }, [])

  if (!visible || dismissed) return null

  return (
    <div
      className={cn(
        "fixed bottom-20 left-1/2 -translate-x-1/2 z-[200]",
        "w-[calc(100vw-32px)] max-w-sm",
        "md:bottom-6 md:left-auto md:right-6 md:-translate-x-0",
        "rounded-2xl bg-[#1D1510]/95 border border-primary/35",
        "p-4 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-4 duration-400"
      )}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="h-8 w-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
          <ShieldAlert className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-[#F8F5F1] leading-tight">Security Reminder</p>
          <p className="text-[11.5px] text-[#BDB0A4] mt-0.5 leading-snug">
            You&apos;ve been logged in for <strong className="text-primary font-semibold">5 hours</strong>. For your account&apos;s security,
            please log out and sign back in.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            localStorage.removeItem(SESSION_START_KEY)
            onLogout()
          }}
          className="flex-1 py-2 rounded-xl bg-primary hover:bg-primary/90 active:scale-[0.98] text-white text-[12px] font-semibold shadow-sm transition-all"
        >
          Logout Now
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-[#BDB0A4] text-[12px] font-medium border border-white/[0.08] transition-colors"
        >
          Later
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Navigation config (Exact routes preserved)
// ─────────────────────────────────────────────────────────────────────────────
type NavItem = { name: string; href: string; icon: React.ElementType; badge?: string | number }
type NavGroup = { label: string; items: NavItem[] }

const navigationGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "CRM",
    items: [
      { name: "Leads",          href: "/leads",          icon: Users },
      { name: "Students",       href: "/students",       icon: GraduationCap },
      { name: "Follow-ups",     href: "/follow-ups",     icon: UserCheck },
      { name: "Communications", href: "/communications", icon: MessageSquare },
    ],
  },
  {
    label: "Applications",
    items: [
      { name: "Applications", href: "/applications", icon: FileText },
      { name: "Universities", href: "/universities", icon: Landmark },
      { name: "Destinations", href: "/destinations", icon: Compass },
    ],
  },
  {
    label: "Website",
    items: [
      { name: "Inquiries", href: "/inquiries", icon: Inbox },
    ],
  },
  {
    label: "Student Management",
    items: [
      { name: "Documents",    href: "/documents",    icon: FolderOpen },
      { name: "Appointments", href: "/appointments", icon: Calendar },
      { name: "Tasks",        href: "/tasks",        icon: CheckSquare },
      { name: "Payments",     href: "/payments",     icon: CreditCard },
    ],
  },
  {
    label: "Analytics",
    items: [
      { name: "Reports",     href: "/reports",     icon: BarChart3 },
      { name: "Performance", href: "/performance", icon: TrendingUp },
    ],
  },
  {
    label: "Administration",
    items: [
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// NavContent — scrollable nav + pinned footer
// ─────────────────────────────────────────────────────────────────────────────
function NavContent({
  collapsed,
  onNavClick,
  onLogout,
}: {
  collapsed: boolean
  onNavClick?: () => void
  onLogout: () => void
}) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* ── Scrollable nav area ─────────────────────── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3.5 custom-scrollbar">
        <nav className="flex flex-col gap-5 px-2.5">
          {navigationGroups.map((group) => (
            <div key={group.label} className="flex flex-col gap-0.5">
              {!collapsed && (
                <span className="px-3 text-[9.5px] font-bold uppercase tracking-[0.24em] text-[#897B70] mb-1">
                  {group.label}
                </span>
              )}
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (pathname.startsWith(`${item.href}/`) && item.href !== "/")
                const Icon = item.icon

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onNavClick}
                    className={cn(
                      "group relative flex items-center gap-3 transition-all duration-200",
                      collapsed
                        ? isActive
                          ? "h-11 w-11 mx-auto rounded-2xl bg-gradient-to-br from-primary via-[#FF6B00] to-[#D45400] text-white shadow-lg shadow-primary/30 flex items-center justify-center scale-105"
                          : "h-10 w-10 mx-auto rounded-xl text-[#897B70] hover:text-[#F8F5F1] hover:bg-white/[0.06] flex items-center justify-center"
                        : isActive
                          ? "text-[#F8F5F1] bg-gradient-to-r from-primary/20 to-primary/5 border-l-[3px] border-primary font-semibold shadow-[inset_0_1px_0_rgba(255,107,0,0.15)] rounded-xl px-3 py-2 text-[13px]"
                          : "text-[#BDB0A4] hover:text-[#F8F5F1] hover:bg-white/[0.04] rounded-xl px-3 py-2 text-[13px]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "transition-transform duration-200",
                        collapsed ? (isActive ? "h-5 w-5 text-white" : "h-[18px] w-[18px]") : "h-[16px] w-[16px] shrink-0",
                        !collapsed && (isActive ? "text-primary" : "text-[#897B70] group-hover:text-[#F8F5F1]")
                      )}
                    />

                    {!collapsed && (
                      <span className="relative z-10 flex-1 tracking-[0.01em] truncate">
                        {item.name}
                      </span>
                    )}

                    {!collapsed && item.badge && (
                      <span
                        className={cn(
                          "relative z-10 px-1.5 py-0.5 text-[9.5px] font-semibold rounded-full",
                          item.badge === "New" ? "badge-amber" : "badge-neutral"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Tooltip on Collapsed Icon-Rail */}
                    {collapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[#271A12] border border-white/[0.1] text-xs font-semibold text-[#F8F5F1] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 shadow-xl z-50">
                        {item.name}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* ── Pinned footer — dark, compact, refined ─────── */}
      <div className="shrink-0 border-t border-white/[0.07] px-2.5 pt-2.5 pb-3 flex flex-col gap-1.5">
        {/* Instagram Link — shown when expanded */}
        {!collapsed && (
          <a
            href="https://www.instagram.com/pathwayeduconsultancy?stkn=YnY3M2R0MzFwNzk="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 w-full rounded-xl px-2.5 py-2 text-[12px] font-medium text-[#BDB0A4] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-primary/40 transition-all duration-200 group"
            title="Official Instagram (@pathwayeduconsultancy)"
          >
            <InstagramIcon className="h-4 w-4 shrink-0 text-[#BDB0A4] group-hover:text-primary transition-colors" />
            <div className="flex flex-col min-w-0 flex-1 leading-tight text-left">
              <span className="font-semibold text-[#F8F5F1] text-[11.5px] group-hover:text-primary transition-colors">
                Instagram
              </span>
              <span className="text-[9.5px] text-[#897B70] truncate">
                @pathwayeduconsultancy
              </span>
            </div>
            <ExternalLink className="h-3 w-3 text-[#897B70] group-hover:text-primary shrink-0 transition-colors" />
          </a>
        )}

        {/* PWA install CTA */}
        {!collapsed && <DownloadAppButton variant="sidebar" />}

        {/* Logout */}
        <button
          onClick={onLogout}
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "w-full flex items-center rounded-xl transition-colors duration-200",
            collapsed
              ? "h-10 w-10 mx-auto justify-center text-[#897B70] hover:text-red-400 hover:bg-red-500/10"
              : "px-2.5 py-2 text-[12.5px] font-medium text-[#BDB0A4] hover:text-red-400 hover:bg-red-500/10 justify-start"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="ml-2.5 tracking-wide">Logout</span>}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar — Desktop + Mobile Drawer
// ─────────────────────────────────────────────────────────────────────────────
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(true)
  const { isOpen, setIsOpen } = useSidebar()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_START_KEY)
      document.cookie = "pathway_demo_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    }
    await supabase.auth.signOut()
    router.push("/login")
  }

  const handleNavClick = () => setIsOpen(false)

  return (
    <>
      {/* ── 5-Hour floating security reminder ─────────── */}
      <SecurityReminderBanner onLogout={handleLogout} />

      {/* ── Desktop Sidebar ─────────────────────────── */}
      <aside
        className={cn(
          "relative hidden md:flex flex-col glass-sidebar transition-all duration-300 z-20 shrink-0",
          collapsed ? "w-[72px]" : "w-[264px]"
        )}
      >
        {/* Header Branding */}
        <div
          className={cn(
            "flex h-[64px] shrink-0 items-center border-b border-white/[0.08]",
            collapsed ? "justify-center px-3" : "px-4 gap-3"
          )}
        >
          <BrandLogo size="sm" withGlow />
          {!collapsed && (
            <div className="flex flex-col leading-tight select-none">
              <span className="text-[14.5px] font-bold tracking-[0.08em] text-[#F8F5F1] uppercase">
                Pathway
              </span>
              <span className="text-[9px] font-medium tracking-[0.22em] text-[#897B70] uppercase">
                Education CRM
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          className="absolute -right-3 top-[20px] h-6 w-6 rounded-full border border-white/[0.12] bg-[#1D1510] hover:bg-[#271A12] text-[#BDB0A4] hover:text-[#F8F5F1] hover:border-primary/50 shadow-md transition-all flex items-center justify-center z-30"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>

        <NavContent collapsed={collapsed} onLogout={handleLogout} />
      </aside>

      {/* ── Mobile Overlay ──────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ───────────────────────────── */}
      <div
        className={cn(
          "fixed top-0 bottom-16 left-0 z-50 w-[280px] flex flex-col bg-[#120E0B]/98 backdrop-blur-2xl border-r border-white/[0.08]",
          "transition-transform duration-300 ease-out",
          "md:hidden shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="flex h-[64px] shrink-0 items-center justify-between px-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" withGlow />
            <div className="flex flex-col leading-tight">
              <span className="text-[14.5px] font-bold tracking-[0.08em] text-[#F8F5F1] uppercase">
                Pathway
              </span>
              <span className="text-[9px] font-medium tracking-[0.22em] text-[#897B70] uppercase">
                Education CRM
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-[#BDB0A4] hover:text-[#F8F5F1] hover:bg-white/[0.08] transition-colors"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav + Footer */}
        <NavContent
          collapsed={false}
          onNavClick={handleNavClick}
          onLogout={handleLogout}
        />
      </div>
    </>
  )
}
