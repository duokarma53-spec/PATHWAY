"use client"

import * as React from "react"
import { Search, Menu } from "lucide-react"
import { Button } from "../ui/button"
import { useSidebar } from "@/contexts/sidebar-context"
import { GlobalSearchDialog } from "./global-search-dialog"
import { NotificationDropdown } from "./notification-dropdown"
import { CRMQuickActions } from "../actions/crm-quick-actions"
import { DownloadAppButton } from "../pwa/install-prompt"

export function Topbar() {
  const { setIsOpen } = useSidebar()
  const [searchOpen, setSearchOpen] = React.useState(false)

  return (
    <>
      <div className="flex h-[68px] items-center justify-between glass-topbar px-4 md:px-7 z-20 shrink-0">
        {/* Left: Mobile menu + Search */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 shrink-0 text-espresso-light hover:text-foreground hover:bg-white/50"
            onClick={() => setIsOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

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
        <div className="flex items-center gap-2.5 shrink-0">
          <DownloadAppButton />
          <CRMQuickActions />

          <div className="h-5 w-px bg-linen-dark/60 mx-1 hidden sm:block" />

          <NotificationDropdown />

          {/* Profile pill */}
          <div className="flex items-center gap-2.5 pl-2 cursor-pointer group select-none">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[12.5px] font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                Owner
              </span>
              <span className="text-[9px] font-bold text-amber-700 tracking-[0.16em] uppercase">
                SUPER ADMIN
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#E6B85C] via-[#C9944A] to-[#8C5D23]
              border border-[#FBE6B5]/80 flex items-center justify-center
              text-white font-serif font-bold text-[12px] shadow-warm
              group-hover:scale-105 group-hover:shadow-warm transition-all duration-200">
              OW
            </div>
          </div>
        </div>
      </div>

      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
