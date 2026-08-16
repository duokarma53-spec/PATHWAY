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
      <div className="flex-1 overflow-auto py-8 custom-scrollbar">
        <nav className="flex flex-col gap-8 px-4">
          {navigationGroups.map((group) => (
            <div key={group.label} className="flex flex-col gap-1.5">
              {!collapsed && (
                <span className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">
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
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition-all duration-300 relative overflow-hidden",
                      isActive
                        ? "text-primary font-medium"
                        : "text-muted-foreground font-medium hover:text-foreground",
                      collapsed && "justify-center px-0 rounded-lg"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    {isActive && !collapsed && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/15 to-transparent border-l-2 border-primary" />
                    )}
                    {!isActive && !collapsed && (
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300 rounded-xl" />
                    )}
                    
                    <item.icon className={cn(
                      "h-4 w-4 shrink-0 transition-all duration-300 relative z-10",
                      isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"
                    )} />
                    {!collapsed && <span className="relative z-10 tracking-wide">{item.name}</span>}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-border/40 p-4 flex flex-col gap-2 bg-background/30 backdrop-blur-md">
        <Button
          variant="ghost"
          className={cn("w-full justify-start text-muted-foreground hover:text-foreground text-sm font-medium rounded-xl hover:bg-foreground/5 transition-colors duration-300", collapsed && "justify-center px-2")}
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="ml-3 tracking-wide">Logout</span>}
        </Button>
      </div>
    </>
  )
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { isOpen, setIsOpen } = useSidebar()

  // Close drawer when navigating on mobile
  const handleNavClick = () => setIsOpen(false)

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────── */}
      <div
        className={cn(
          "relative hidden md:flex flex-col border-r border-border/40 bg-background/60 backdrop-blur-xl transition-all duration-300",
          collapsed ? "w-[80px]" : "w-[280px]"
        )}
      >
        {/* Header */}
        <div className="flex h-[72px] items-center justify-between px-6 border-b border-border/40">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-semibold text-sm shadow-sm">
                P
              </div>
              <span className="text-lg font-light tracking-[0.15em] text-foreground uppercase">
                Pathway
              </span>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-semibold text-sm shadow-sm">
              P
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3.5 top-6 h-7 w-7 rounded-full border border-border/60 bg-background/80 backdrop-blur-sm shadow-sm hover:bg-muted transition-all duration-300"
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
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[300px] flex flex-col border-r border-white/10 bg-background/75 backdrop-blur-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden shadow-[8px_0_40px_-12px_rgba(0,0,0,0.3)]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="flex h-[72px] items-center justify-between px-6 border-b border-border/30 bg-background/30">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-semibold text-sm shadow-sm">
              P
            </div>
            <span className="text-lg font-light tracking-[0.15em] text-foreground uppercase">
              Pathway
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-foreground/10 bg-background/20 backdrop-blur-md transition-all duration-300"
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
