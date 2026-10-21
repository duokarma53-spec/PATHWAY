"use client"

import * as React from "react"
import { Search, Menu } from "lucide-react"
import { Button } from "../ui/button"
import { useSidebar } from "@/contexts/sidebar-context"
import { GlobalSearchDialog } from "./global-search-dialog"
import { NotificationDropdown } from "./notification-dropdown"
import { CRMQuickActions } from "../actions/crm-quick-actions"
import { DownloadAppButton } from "../pwa/install-prompt"
import { BrandLogo } from "../ui/brand-logo"
import { InstagramIcon } from "../ui/instagram-icon"
import Link from "next/link"
import { useAdminProfile } from "@/lib/profile/use-admin-profile"

export function Topbar() {
  const { setIsOpen } = useSidebar()
  const [searchOpen, setSearchOpen] = React.useState(false)
  const { profile } = useAdminProfile()

  return (
    <>
      <header className="flex h-[64px] items-center justify-between glass-topbar px-4 md:px-6 z-20 shrink-0 select-none">
        {/* Left: Mobile menu + Global Search Pill */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 shrink-0 text-[#BDB0A4] hover:text-[#F8F5F1] hover:bg-white/[0.06] rounded-xl"
            onClick={() => setIsOpen(true)}
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Mobile Topbar Brand Logo */}
          <div className="flex md:hidden items-center gap-2 select-none">
            <BrandLogo size="xs" withGlow={false} />
            <span className="text-[13px] font-bold tracking-[0.08em] text-[#F8F5F1] uppercase">
              Pathway
            </span>
          </div>

          {/* Global Search Trigger Pill */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex w-full max-w-[280px] items-center gap-2.5
              bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08]
              hover:border-primary/40 px-4 py-1.5 rounded-full text-left
              transition-all duration-200 group shadow-sm backdrop-blur-sm"
            aria-label="Search leads, students, universities"
          >
            <Search className="h-3.5 w-3.5 text-[#897B70] group-hover:text-primary transition-colors shrink-0" />
            <span className="text-[12px] text-[#897B70] group-hover:text-[#BDB0A4] flex-1 truncate font-medium">
              Search...
            </span>
            <kbd className="hidden sm:inline-flex h-4 items-center gap-0.5 rounded border border-white/[0.1] bg-white/[0.05] px-1 font-mono text-[9px] font-medium text-[#897B70]">
              ⌘K
            </kbd>
          </button>

          {/* Operations Pill Badge (matching reference's top pill) */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.07] text-[11px] font-medium text-[#BDB0A4]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Pathway Operations</span>
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <DownloadAppButton />

          {/* Instagram Button — Cohesive Brand Styling */}
          <a
            href="https://www.instagram.com/pathwayeduconsultancy?stkn=YnY3M2R0MzFwNzk="
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center justify-center h-9 w-9 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-[#BDB0A4] hover:text-[#FF8A35] hover:border-primary/40 transition-all duration-200 shadow-sm group"
            title="Open Official Instagram (@pathwayeduconsultancy)"
            aria-label="Official Instagram"
          >
            <InstagramIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
          </a>

          {/* Quick Create visible on desktop/tablets */}
          <div className="hidden md:block">
            <CRMQuickActions />
          </div>

          <div className="h-5 w-px bg-white/[0.08] mx-0.5 hidden sm:block" />

          {/* Real-time Notifications */}
          <NotificationDropdown />

          {/* Profile Pill linking to settings */}
          <Link
            href="/settings"
            className="flex items-center gap-2.5 pl-1.5 cursor-pointer group select-none"
            title="Account Settings"
          >
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[12.5px] font-semibold text-[#F8F5F1] group-hover:text-primary transition-colors leading-tight truncate max-w-[120px]">
                {profile.name}
              </span>
              <span className="text-[9px] font-bold text-[#FF8A35] tracking-[0.16em] uppercase">
                {profile.role}
              </span>
            </div>
            <div className="h-9 w-9 rounded-full bg-[#1D1510] border border-white/[0.12] p-0.5 shadow-sm group-hover:scale-105 group-hover:border-primary/50 group-hover:shadow-[0_0_12px_rgba(255,107,0,0.3)] transition-all duration-200 overflow-hidden flex items-center justify-center shrink-0">
              <img
                src="/images/logo.png"
                alt="Pathway Education"
                width={32}
                height={32}
                style={{ maxWidth: 32, maxHeight: 32, objectFit: "contain", display: "block" }}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </Link>
        </div>
      </header>

      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
