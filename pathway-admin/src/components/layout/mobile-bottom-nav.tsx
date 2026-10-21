"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, GraduationCap, CheckSquare, Menu } from "lucide-react";
import { useSidebar } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";

interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebar();

  const navItems: MobileNavItem[] = [
    { label: "Overview", href: "/", icon: LayoutDashboard },
    { label: "Leads", href: "/leads", icon: Users },
    { label: "Students", href: "/students", icon: GraduationCap },
    { label: "Tasks", href: "/tasks", icon: CheckSquare },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#120E0B]/95 backdrop-blur-2xl border-t border-white/[0.08] shadow-2xl transition-all duration-200"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 min-w-[56px]",
                isActive 
                  ? "text-primary font-semibold" 
                  : "text-[#897B70] hover:text-[#BDB0A4]"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5 transition-transform duration-200", isActive && "scale-110 text-primary")} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-primary text-white font-bold text-[9px] flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 h-0.5 w-6 rounded-full bg-primary shadow-[0_0_8px_rgba(255,107,0,0.6)]" />
              )}
            </Link>
          );
        })}

        {/* Full Menu Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 min-w-[56px]",
            isOpen ? "text-primary font-semibold" : "text-[#897B70] hover:text-[#BDB0A4]"
          )}
          aria-label="Open Full Navigation Menu"
        >
          <Menu className={cn("h-5 w-5 transition-transform duration-200", isOpen && "scale-110 text-primary")} />
          <span className="text-[10px] mt-0.5 tracking-tight">More</span>
        </button>
      </div>
    </nav>
  );
}
