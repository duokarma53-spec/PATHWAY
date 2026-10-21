import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: string
  trendPositive?: boolean
  icon: React.ElementType
  iconColor?: string
  iconBg?: string
  className?: string
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendPositive = true,
  icon: Icon,
  iconColor = "text-orange-400",
  iconBg,
  className,
}: KPICardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden group border border-white/[0.08] bg-[#181310]/85 backdrop-blur-md rounded-2xl shadow-md shadow-black/30 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300",
        className
      )}
    >
      {/* Subtle warm corner ambient glow */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 w-24 h-24 rounded-full bg-orange-500/[0.03] blur-2xl group-hover:bg-orange-500/[0.08] group-hover:scale-125 transition-all duration-500"
        aria-hidden="true"
      />

      <CardContent className="p-5 md:p-5.5 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 min-w-0">
            <p className="text-[11px] font-semibold text-[#897B70] uppercase tracking-wider truncate">
              {title}
            </p>
            <div className="text-2xl md:text-3xl font-bold tracking-tight text-[#F8F5F1] font-mono-numbers">
              {value}
            </div>
          </div>
          <div
            className={cn(
              "h-10 w-10 md:h-11 md:w-11 rounded-xl flex items-center justify-center shrink-0 border border-white/[0.08] bg-white/[0.03] group-hover:border-orange-500/25 group-hover:bg-orange-500/5 transition-all duration-300 shadow-inner",
              iconBg
            )}
          >
            <Icon className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-105", iconColor)} />
          </div>
        </div>

        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-3.5 pt-3 border-t border-white/[0.06] text-xs">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center font-medium px-1.5 py-0.5 rounded-md text-[11px] border shrink-0",
                  trendPositive
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
                    : "text-rose-400 bg-rose-500/10 border-rose-500/25"
                )}
              >
                {trendPositive ? (
                  <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
                )}
                {trend}
              </span>
            )}
            {subtitle && (
              <span className="text-[#897B70] text-[11.5px] truncate leading-tight">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
