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
      <div className="flex h-[68px] items-center justify-between glass-topbar px-4 md:px-7 z-20 shrink-0">
        {/* Left: Mobile menu + Search */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 shrink-0 text-espresso-light hover:text-foreground hover:bg-white/50"
            onClick={() => setIsOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Mobile Topbar Brand Logo */}
          <div className="flex md:hidden items-center gap-2 select-none">
            <BrandLogo size="xs" withGlow={false} />
            <span className="text-[13px] font-bold tracking-[0.06em] text-foreground uppercase">
              Pathway
            </span>
          </div>

          {/* Global Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex w-full max-w-[380px] items-center gap-3
              bg-white/55 hover:bg-white/80 border border-linen-dark/60
              hover:border-primary/35 px-3.5 py-2.5 rounded-xl text-left
              transition-all duration-200 group shadow-sm backdrop-blur-sm"
          >
            <Search className="h-[15px] w-[15px] text-espresso-light/50 group-hover:text-primary transition-colors shrink-0" />
            <span className="text-[12.5px] text-espresso-light/55 group-hover:text-foreground/70 flex-1 truncate font-medium tracking-wide">
              Search leads, students, universities…
            </span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded-md border border-linen-dark bg-surface/60 px-1.5 font-mono text-[10px] font-medium text-espresso-light/50 backdrop-blur-sm">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions + Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <DownloadAppButton />

          {/* Direct Instagram Quick Access Button */}
          <a
            href="https://www.instagram.com/pathwayeduconsultancy?stkn=YnY3M2R0MzFwNzk="
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center justify-center h-9 w-9 rounded-xl border border-pink-500/25 bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-purple-600/10 text-pink-600 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 group"
            title="Open Official Instagram (@pathwayeduconsultancy)"
            aria-label="Official Instagram"
          >
            <InstagramIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
          </a>

          {/* Quick Create visible on desktop/tablets; hidden on mobile to prevent header overlap */}
          <div className="hidden md:block">
            <CRMQuickActions />
          </div>

          <div className="h-5 w-px bg-linen-dark/60 mx-1 hidden sm:block" />

          <NotificationDropdown />

          {/* Profile pill linking to settings - Features Official Circular Logo */}
          <Link
            href="/settings"
            className="flex items-center gap-2.5 pl-1.5 cursor-pointer group select-none"
            title="Account Settings"
          >
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[12.5px] font-semibold text-foreground group-hover:text-primary transition-colors leading-tight truncate max-w-[120px]">
                {profile.name}
              </span>
              <span className="text-[9px] font-bold text-amber-700 tracking-[0.16em] uppercase">
                {profile.role}
              </span>
            </div>
            <div className="h-9 w-9 rounded-full bg-white border border-[#D4AF37]/70 p-0.5 shadow-sm group-hover:scale-105 group-hover:shadow-[0_0_12px_rgba(212,175,55,0.45)] transition-all duration-200 overflow-hidden flex items-center justify-center shrink-0">
              <img
                src="/images/logo.png"
                alt="Pathway Education"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </Link>
        </div>
      </div>

      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
