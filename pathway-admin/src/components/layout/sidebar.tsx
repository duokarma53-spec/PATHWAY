"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Users, GraduationCap, FileText, Settings,
  MessageSquare, Compass, CheckSquare, FolderOpen, Activity, Calendar,
  CreditCard, BarChart3, TrendingUp, Inbox, Layers, Star,
  Landmark, UserCheck, X, ChevronLeft, ChevronRight, LogOut
} from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useSidebar } from "@/contexts/sidebar-context"
import { DownloadAppButton } from "../pwa/install-prompt"
import { BrandLogo } from "../ui/brand-logo"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NavItem = { name: string; href: string; icon: any; badge?: string | number }
type NavGroup = { label: string; items: NavItem[] }

const navigationGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    ]
  },
  {
    label: "CRM",
    items: [
      { name: 'Leads',          href: '/leads',          icon: Users,     badge: '10' },
      { name: 'Students',       href: '/students',       icon: GraduationCap, badge: '5' },
      { name: 'Follow-ups',     href: '/follow-ups',     icon: UserCheck, badge: '3' },
      { name: 'Communications', href: '/communications', icon: MessageSquare },
    ]
  },
  {
    label: "Applications",
    items: [
      { name: 'Applications', href: '/applications', icon: FileText, badge: '7' },
      { name: 'Universities', href: '/universities', icon: Landmark },
      { name: 'Destinations', href: '/destinations', icon: Compass },
    ]
  },
  {
    label: "Student Management",
    items: [
      { name: 'Documents',    href: '/documents',    icon: FolderOpen, badge: '8' },
      { name: 'Appointments', href: '/appointments', icon: Calendar,   badge: '4' },
      { name: 'Tasks',        href: '/tasks',        icon: CheckSquare, badge: '6' },
      { name: 'Payments',     href: '/payments',     icon: CreditCard },
    ]
  },
  {
    label: "Analytics",
    items: [
      { name: 'Reports',     href: '/reports',     icon: BarChart3 },
      { name: 'Performance', href: '/performance', icon: TrendingUp },
    ]
  },
  {
    label: "Website",
    items: [
      { name: 'Inquiries',    href: '/inquiries',    icon: Inbox,   badge: 'New' },
      { name: 'Content',      href: '/content',      icon: Layers },
      { name: 'Testimonials', href: '/testimonials', icon: Star },
    ]
  },
  {
    label: "Administration",
    items: [
      { name: 'Activity Logs',     href: '/audit-logs',  icon: Activity },
      { name: 'Settings',          href: '/settings',    icon: Settings },
    ]
  }
]

function NavContent({ collapsed, onNavClick }: { collapsed: boolean; onNavClick?: () => void }) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {/* Navigation */}
      <div className="flex-1 overflow-auto py-6 custom-scrollbar">
        <nav className="flex flex-col gap-6 px-3">
          {navigationGroups.map((group) => (
            <div key={group.label} className="flex flex-col gap-0.5">
              {!collapsed && (
                <span className="px-3 text-[9.5px] font-bold uppercase tracking-[0.22em] text-espresso-light/60 mb-1.5">
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
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-250 overflow-hidden",
                      isActive
                        ? "text-primary nav-active-pill"
                        : "text-espresso-light hover:text-foreground hover:bg-white/50",
                      collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    {/* subtle hover ripple */}
                    {!isActive && !collapsed && (
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        bg-gradient-to-r from-white/60 to-white/20" />
                    )}

                    <item.icon className={cn(
                      "h-[16px] w-[16px] shrink-0 relative z-10 transition-colors duration-200",
                      isActive
                        ? "text-primary"
                        : "text-espresso-light/60 group-hover:text-foreground"
                    )} />

                    {!collapsed && (
                      <span className="relative z-10 flex-1 tracking-[0.01em]">
                        {item.name}
                      </span>
                    )}

                    {!collapsed && item.badge && (
                      <span className={cn(
                        "relative z-10 px-1.5 py-0.5 text-[10px] font-semibold rounded-full",
                        item.badge === 'New'
                          ? "badge-amber"
                          : "badge-neutral"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-linen-dark/50 p-3 space-y-1">
        {!collapsed && <DownloadAppButton variant="sidebar" />}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-espresso-light/70 hover:text-foreground hover:bg-white/50 text-[13px] font-medium rounded-xl transition-colors duration-200",
            collapsed && "justify-center px-2"
          )}
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0 text-espresso-light/50" />
          {!collapsed && <span className="ml-3 tracking-wide">Logout</span>}
        </Button>
      </div>
    </>
  )
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { isOpen, setIsOpen } = useSidebar()

  const handleNavClick = () => setIsOpen(false)

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────── */}
      <div
        className={cn(
          "relative hidden md:flex flex-col glass-sidebar transition-all duration-300",
          collapsed ? "w-[72px]" : "w-[272px]"
        )}
      >
        {/* Header / Logo */}
        <div className={cn(
          "flex h-[68px] items-center border-b border-linen-dark/40",
          collapsed ? "justify-center px-4" : "px-5 gap-3"
        )}>
          {/* Luxury Bespoke Brand Insignia */}
          <BrandLogo size="sm" withGlow />
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-[15px] font-semibold tracking-[0.08em] text-foreground uppercase">
                Pathway
              </span>
              <span className="text-[9px] font-medium tracking-[0.2em] text-espresso-light/50 uppercase">
                Education CRM
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3.5 top-[22px] h-7 w-7 rounded-full border border-linen-dark bg-surface/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all duration-200 z-20"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-espresso-light" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 text-espresso-light" />
          )}
        </Button>

        <NavContent collapsed={collapsed} />
      </div>

      {/* ── Mobile Drawer ──────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-espresso/20 backdrop-blur-[2px] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[288px] flex flex-col glass-sidebar transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden shadow-glass-lg",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="flex h-[68px] items-center justify-between px-5 border-b border-linen-dark/40">
          <div className="flex items-center gap-3">
            {/* Luxury Bespoke Brand Insignia */}
            <BrandLogo size="sm" withGlow />
            <div className="flex flex-col leading-tight">
              <span className="text-[15px] font-semibold tracking-[0.08em] text-foreground uppercase">
                Pathway
              </span>
              <span className="text-[9px] font-medium tracking-[0.2em] text-espresso-light/50 uppercase">
                Education CRM
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-white/60 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4 text-espresso-light" />
          </Button>
        </div>

        <NavContent collapsed={false} onNavClick={handleNavClick} />
      </div>
    </>
  )
}
