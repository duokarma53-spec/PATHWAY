"use client"

import { Bell, Search, Menu, Plus } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { QuickAddButton } from "../actions/quick-actions"

export function Topbar() {
  return (
    <div className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 shadow-sm z-10">
      {/* Mobile Menu */}
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        {/* Global Search */}
        <div className="relative w-full max-w-lg hidden md:flex items-center group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Search students, leads, applications..."
            className="w-full bg-muted/30 hover:bg-muted/50 focus:bg-background pl-10 pr-12 py-2 border-border/50 shadow-none transition-all duration-200 h-10 rounded-full"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Add */}
        <div className="hidden sm:flex">
          <QuickAddButton className="h-9 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 shadow-sm" />
        </div>

        <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full hover:bg-muted/50">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-accent ring-2 ring-card"></span>
        </Button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="flex flex-col text-right hidden md:flex">
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Admin User</span>
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Super Admin</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center border border-border group-hover:border-primary/30 transition-colors">
            <span className="text-xs font-semibold text-primary">AU</span>
          </div>
        </div>
      </div>
    </div>
  )
}
