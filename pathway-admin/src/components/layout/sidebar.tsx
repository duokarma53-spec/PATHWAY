"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Users, GraduationCap, FileText, Settings,
  HelpCircle, MessageSquare, Compass, Briefcase, ChevronLeft,
  ChevronRight, LogOut, CheckSquare, FolderOpen, Activity, Calendar, X
} from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useSidebar } from "@/contexts/sidebar-context"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NavItem = { name: string; href: string; icon: any; }
type NavGroup = { label: string; items: NavItem[] }

const navigationGroups: NavGroup[] = [
  {
    label: "Operations",
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Leads', href: '/leads', icon: Users },
      { name: 'Students', href: '/students', icon: GraduationCap },
      { name: 'Consultations', href: '/consultations', icon: Calendar },
      { name: 'Applications', href: '/applications', icon: FileText },
    ]
  },
  {
    label: "Content",
    items: [
      { name: 'Destinations', href: '/destinations', icon: Compass },
      { name: 'Universities', href: '/universities', icon: GraduationCap },
      { name: 'Services', href: '/services', icon: Briefcase },
      { name: 'Success Stories', href: '/success-stories', icon: MessageSquare },
      { name: 'Insights', href: '/insights', icon: FileText },
      { name: 'FAQs', href: '/faqs', icon: HelpCircle },
    ]
  },
  {
    label: "Management",
    items: [
      { name: 'Tasks', href: '/tasks', icon: CheckSquare },
      { name: 'Documents', href: '/documents', icon: FolderOpen },
      { name: 'Team', href: '/team', icon: Users },
    ]
  },
  {
    label: "System",
    items: [
      { name: 'Activity', href: '/audit-logs', icon: Activity },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  }
]

function NavContent({ collapsed, onNavClick }: { collapsed: boolean; onNavClick?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {/* Navigation */}
      <div className="flex-1 overflow-auto py-6 custom-scrollbar">
        <nav className="flex flex-col gap-6 px-4">
          {navigationGroups.map((group) => (
            <div key={group.label} className="flex flex-col gap-1">
              {!collapsed && (
                <span className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-1">
                  {group.label}
                </span>
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(`${item.href}/`) && item.href !== '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onNavClick}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all duration-200 relative",
                      isActive
                        ? "text-primary font-medium bg-muted/50"
                        : "text-muted-foreground font-medium hover:bg-muted/30 hover:text-foreground",
                      collapsed && "justify-center px-0"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    {isActive && !collapsed && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-accent" />
                    )}
                    <item.icon className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t p-4 flex flex-col gap-2">
        <Button
          variant="ghost"
          className={cn("w-full justify-start text-muted-foreground hover:text-foreground text-sm font-medium", collapsed && "justify-center px-2")}
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { isOpen, setIsOpen } = useSidebar()

  // Close drawer when navigating on mobile
  const handleNavClick = () => setIsOpen(false)

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────── */}
      <div
        className={cn(
          "relative hidden md:flex flex-col border-r bg-background transition-all duration-300",
          collapsed ? "w-[80px]" : "w-[260px]"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded flex items-center justify-center bg-primary text-primary-foreground font-semibold text-sm">
                P
              </div>
              <span className="text-base font-semibold tracking-tight text-foreground">
                Pathway
              </span>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto h-7 w-7 rounded flex items-center justify-center bg-primary text-primary-foreground font-semibold text-sm">
              P
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3.5 top-5 h-7 w-7 rounded-full border bg-background shadow-sm hover:bg-muted"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>

        <NavContent collapsed={collapsed} />
      </div>

      {/* ── Mobile Drawer ──────────────────────────── */}
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col border-r bg-background transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded flex items-center justify-center bg-primary text-primary-foreground font-semibold text-sm">
              P
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">
              Pathway
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        <NavContent collapsed={false} onNavClick={handleNavClick} />
      </div>
    </>
  )
}
